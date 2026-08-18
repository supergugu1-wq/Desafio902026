import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "p90-admin-session";
const SESSION_SECONDS = 60 * 60 * 12;

function adminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret) return null;
  return { username, password, secret };
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function adminIsConfigured() {
  return Boolean(adminConfig());
}

export function validateAdminCredentials(username: string, password: string) {
  const config = adminConfig();
  if (!config) return false;
  return safeEqual(username, config.username) && safeEqual(password, config.password);
}

export async function createAdminSession() {
  const config = adminConfig();
  if (!config) throw new Error("Admin não configurado.");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${config.username}:${expires}`;
  const token = `${expires}.${signature(payload, config.secret)}`;
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
}

export async function hasValidAdminSession() {
  const config = adminConfig();
  if (!config) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expiresRaw, provided] = token.split(".");
  const expires = Number(expiresRaw);
  if (!expires || !provided || expires < Math.floor(Date.now() / 1000)) return false;
  const expected = signature(`${config.username}:${expires}`, config.secret);
  return safeEqual(provided, expected);
}
