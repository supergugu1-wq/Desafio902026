import { requestPasswordReset, signIn } from "./login-actions";

const errors: Record<string,string> = {
  login: "Faça login para acessar o programa.",
  campos: "Preencha e-mail e senha.",
  credenciais: "E-mail ou senha incorretos.",
  email: "Informe seu e-mail de compra.",
  configuracao: "A plataforma ainda não foi conectada ao sistema de acesso.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string; mensagem?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <main className="auth-page">
    <section className="auth-showcase">
      <div className="auth-brand"><span>P90</span><div><b>PROJETO 90 DIAS</b><small>Transformação sustentável</small></div></div>
      <div className="auth-copy"><span className="eyebrow">ÁREA EXCLUSIVA PARA ALUNOS</span><h1>Seu novo estilo de vida começa agora.</h1><p>Treino masculino ou feminino, academia ou casa, alimentação inteligente e acompanhamento completo durante 90 dias.</p><div className="auth-benefits"><span>✓ Plano personalizado</span><span>✓ Progresso protegido</span><span>✓ Acesso vinculado à compra</span></div></div>
      <small className="auth-legal">Conteúdo educativo. Resultados variam conforme perfil, saúde e consistência.</small>
    </section>
    <section className="auth-panel">
      <div className="auth-box"><span className="tag">ACESSO SEGURO</span><h2>Entrar na plataforma</h2><p>Use o mesmo e-mail informado na compra pela Kiwify.</p>
        {!configured && <div className="auth-alert warning"><b>Configuração necessária</b><span>Adicione as variáveis do Supabase na Vercel antes de liberar o acesso.</span></div>}
        {params.erro && <div className="auth-alert">{errors[params.erro] || "Não foi possível entrar."}</div>}
        {params.mensagem === "recuperacao" && <div className="auth-alert success">Enviamos as instruções de acesso, caso o e-mail esteja cadastrado.</div>}
        <form action={signIn} className="auth-form"><label>E-mail da compra<input name="email" type="email" autoComplete="email" required placeholder="voce@email.com"/></label><label>Senha<input name="password" type="password" autoComplete="current-password" required minLength={8} placeholder="Sua senha"/></label><button disabled={!configured}>ENTRAR NO PROJETO →</button></form>
        <details className="recover"><summary>Esqueci minha senha</summary><form action={requestPasswordReset}><input name="email" type="email" required placeholder="E-mail usado na compra"/><button disabled={!configured}>ENVIAR LINK SEGURO</button></form></details>
        <p className="auth-support">Compra aprovada e acesso não liberado? Entre em contato com o suporte cadastrado no checkout.</p>
      </div>
    </section>
  </main>;
}
