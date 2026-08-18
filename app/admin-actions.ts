"use server";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

export async function adminSignIn(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  if (!username || !password) redirect("/admin?erro=campos");
  if (!validateAdminCredentials(username, password)) redirect("/admin?erro=credenciais");
  await createAdminSession();
  redirect("/plataforma");
}

export async function adminSignOut() {
  await clearAdminSession();
  redirect("/admin");
}
