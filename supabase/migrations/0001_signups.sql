-- Signups table for waitlist (landing v0).
-- One row per email. Honeypot-flagged rows go in with is_spam=true so we can
-- audit bot patterns later. Anon role cannot read this table at all.

create table if not exists signups (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  role         text,
  company      text,
  industry     text,
  source       text default 'landing-v0',
  ip_country   text,
  user_agent   text,
  honeypot     text,
  is_spam      boolean default false,
  confirmed_at timestamptz,
  created_at   timestamptz not null default now()
);

-- Only one non-spam row per email (case-insensitive). Spam rows are allowed
-- to duplicate so we can fingerprint bots.
create unique index if not exists signups_email_unique
  on signups(lower(email))
  where is_spam = false;

create index if not exists idx_signups_created_at on signups(created_at desc);

alter table signups enable row level security;

-- Anon role gets no read access. All reads go through service-role API.
drop policy if exists signups_no_anon_select on signups;
create policy signups_no_anon_select on signups
  for select to anon
  using (false);
