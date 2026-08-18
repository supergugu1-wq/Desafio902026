export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, getCurrentUser, restSelect } from "@/lib/supabase/rest";
import { hasValidAdminSession } from "@/lib/admin-auth";
import { signOut } from "../login-actions";
import { adminSignOut } from "../admin-actions";

type Access={status:string;access_expires_at:string|null};
export default async function PlatformLayout({children}:{children:React.ReactNode}){
 const isAdmin=await hasValidAdminSession();
 if(isAdmin){
   return <><div className="secure-session"><span>👑 Administrador • acesso total</span><small>Modo proprietário</small><form action={adminSignOut}><button>Sair</button></form></div>{children}</>;
 }
 const user=await getCurrentUser(); if(!user||!user.email)redirect("/");
 const store=await cookies();
 const token=store.get(ACCESS_COOKIE)?.value;
 const rows=await restSelect<Access[]>("access_control",`select=status,access_expires_at&email=eq.${encodeURIComponent(user.email.toLowerCase())}&order=updated_at.desc&limit=1`,token);
 const access=rows[0]; const expired=Boolean(access?.access_expires_at&&new Date(access.access_expires_at)<new Date());
 if(!access||access.status!=="active"||expired)redirect(`/acesso-bloqueado?motivo=${expired?"expirado":access?.status||"sem-acesso"}`);
 return <><div className="secure-session"><span>🔒 Sessão protegida</span><small>{user.email}</small><form action={signOut}><button>Sair</button></form></div>{children}</>;
}
