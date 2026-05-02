-- Run in Supabase SQL editor (or via supabase CLI).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  sector      text,
  message     text not null,
  source      text default 'website',
  status      text default 'new'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No public read or write. Inserts go via the service role key from the API route.
drop policy if exists "leads no public" on public.leads;
create policy "leads no public" on public.leads for all using (false);
