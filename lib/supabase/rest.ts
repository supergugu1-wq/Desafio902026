import { cookies } from "next/headers";

export const ACCESS_COOKIE = "p90-access-token";
export const REFRESH_COOKIE = "p90-refresh-token";

export function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Supabase não configurado.");
  return { url: url.replace(/\/$/, ""), anon };
}

export function adminEnv() {
  const base = env();
  const service = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) throw new Error("Chave secreta do Supabase não configurada.");
  return { ...base, service };
}

export async function setSessionCookies(accessToken: string, refreshToken: string, expiresIn = 3600) {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(ACCESS_COOKIE, accessToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: expiresIn });
  store.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  store.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getCurrentUser() {
  const { url, anon } = env();
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<{ id: string; email?: string }>;
}

export async function restSelect<T>(table: string, query: string, token?: string, admin = false): Promise<T> {
  const base = admin ? adminEnv() : env();
  const key = admin ? (base as ReturnType<typeof adminEnv>).service : base.anon;
  const auth = token || key;
  const response = await fetch(`${base.url}/rest/v1/${table}?${query}`, { headers: { apikey: key, Authorization: `Bearer ${auth}`, Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Supabase REST ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function adminRest(table: string, method: "POST"|"PATCH", body: unknown, query = "") {
  const { url, service } = adminEnv();
  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ""}`, {
    method,
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json", Prefer: method === "POST" ? "resolution=merge-duplicates,return=representation" : "return=representation" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase admin REST ${response.status}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
