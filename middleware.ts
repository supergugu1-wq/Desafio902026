import { NextResponse, type NextRequest } from "next/server";
const ACCESS_COOKIE="p90-access-token", REFRESH_COOKIE="p90-refresh-token", ADMIN_COOKIE="p90-admin-session";

export async function middleware(request: NextRequest) {
  const path=request.nextUrl.pathname;
  if(path==="/casa"||path==="/academia"){const u=request.nextUrl.clone();u.pathname="/plataforma";return NextResponse.redirect(u)}
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,"");
  const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!anon)return NextResponse.next();
  let access=request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh=request.cookies.get(REFRESH_COOKIE)?.value;
  let userOk=false;
  if(access){const r=await fetch(`${url}/auth/v1/user`,{headers:{apikey:anon,Authorization:`Bearer ${access}`},cache:"no-store"});userOk=r.ok}
  let response=NextResponse.next();
  if(!userOk&&refresh){const r=await fetch(`${url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:anon,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:refresh}),cache:"no-store"});if(r.ok){const s=await r.json();access=s.access_token;userOk=true;const secure=process.env.NODE_ENV==="production";response.cookies.set(ACCESS_COOKIE,s.access_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:s.expires_in});response.cookies.set(REFRESH_COOKIE,s.refresh_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:2592000})}}
  const hasAdminCookie=Boolean(request.cookies.get(ADMIN_COOKIE)?.value);
  if(path.startsWith("/plataforma")&&!userOk&&!hasAdminCookie){const u=request.nextUrl.clone();u.pathname="/";u.searchParams.set("erro","login");return NextResponse.redirect(u)}
  if(path==="/"&&userOk){const u=request.nextUrl.clone();u.pathname="/plataforma";u.search="";return NextResponse.redirect(u)}
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]};
