-- Measurement pipeline schema. Tables the weekly Worker writes to and the
-- landing reads snapshots from. Adapted from .aria/spec-v0.md §4, trimmed to
-- what the build-only pipeline needs (no subscriptions/claim/audit yet).
--
-- RLS: anon may SELECT industries + companies + leaderboard_snapshots (public
-- leaderboard reads). Everything else is service-role only (RLS enabled, no anon
-- policy → denied; service_role bypasses RLS).

-- ───────────────────────────── engines ─────────────────────────────
create table if not exists engines (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- "chatgpt", "claude", "perplexity", "gemini"
  name        text not null,
  provider    text not null,                 -- "openai", "anthropic", "perplexity", "google"
  model_id    text not null,                 -- "gpt-5", "claude-sonnet-4-6", ...
  tier        text not null default 'default',
  output_cap  int,                           -- max output tokens, null = provider default
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ──────────────────────────── industries ───────────────────────────
create table if not exists industries (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- "universidades-ecuador"
  name        text not null,
  region      text not null default 'Ecuador',
  language    text not null default 'es',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ───────────────────────────── queries ─────────────────────────────
create table if not exists queries (
  id           uuid primary key default gen_random_uuid(),
  industry_id  uuid not null references industries(id) on delete cascade,
  text         text not null,
  category     text not null,
  priority     int not null default 1,        -- 1 weekly (head), 2 monthly (long-tail)
  archived_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique(industry_id, text)
);

create index if not exists idx_queries_industry on queries(industry_id);

-- ───────────────────────────── companies ───────────────────────────
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  industry_id   uuid not null references industries(id) on delete cascade,
  slug          text unique not null,         -- "usfq"
  name          text not null,                -- "USFQ"
  full_name     text,                         -- "Universidad San Francisco de Quito"
  website       text,
  city          text,
  aliases       text[] not null default '{}', -- alternate names the parser matches
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists idx_companies_industry on companies(industry_id);

-- ───────────────────────────── query_runs ──────────────────────────
create table if not exists query_runs (
  id            uuid primary key default gen_random_uuid(),
  query_id      uuid not null references queries(id) on delete cascade,
  engine_id     uuid not null references engines(id),
  run_at        timestamptz not null default now(),
  response_raw  text not null,
  cost_usd      numeric(10,5),
  tokens_in     int,
  tokens_out    int,
  cache_hit     boolean not null default false,
  batch_id      text,                          -- Batch API job id, when batched
  created_at    timestamptz not null default now()
);

create index if not exists idx_query_runs_query_engine_date
  on query_runs(query_id, engine_id, run_at desc);

-- ───────────────────────────── citations ───────────────────────────
create table if not exists citations (
  id            uuid primary key default gen_random_uuid(),
  query_run_id  uuid not null references query_runs(id) on delete cascade,
  company_id    uuid not null references companies(id),
  position      int,                           -- 1-based first-occurrence position
  snippet       text,
  source_url    text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_citations_company_date
  on citations(company_id, created_at desc);
create index if not exists idx_citations_run on citations(query_run_id);

-- ────────────────────── leaderboard_snapshots ──────────────────────
create table if not exists leaderboard_snapshots (
  id            uuid primary key default gen_random_uuid(),
  industry_id   uuid not null references industries(id) on delete cascade,
  week_starting date not null,                 -- ISO week Monday
  rankings      jsonb not null,                -- [{company_id, slug, position, citation_rate, share_of_voice, per_engine, change_vs_prev}, ...]
  total_queries int not null,
  engines_used  text[] not null,
  created_at    timestamptz not null default now(),
  unique(industry_id, week_starting)
);

create index if not exists idx_snapshots_industry_week
  on leaderboard_snapshots(industry_id, week_starting desc);

-- ───────────────────────────────── RLS ─────────────────────────────
alter table engines               enable row level security;
alter table industries            enable row level security;
alter table queries               enable row level security;
alter table companies             enable row level security;
alter table query_runs            enable row level security;
alter table citations             enable row level security;
alter table leaderboard_snapshots enable row level security;

-- Public read for the leaderboard surface only.
drop policy if exists industries_anon_select on industries;
create policy industries_anon_select on industries
  for select to anon using (active = true);

drop policy if exists companies_anon_select on companies;
create policy companies_anon_select on companies
  for select to anon using (active = true);

drop policy if exists snapshots_anon_select on leaderboard_snapshots;
create policy snapshots_anon_select on leaderboard_snapshots
  for select to anon using (true);

-- engines, queries, query_runs, citations: no anon policy → anon denied.
-- All writes + sensitive reads go through the service role (bypasses RLS).
