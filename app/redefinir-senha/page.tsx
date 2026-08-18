import { updatePassword } from "./actions";
export default async function Reset({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  return <main className="blocked-page"><div className="blocked-card reset-card"><small>PRIMEIRO ACESSO</small><h1>Crie sua senha</h1><p>Use pelo menos 8 caracteres e não compartilhe sua senha.</p>{params.erro && <div className="auth-alert">As senhas precisam ser iguais e ter pelo menos 8 caracteres.</div>}<form action={updatePassword} className="auth-form"><label>Nova senha<input name="password" type="password" minLength={8} required/></label><label>Confirmar senha<input name="confirm" type="password" minLength={8} required/></label><button>SALVAR E ENTRAR</button></form></div></main>;
}
