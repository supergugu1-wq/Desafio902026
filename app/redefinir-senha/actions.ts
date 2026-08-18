"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, env } from "@/lib/supabase/rest";
export async function updatePassword(formData:FormData){const password=String(formData.get("password")||"");const confirm=String(formData.get("confirm")||"");if(password.length<8||password!==confirm)redirect("/redefinir-senha?erro=senha");const store=await cookies();const token=store.get(ACCESS_COOKIE)?.value;if(!token)redirect("/?erro=credenciais");const {url,anon}=env();const r=await fetch(`${url}/auth/v1/user`,{method:"PUT",headers:{apikey:anon,Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({password}),cache:"no-store"});if(!r.ok)redirect("/redefinir-senha?erro=sessao");redirect("/plataforma")}
