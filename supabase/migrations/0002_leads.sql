-- Consultancy leads (contacto form). One row per submission — leads, not
-- signups, so duplicates from the same email are allowed. Honeypot-flagged rows
-- go in with is_spam=true for later auditing. Anon role cannot read this table.

create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  company      text,
  industry     text,
  message      text,
  source       text default 'contacto',
  is_spam      boolean default false,
  ip_country   text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_leads_created_at on leads(created_at desc);

alter table leads enable row level security;

-- Anon role gets no read access. All writes go through the service-role API.
drop policy if exists leads_no_anon_select on leads;
create policy leads_no_anon_select on leads
  for select to anon
  using (false);
