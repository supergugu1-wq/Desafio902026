import { signOut } from "../login-actions";

const messages: Record<string,string> = {
  refunded: "A compra vinculada a este acesso foi reembolsada.",
  chargeback: "A compra vinculada a este acesso recebeu uma contestação de pagamento.",
  cancelled: "A assinatura vinculada a este acesso foi cancelada.",
  blocked: "Este acesso foi bloqueado pela administração.",
  expirado: "O período de acesso ao programa chegou ao fim.",
  "sem-acesso": "Não encontramos uma compra ativa vinculada a este e-mail.",
};
export default async function Blocked({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const params = await searchParams;
  const message = messages[params.motivo || ""] || "Seu acesso não está ativo no momento.";
  return <main className="blocked-page"><div className="blocked-card"><span>🔒</span><small>PROJETO 90 DIAS</small><h1>Acesso indisponível</h1><p>{message}</p><p className="muted">Caso acredite que isso aconteceu por engano, envie ao suporte o e-mail utilizado na compra e o comprovante de pagamento.</p><form action={signOut}><button>VOLTAR AO LOGIN</button></form></div></main>;
}
