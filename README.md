# Projeto 90 Dias — animações internas + acesso seguro

Esta versão adiciona login pelo Supabase, páginas protegidas e bloqueio automático por webhook da Kiwify.


## Versão atual

- Todos os exercícios usam demonstrações animadas dentro da plataforma, sem abrir YouTube.
- O modo **Em casa** usa movimentos de peso corporal e objetos domésticos simples, sem máquinas de academia.
- O login, a validação de acesso no Supabase e o bloqueio por status da compra Kiwify foram preservados.
- A rota `/plataforma` continua protegida no servidor antes de renderizar o conteúdo.

## 1. Criar o banco

1. Crie um projeto no Supabase.
2. Abra **SQL Editor**.
3. Cole e execute todo o arquivo `supabase.sql`.
4. Em **Authentication > URL Configuration**, defina o domínio da Vercel como Site URL.
5. Adicione como Redirect URL: `https://SEU-DOMINIO/auth/callback` e `https://SEU-DOMINIO/auth/confirm`.

## 2. Variáveis na Vercel

Copie as variáveis de `.env.example` para **Vercel > Project > Settings > Environment Variables**.

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` no GitHub, em páginas do navegador ou com prefixo `NEXT_PUBLIC_`.

Depois de cadastrar as variáveis, faça um novo deploy.

## 3. Configurar o webhook Kiwify

Use esta URL na Kiwify:

`https://SEU-DOMINIO/api/webhooks/kiwify?secret=SUA_SENHA_DO_KIWIFY_WEBHOOK_SECRET`

Selecione os eventos de compra aprovada, reembolso, chargeback, assinatura cancelada, atrasada e renovada. A Kiwify envia webhooks em JSON, mas os nomes/caminhos do payload podem variar. Faça primeiro uma venda de teste e confira os logs da função na Vercel. A rota já reconhece diversos nomes comuns e ignora eventos desconhecidos com segurança.

## 4. Fluxo

- Compra aprovada: cria/invita o aluno, registra acesso ativo e envia e-mail para criação da senha.
- Reembolso/chargeback/cancelamento: altera o status e bloqueia a plataforma.
- A página `/plataforma` valida a sessão e o status no servidor antes de mostrar o conteúdo.
- O segredo do webhook é comparado de forma segura e eventos repetidos são ignorados.

## 5. Antes de vender

- Configure SMTP próprio no Supabase para melhorar a entrega dos e-mails.
- Teste compra, primeiro acesso, redefinição de senha, reembolso e novo login.
- Confira se a política de reembolso, suporte e privacidade estão visíveis no checkout.
- O progresso do programa ainda é salvo no navegador. A segurança de acesso está no banco; uma próxima evolução pode mover peso, cargas e refeições para o Supabase.

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Login exclusivo do administrador

A versão inclui uma rota separada em `/admin` para o proprietário visualizar toda a plataforma sem depender de uma compra Kiwify.

Na Vercel, em **Settings > Environment Variables**, crie:

- `ADMIN_USERNAME`: seu usuário exclusivo.
- `ADMIN_PASSWORD`: senha forte de pelo menos 12 caracteres.
- `ADMIN_SESSION_SECRET`: chave aleatória longa (recomendado 32+ caracteres).

Esses valores **não devem ser colocados no GitHub**. O arquivo `.env.example` contém apenas exemplos.

Depois do deploy, abra `https://seu-dominio.com/admin`, faça login e o sistema liberará `/plataforma` em modo proprietário. O acesso administrativo usa cookie `httpOnly`, `SameSite=Strict`, expira em 12 horas e é assinado no servidor. Clientes continuam usando o login normal e a validação de compra/status da Kiwify.
