import { adminIsConfigured, hasValidAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { adminSignIn } from "../admin-actions";

const errors: Record<string,string> = {
  campos: "Preencha usuário e senha.",
  credenciais: "Usuário ou senha de administrador incorretos.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  if (await hasValidAdminSession()) redirect("/plataforma");
  const configured = adminIsConfigured();
  return <main className="auth-page">
    <section className="auth-showcase">
      <div className="auth-brand"><span>P90</span><div><b>PROJETO 90 DIAS</b><small>Painel do proprietário</small></div></div>
      <div className="auth-copy"><span className="eyebrow">ACESSO DO ADMINISTRADOR</span><h1>Visualize toda a plataforma sem depender da Kiwify.</h1><p>Este acesso é exclusivo do proprietário e libera academia, treino em casa, dieta, calendário e todas as demonstrações.</p><div className="auth-benefits"><span>✓ Acesso total</span><span>✓ Sessão protegida</span><span>✓ Separado dos alunos</span></div></div>
      <small className="auth-legal">Não compartilhe suas credenciais administrativas.</small>
    </section>
    <section className="auth-panel">
      <div className="auth-box"><span className="tag">ADMINISTRADOR</span><h2>Entrar como proprietário</h2><p>Use as credenciais administrativas cadastradas nas variáveis seguras da Vercel.</p>
        {!configured && <div className="auth-alert warning"><b>Admin ainda não configurado</b><span>Cadastre ADMIN_USERNAME, ADMIN_PASSWORD e ADMIN_SESSION_SECRET na Vercel.</span></div>}
        {params.erro && <div className="auth-alert">{errors[params.erro] || "Não foi possível entrar."}</div>}
        <form action={adminSignIn} className="auth-form"><label>Usuário<input name="username" autoComplete="username" required placeholder="Seu usuário admin"/></label><label>Senha<input name="password" type="password" autoComplete="current-password" required minLength={12} placeholder="Sua senha administrativa"/></label><button disabled={!configured}>ENTRAR COMO ADMIN →</button></form>
        <p className="auth-support"><a href="/">Voltar para o login dos alunos</a></p>
      </div>
    </section>
  </main>;
}
