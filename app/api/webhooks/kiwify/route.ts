import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminEnv, adminRest, restSelect } from "@/lib/supabase/rest";

export const runtime = "nodejs";
type AnyRecord = Record<string, any>;

function normalize(v: unknown) {
  return String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function first(p: AnyRecord, paths: string[]) {
  for (const path of paths) {
    const v = path.split(".").reduce<any>((c, k) => c?.[k], p);
    if (v !== undefined && v !== null && v !== "") return v;
  }
}
function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

// Eventos oficiais da Kiwify + aliases legados tolerados.
const statusByEvent: Record<string, string> = {
  compra_aprovada: "active",
  purchase_approved: "active",
  approved: "active",
  paid: "active",
  subscription_renewed: "active",
  assinatura_renovada: "active",
  compra_reembolsada: "refunded",
  reembolso: "refunded",
  refunded: "refunded",
  refund: "refunded",
  chargeback: "chargeback",
  subscription_canceled: "cancelled",
  subscription_cancelled: "cancelled",
  assinatura_cancelada: "cancelled",
  subscription_late: "blocked",
  assinatura_atrasada: "blocked",
};

async function findUserByEmail(email: string) {
  const { url, service } = adminEnv();
  for (let page = 1; page <= 10; page++) {
    const r = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers: { apikey: service, Authorization: `Bearer ${service}` }, cache: "no-store" });
    if (!r.ok) throw new Error(`Falha ao listar usuários: ${await r.text()}`);
    const data = await r.json();
    const users = Array.isArray(data) ? data : (data.users || []);
    const found = users.find((u: any) => u.email?.toLowerCase() === email);
    if (found || users.length < 1000) return found;
  }
  return undefined;
}

async function invite(email: string, name: string, redirectTo: string) {
  const { url, service } = adminEnv();
  const r = await fetch(`${url}/auth/v1/invite`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, data: { full_name: name }, redirect_to: redirectTo }),
    cache: "no-store",
  });
  if (!r.ok) {
    const text = await r.text();
    if (!text.toLowerCase().includes("already")) throw new Error(`Falha ao convidar: ${text}`);
    return null;
  }
  return r.json();
}

export async function POST(request: NextRequest) {
  try {
    const expected = process.env.KIWIFY_WEBHOOK_SECRET;
    if (!expected) return NextResponse.json({ error: "Webhook não configurado" }, { status: 503 });

    const payload = await request.json() as AnyRecord;
    const received = request.nextUrl.searchParams.get("secret")
      || request.headers.get("x-webhook-secret")
      || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
      || String(first(payload, ["token", "webhook_token", "data.token"]) || "");
    if (!received || !safeEqual(received, expected)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const event = normalize(first(payload, ["webhook_event_type", "event", "event_type", "type", "status", "order_status", "data.event"]));
    const newStatus = statusByEvent[event];
    if (!newStatus) return NextResponse.json({ received: true, ignored: true, event });

    const email = String(first(payload, ["Customer.email", "customer.email", "buyer.email", "data.customer.email", "email"]) || "").trim().toLowerCase();
    const fullName = String(first(payload, ["Customer.full_name", "Customer.name", "customer.name", "buyer.name", "data.customer.name", "name"]) || "").trim();
    const orderId = String(first(payload, ["order_id", "Order.order_id", "order.id", "data.order_id", "sale_id", "id"]) || "").trim();
    const productId = String(first(payload, ["Product.product_id", "product_id", "product.id", "data.product_id"]) || "").trim();

    if (!email || !orderId) return NextResponse.json({ error: "Payload sem e-mail ou pedido" }, { status: 400 });
    if (process.env.KIWIFY_PRODUCT_ID && productId !== process.env.KIWIFY_PRODUCT_ID) {
      return NextResponse.json({ received: true, ignored: true, reason: "produto diferente" });
    }

    const eventKey = `${orderId}:${event}`;
    const duplicates = await restSelect<any[]>("webhook_events", `select=id&event_key=eq.${encodeURIComponent(eventKey)}&limit=1`, undefined, true);
    if (duplicates.length) return NextResponse.json({ received: true, duplicate: true });

    let user = await findUserByEmail(email);
    if (newStatus === "active" && !user) {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/auth/callback?next=/redefinir-senha`;
      user = await invite(email, fullName, redirectTo) || await findUserByEmail(email);
    }

    const now = new Date();
    const days = Math.max(1, Number(process.env.ACCESS_DURATION_DAYS || 90));
    const expires = new Date(now.getTime() + days * 86400000).toISOString();

    await adminRest("access_control", "POST", {
      user_id: user?.id || null,
      email,
      full_name: fullName,
      kiwify_order_id: orderId,
      product_id: productId || null,
      status: newStatus,
      access_started_at: newStatus === "active" ? now.toISOString() : null,
      access_expires_at: newStatus === "active" ? expires : null,
      updated_at: now.toISOString(),
    }, "on_conflict=kiwify_order_id");

    // Guarda apenas o mínimo necessário para auditoria, evitando persistir dados de pagamento/CPF.
    await adminRest("webhook_events", "POST", {
      event_key: eventKey,
      event_name: event,
      order_id: orderId,
      payload: { event, email, order_id: orderId, product_id: productId || null, status: newStatus },
    });

    return NextResponse.json({ received: true, status: newStatus });
  } catch (error) {
    console.error("Kiwify webhook error", error);
    return NextResponse.json({ error: "Erro interno ao processar webhook" }, { status: 500 });
  }
}
