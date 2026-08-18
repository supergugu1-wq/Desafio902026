-- Execute todo este arquivo no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.access_control (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  kiwify_order_id text not null unique,
  product_id text,
  status text not null default 'pending' check (status in ('pending','active','refunded','chargeback','cancelled','expired','blocked')),
  access_started_at timestamptz,
  access_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists access_control_email_idx on public.access_control (lower(email));

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  event_name text not null,
  order_id text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

alter table public.access_control enable row level security;
alter table public.webhook_events enable row level security;

revoke all on public.webhook_events from anon, authenticated;
revoke insert, update, delete on public.access_control from anon, authenticated;

drop policy if exists "Aluno consulta o próprio acesso" on public.access_control;
create policy "Aluno consulta o próprio acesso"
on public.access_control for select
to authenticated
using (
  auth.uid() = user_id
  or lower(coalesce(auth.jwt() ->> 'email','')) = lower(email)
);
