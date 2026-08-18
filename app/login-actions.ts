"use server";
import { redirect } from "next/navigation";
import { clearSessionCookies, env, setSessionCookies } from "@/lib/supabase/rest";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) redirect("/?erro=campos");
  const { url, anon } = env();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, { method:"POST", headers:{ apikey:anon, "Content-Type":"application/json" }, body:JSON.stringify({email,password}), cache:"no-store" });
  if (!response.ok) redirect("/?erro=credenciais");
  const session = await response.json();
  await setSessionCookies(session.access_token, session.refresh_token, session.expires_in);
  redirect("/plataforma");
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) redirect("/?erro=email");
  const { url, anon } = env();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(`${origin}/auth/callback?next=/redefinir-senha`)}`, { method:"POST", headers:{apikey:anon,"Content-Type":"application/json"}, body:JSON.stringify({email}), cache:"no-store" });
  redirect("/?mensagem=recuperacao");
}

export async function signOut() { await clearSessionCookies(); redirect("/"); }
