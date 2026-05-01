-- yinandyang.ai — database schema
-- Run this in Supabase SQL editor or via psql.
-- Idempotent where reasonable; safe to re-run during dev.

-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. BUSINESSES — the Business Context Core. One per user (for now).
-- ============================================================================
create table if not exists public.businesses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  industry        text not null,           -- e.g. "ecommerce", "agency", "saas", "creator"
  audience        text,                     -- "Who do you sell to?"
  primary_goal    text not null,            -- "What do you want AI to help with first?"
  current_tools   text[] default '{}',      -- ["Shopify", "Klaviyo", "Notion"]
  monthly_revenue text,                     -- bucketed: "<10k", "10-50k", "50-250k", "250k+"
  team_size       text,                     -- "solo", "2-5", "6-20", "20+"
  constraints     text,                     -- free-text "anything we should know?"
  context_summary text,                     -- AI-generated single-paragraph summary cached for prompt injection
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id) -- v1: one business per user
);

create index if not exists businesses_user_id_idx on public.businesses(user_id);

-- ============================================================================
-- 2. LESSONS — Learning Engine content. Mostly read-only at runtime.
-- ============================================================================
create table if not exists public.lessons (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  title           text not null,
  track           text not null,            -- "fundamentals", "customer-ops", "sales", "content"
  position        int not null,             -- ordering within track
  duration_min    int not null default 5,
  summary         text not null,            -- one-liner for cards
  body_md         text not null,            -- the lesson itself
  action_prompt   text,                     -- "Apply to my business" CTA — populates a workflow synthesis
  required_tier   text not null default 'free', -- 'free' | 'pro' | 'operator'
  published       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists lessons_track_position_idx on public.lessons(track, position);

-- Lesson progress per user
create table if not exists public.lesson_progress (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  lesson_id       uuid not null references public.lessons(id) on delete cascade,
  status          text not null default 'in_progress', -- 'in_progress' | 'completed'
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);

-- ============================================================================
-- 3. WORKFLOW TEMPLATES — curated starting points for the System Builder
-- ============================================================================
create table if not exists public.workflow_templates (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  category        text not null,            -- "customer-support", "lead-gen", "content", "ops"
  archetype       text not null,            -- "AI Sales Rep", "AI Operations Manager", "AI Content Engine"
  short_pitch     text not null,            -- one-line value prop for card
  description_md  text not null,            -- detailed description for the template page
  default_graph   jsonb not null,           -- starting WorkflowGraph (see lib/types.ts)
  required_tier   text not null default 'free',
  created_at      timestamptz not null default now()
);

create index if not exists workflow_templates_category_idx on public.workflow_templates(category);

-- ============================================================================
-- 4. WORKFLOWS — a user's instance of a system. Created via Build With Me.
-- ============================================================================
create table if not exists public.workflows (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  template_id     uuid references public.workflow_templates(id) on delete set null,
  name            text not null,
  description     text,
  graph           jsonb not null,           -- editable WorkflowGraph
  status          text not null default 'draft', -- 'draft' | 'active' | 'paused' | 'archived'
  activated_at    timestamptz,
  last_run_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists workflows_business_idx on public.workflows(business_id);
create index if not exists workflows_status_idx on public.workflows(status);

-- ============================================================================
-- 5. WORKFLOW_RUNS — every execution. The core of the flywheel.
-- ============================================================================
create table if not exists public.workflow_runs (
  id              uuid primary key default uuid_generate_v4(),
  workflow_id     uuid not null references public.workflows(id) on delete cascade,
  business_id     uuid not null references public.businesses(id) on delete cascade,
  trigger         text not null default 'manual', -- 'manual' | 'scheduled' | 'webhook'
  status          text not null default 'running', -- 'running' | 'success' | 'error'
  input           jsonb,
  output          jsonb,
  error           text,
  ai_tokens_in    int default 0,
  ai_tokens_out   int default 0,
  cost_usd        numeric(10, 4) default 0,
  latency_ms      int,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz
);

create index if not exists workflow_runs_workflow_idx on public.workflow_runs(workflow_id);
create index if not exists workflow_runs_business_started_idx on public.workflow_runs(business_id, started_at desc);

-- ============================================================================
-- 6. RECOMMENDATIONS — Continuous Evolution Engine output
-- ============================================================================
create table if not exists public.recommendations (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  kind            text not null,            -- 'new_workflow' | 'optimize_workflow' | 'next_lesson'
  title           text not null,
  rationale       text not null,
  cta_label       text not null default 'Build it',
  cta_target      text not null,            -- e.g. '/build/lead-qualifier' or '/learn/some-lesson'
  priority        int not null default 50,  -- 0-100
  dismissed       boolean not null default false,
  acted_on        boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists recommendations_business_priority_idx
  on public.recommendations(business_id, priority desc)
  where not dismissed and not acted_on;

-- ============================================================================
-- 7. AI READINESS SCORE — derived view, always fresh
-- ============================================================================
-- breadth (40): distinct workflow categories active
-- depth (30): success rate × run frequency over last 30 days
-- learning (20): % of lessons completed in user's relevant tracks
-- integration (10): count of distinct tools in current_tools (capped at 5)
create or replace view public.v_readiness_score as
with breadth as (
  select b.id as business_id,
         least(40, count(distinct wt.category) * 10) as score
  from public.businesses b
  left join public.workflows w on w.business_id = b.id and w.status = 'active'
  left join public.workflow_templates wt on wt.id = w.template_id
  group by b.id
),
depth as (
  select b.id as business_id,
         least(
           30,
           coalesce(
             (count(*) filter (where wr.status = 'success'))::numeric
               / nullif(count(*), 0)::numeric * 30,
             0
           )::int
         ) as score
  from public.businesses b
  left join public.workflow_runs wr
    on wr.business_id = b.id
    and wr.started_at > now() - interval '30 days'
  group by b.id
),
learning as (
  select b.id as business_id,
         least(20, count(lp.id) * 2) as score
  from public.businesses b
  left join public.lesson_progress lp
    on lp.user_id = b.user_id and lp.status = 'completed'
  group by b.id
),
integration as (
  select id as business_id,
         least(10, coalesce(array_length(current_tools, 1), 0) * 2) as score
  from public.businesses
)
select
  b.id as business_id,
  coalesce(br.score, 0) as breadth_score,
  coalesce(d.score, 0)  as depth_score,
  coalesce(l.score, 0)  as learning_score,
  coalesce(i.score, 0)  as integration_score,
  coalesce(br.score, 0) + coalesce(d.score, 0)
    + coalesce(l.score, 0) + coalesce(i.score, 0) as total_score
from public.businesses b
left join breadth br on br.business_id = b.id
left join depth d   on d.business_id = b.id
left join learning l on l.business_id = b.id
left join integration i on i.business_id = b.id;

-- ============================================================================
-- 8. ROW LEVEL SECURITY — multi-tenancy is enforced here, not in app code
-- ============================================================================
alter table public.businesses        enable row level security;
alter table public.lesson_progress   enable row level security;
alter table public.workflows         enable row level security;
alter table public.workflow_runs     enable row level security;
alter table public.recommendations   enable row level security;

-- Lessons + templates are public read (they're content, not user data).
alter table public.lessons            enable row level security;
alter table public.workflow_templates enable row level security;

drop policy if exists "lessons readable by everyone" on public.lessons;
create policy "lessons readable by everyone"
  on public.lessons for select using (published = true);

drop policy if exists "templates readable by everyone" on public.workflow_templates;
create policy "templates readable by everyone"
  on public.workflow_templates for select using (true);

-- Businesses: user owns their own row
drop policy if exists "businesses self-access" on public.businesses;
create policy "businesses self-access"
  on public.businesses for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Lesson progress: user owns their own
drop policy if exists "lesson_progress self-access" on public.lesson_progress;
create policy "lesson_progress self-access"
  on public.lesson_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Workflows: user owns via business
drop policy if exists "workflows via business" on public.workflows;
create policy "workflows via business"
  on public.workflows for all
  using (business_id in (select id from public.businesses where user_id = auth.uid()))
  with check (business_id in (select id from public.businesses where user_id = auth.uid()));

-- Workflow runs: same
drop policy if exists "workflow_runs via business" on public.workflow_runs;
create policy "workflow_runs via business"
  on public.workflow_runs for all
  using (business_id in (select id from public.businesses where user_id = auth.uid()))
  with check (business_id in (select id from public.businesses where user_id = auth.uid()));

-- Recommendations: same
drop policy if exists "recommendations via business" on public.recommendations;
create policy "recommendations via business"
  on public.recommendations for all
  using (business_id in (select id from public.businesses where user_id = auth.uid()))
  with check (business_id in (select id from public.businesses where user_id = auth.uid()));

-- ============================================================================
-- 9. updated_at trigger
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_businesses_updated on public.businesses;
create trigger trg_businesses_updated
  before update on public.businesses
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_workflows_updated on public.workflows;
create trigger trg_workflows_updated
  before update on public.workflows
  for each row execute function public.touch_updated_at();
