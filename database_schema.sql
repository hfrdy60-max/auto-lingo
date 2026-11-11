-- =====================================================================
-- AUTO LINGO — database_schema.sql   (PostgreSQL 15+ / Supabase)
-- Stage 1: architecture.  Schema version: 1.0.0
-- Conventions:
--   * Primary keys are stable human-readable text IDs (e.g. 'TERM-000001')
--     so JSON files can reference each other without UUID lookups.
--   * Every content row carries verification_status + last_reviewed_at.
--   * Unknown data is stored as 'unknown' / NULL, never guessed.
--   * Verified numeric/technical values must have a source (see CHECKs
--     and entity_sources).
-- =====================================================================

create extension if not exists pg_trgm;

-- ---------- ENUMS ----------------------------------------------------
do $$ begin
  create type verification_status as enum ('verified','unverified','needs_review','unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type difficulty_level as enum ('beginner','intermediate','advanced','professional');
exception when duplicate_object then null; end $$;

do $$ begin
  create type brand_group as enum ('iranian','chinese','japanese','korean');
exception when duplicate_object then null; end $$;

do $$ begin
  create type source_type as enum ('manufacturer_doc','supplier_tech_doc','standard','service_manual','textbook','website','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type term_kind as enum ('part','system','process','measurement','tool','concept','fault','electrical_symbol','abbreviation');
exception when duplicate_object then null; end $$;

do $$ begin
  create type diagnostic_kind as enum ('topic','dtc');
exception when duplicate_object then null; end $$;

do $$ begin
  create type relation_type as enum ('related','opposite','part_of','type_of','causes','tested_with');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_type as enum ('multiple_choice','image_choice','part_identification','listening','translation','fill_blank','definition_to_term','troubleshooting','wiring_term');
exception when duplicate_object then null; end $$;

-- ---------- COMMON TRIGGER ------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- =====================================================================
-- 1. SOURCES  (created first: referenced by most tables)
-- =====================================================================
create table if not exists sources (
  id                  text primary key check (id ~ '^SRC-[0-9]{3,}$'),
  title               text not null,
  publisher           text not null,
  source_type         source_type not null,
  url                 text,
  language            text not null default 'en',
  notes               text,
  verification_status verification_status not null default 'unverified',
  last_checked_at     date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (publisher, title)
);

-- =====================================================================
-- 2. CATEGORIES
-- =====================================================================
create table if not exists categories (
  id          text primary key check (id ~ '^CAT-[0-9]{2,}$'),
  name_en     text not null unique,
  name_fa     text not null,
  parent_id   text references categories(id) on delete set null,
  sort_order  int  not null default 0,
  description_fa text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_categories_parent on categories(parent_id);

-- =====================================================================
-- 3. SYSTEMS
-- =====================================================================
create table if not exists systems (
  id                  text primary key check (id ~ '^SYS-[0-9]{3,}$'),
  name_en             text not null unique,
  name_fa             text not null,
  category_id         text references categories(id),
  introduction_fa     text,
  function_fa         text,
  operation_fa        text,        -- how it works
  interactions_fa     text,        -- relation to other systems
  common_faults_fa    jsonb not null default '[]'::jsonb,
  inspection_methods_fa jsonb not null default '[]'::jsonb,
  workshop_example_fa text,
  verification_status verification_status not null default 'unverified',
  last_reviewed_at    date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =====================================================================
-- 4. PARTS
-- =====================================================================
create table if not exists parts (
  id                    text primary key check (id ~ '^PART-[0-9]{6}$'),
  name_en               text not null,
  name_fa               text not null,
  pronunciation_fa      text,
  ipa                   text,
  description           text,
  main_function         text,
  installation_location text,
  working_principle     text,
  internal_components   jsonb not null default '[]'::jsonb,
  common_failures       jsonb not null default '[]'::jsonb,
  failure_symptoms      jsonb not null default '[]'::jsonb,
  testing_methods       jsonb not null default '[]'::jsonb,
  required_tools        jsonb not null default '[]'::jsonb,
  category_id           text references categories(id),
  is_generic            boolean not null default true,  -- generic info only; vehicle-specific data lives elsewhere
  verification_status   verification_status not null default 'unverified',
  last_reviewed_at      date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (name_en)
);
create index if not exists idx_parts_name_trgm on parts using gin (name_en gin_trgm_ops);

-- =====================================================================
-- 5. TERMS
-- =====================================================================
create table if not exists terms (
  id                  text primary key check (id ~ '^TERM-[0-9]{6}$'),
  term_en             text not null,
  term_fa             text not null,
  pronunciation_fa    text,
  ipa                 text,
  kind                term_kind not null default 'concept',
  category_id         text not null references categories(id),
  part_id             text references parts(id) on delete set null,  -- when the term names a part
  system_id           text references systems(id) on delete set null,
  technical_definition text,
  simple_explanation  text,
  function            text,        -- NULL for non-part terms
  location            text,        -- NULL for non-part terms
  working_principle   text,        -- NULL for non-part terms
  common_symptoms     jsonb,       -- NULL for non-part terms
  testing_method      jsonb,       -- NULL for non-part terms
  difficulty          difficulty_level not null default 'beginner',
  verification_status verification_status not null default 'unverified',
  last_reviewed_at    date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (term_en, category_id)
);
create index if not exists idx_terms_cat   on terms(category_id);
create index if not exists idx_terms_trgm  on terms using gin (term_en gin_trgm_ops);
create index if not exists idx_terms_fa    on terms using gin (term_fa gin_trgm_ops);

-- 18. TERM_SYNONYMS (also holds abbreviations / alternate spellings)
create table if not exists term_synonyms (
  id          bigint generated always as identity primary key,
  term_id     text not null references terms(id) on delete cascade,
  synonym     text not null,
  lang        text not null default 'en',
  is_abbreviation boolean not null default false,
  regional_note text,
  unique (term_id, synonym, lang)
);
create index if not exists idx_synonym_trgm on term_synonyms using gin (synonym gin_trgm_ops);

-- Future languages without changing `terms`
create table if not exists term_translations (
  term_id text not null references terms(id) on delete cascade,
  lang    text not null,              -- BCP-47, e.g. 'ar','tr'
  text    text not null,
  verification_status verification_status not null default 'unverified',
  primary key (term_id, lang)
);

-- 10. RELATED_TERMS
create table if not exists related_terms (
  term_id         text not null references terms(id) on delete cascade,
  related_term_id text not null references terms(id) on delete cascade,
  relation        relation_type not null default 'related',
  primary key (term_id, related_term_id, relation),
  check (term_id <> related_term_id)
);

-- Parts <-> terms (the "Related Terminology" of a part)
create table if not exists part_terms (
  part_id text not null references parts(id) on delete cascade,
  term_id text not null references terms(id) on delete cascade,
  primary key (part_id, term_id)
);

-- 17. SYSTEM_COMPONENTS
create table if not exists system_components (
  system_id  text not null references systems(id) on delete cascade,
  part_id    text not null references parts(id)   on delete restrict,
  role_fa    text,
  sort_order int not null default 0,
  primary key (system_id, part_id)
);

-- =====================================================================
-- 6. BRANDS / 7. VEHICLE_MODELS / 8. VEHICLE_SPECIFICATIONS
-- =====================================================================
create table if not exists brands (
  id          text primary key check (id ~ '^BRAND-[0-9]{3}$'),
  name_en     text not null unique,
  name_fa     text not null,
  group_name  brand_group not null,
  website     text,
  notes       text,
  verification_status verification_status not null default 'unverified',
  last_reviewed_at date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists vehicle_models (
  id          text primary key check (id ~ '^VM-[0-9]{5}$'),
  brand_id    text not null references brands(id) on delete restrict,
  model_name  text not null,
  model_name_fa text,
  generation  text,                      -- 'Unknown' if not documented
  production_start_year int check (production_start_year between 1950 and 2100),
  production_end_year   int check (production_end_year   between 1950 and 2100),
  verification_status verification_status not null default 'unverified',
  last_reviewed_at date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (production_end_year is null or production_start_year is null or production_end_year >= production_start_year),
  unique (brand_id, model_name, generation)
);

-- Entity-attribute-value: one row = one spec of one model.
-- Nothing is inherited from "similar" models; each model has its own rows.
-- spec_key examples: engine_code, displacement_cc, fuel_system, ecu_manufacturer,
--   ecu_model, transmission, diagnostic_protocol, sensors, actuators, electronic_systems
create table if not exists vehicle_specifications (
  id                  bigint generated always as identity primary key,
  vehicle_model_id    text not null references vehicle_models(id) on delete cascade,
  spec_group          text not null,
  spec_key            text not null,
  value_text          text not null default 'Unknown',
  value_numeric       numeric,
  unit                text,
  source_id           text references sources(id),
  verification_status verification_status not null default 'unknown',
  last_reviewed_at    date,
  unique (vehicle_model_id, spec_key),
  check (verification_status <> 'verified' or source_id is not null),
  check (value_text <> 'Unknown' or verification_status = 'unknown')
);

-- 16. PART_VEHICLE_COMPATIBILITY (model-specific, never generalised)
create table if not exists part_vehicle_compatibility (
  id                bigint generated always as identity primary key,
  part_id           text not null references parts(id) on delete cascade,
  vehicle_model_id  text not null references vehicle_models(id) on delete cascade,
  oem_part_number   text,
  fitment_notes     text,
  source_id         text references sources(id),
  verification_status verification_status not null default 'unverified',
  last_reviewed_at  date,
  check (verification_status <> 'verified' or source_id is not null)
);
create unique index if not exists uq_part_vehicle
  on part_vehicle_compatibility (part_id, vehicle_model_id, coalesce(oem_part_number,''));

-- =====================================================================
-- 8. DIAGNOSTICS  (topics such as STFT/LTFT AND OBD-II DTC codes)
-- =====================================================================
create table if not exists diagnostics (
  id                  text primary key check (id ~ '^DIAG-[0-9]{5}$'),
  kind                diagnostic_kind not null,
  -- topic fields
  topic_en            text,
  topic_fa            text,
  definition_fa       text,
  function_fa         text,
  application_fa      text,
  example_fa          text,
  inspection_method_fa jsonb,
  -- DTC fields
  dtc_code            text,
  description_en      text,
  description_fa      text,
  dtc_scope           text check (dtc_scope in ('generic','manufacturer_specific')),
  brand_id            text references brands(id),      -- only for manufacturer-specific codes
  system_id           text references systems(id),
  possible_causes     jsonb,   -- ALWAYS unconfirmed hypotheses, never definitive
  diagnostic_procedure jsonb,  -- ordered steps
  verified_findings   text,    -- separate: only confirmed, sourced diagnostic statements
  difficulty          difficulty_level not null default 'intermediate',
  verification_status verification_status not null default 'unverified',
  last_reviewed_at    date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (kind <> 'dtc'   or (dtc_code ~ '^[PBCU][0-3][0-9A-F]{3}$' and description_en is not null)),
  check (kind <> 'topic' or (topic_en is not null and topic_fa is not null)),
  check (dtc_scope is distinct from 'generic' or brand_id is null)
);
create unique index if not exists uq_dtc_code
  on diagnostics (dtc_code, coalesce(brand_id,'')) where kind = 'dtc';
create unique index if not exists uq_topic_en
  on diagnostics (topic_en) where kind = 'topic';

create table if not exists diagnostic_parts (
  diagnostic_id text not null references diagnostics(id) on delete cascade,
  part_id       text not null references parts(id) on delete cascade,
  primary key (diagnostic_id, part_id)
);

create table if not exists diagnostic_terms (
  diagnostic_id text not null references diagnostics(id) on delete cascade,
  term_id       text not null references terms(id) on delete cascade,
  primary key (diagnostic_id, term_id)
);

-- =====================================================================
-- 9. REPAIR_SCENARIOS
-- =====================================================================
create table if not exists repair_scenarios (
  id                    text primary key check (id ~ '^SCN-[0-9]{4}$'),
  title_en              text not null,
  title_fa              text not null,
  category_id           text references categories(id),
  system_id             text references systems(id),
  vehicle_symptoms      jsonb not null,
  possible_causes       jsonb not null,    -- hypotheses only
  diagnostic_steps      jsonb not null,    -- ordered, safe
  required_tools        jsonb not null default '[]'::jsonb,
  expected_observations jsonb,
  recommended_next_step text,
  safety_notes          text,
  difficulty            difficulty_level not null default 'intermediate',
  verification_status   verification_status not null default 'unverified',
  last_reviewed_at      date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (title_en)
);

create table if not exists scenario_terms (
  scenario_id text not null references repair_scenarios(id) on delete cascade,
  term_id     text not null references terms(id) on delete cascade,
  primary key (scenario_id, term_id)
);

create table if not exists scenario_diagnostics (
  scenario_id   text not null references repair_scenarios(id) on delete cascade,
  diagnostic_id text not null references diagnostics(id) on delete cascade,
  primary key (scenario_id, diagnostic_id)
);

-- =====================================================================
-- 12-14. LEARNING: lessons, quizzes, quiz_questions, learning_examples
-- =====================================================================
create table if not exists lessons (
  id              text primary key check (id ~ '^LESSON-[0-9]{4}$'),
  title_en        text not null,
  title_fa        text not null,
  level           difficulty_level not null,
  category_id     text references categories(id),
  learning_objectives jsonb not null default '[]'::jsonb,
  content         jsonb not null default '[]'::jsonb,
  examples        jsonb not null default '[]'::jsonb,
  exercises       jsonb not null default '[]'::jsonb,
  sort_order      int not null default 0,
  verification_status verification_status not null default 'unverified',
  last_reviewed_at date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists lesson_prerequisites (
  lesson_id              text not null references lessons(id) on delete cascade,
  prerequisite_lesson_id text not null references lessons(id) on delete restrict,
  primary key (lesson_id, prerequisite_lesson_id),
  check (lesson_id <> prerequisite_lesson_id)
);

create table if not exists lesson_terms (
  lesson_id text not null references lessons(id) on delete cascade,
  term_id   text not null references terms(id)   on delete cascade,
  primary key (lesson_id, term_id)
);

create table if not exists learning_examples (
  id          bigint generated always as identity primary key,
  term_id     text not null references terms(id) on delete cascade,
  lesson_id   text references lessons(id) on delete set null,
  example_en  text not null,
  example_fa  text not null,
  audio_url   text,
  difficulty  difficulty_level not null default 'beginner',
  unique (term_id, example_en)
);

create table if not exists quizzes (
  id          text primary key check (id ~ '^QUIZ-[0-9]{4}$'),
  lesson_id   text references lessons(id) on delete set null,
  title_en    text not null,
  title_fa    text not null,
  level       difficulty_level not null,
  pass_score_percent int not null default 70 check (pass_score_percent between 1 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists quiz_questions (
  id            text primary key check (id ~ '^QQ-[0-9]{6}$'),
  quiz_id       text not null references quizzes(id) on delete cascade,
  type          question_type not null,
  prompt_en     text,
  prompt_fa     text not null,
  options       jsonb,                  -- [{key,text_en,text_fa,image_url}]
  correct_answer jsonb not null,
  explanation_fa text,
  term_id       text references terms(id) on delete set null,
  part_id       text references parts(id) on delete set null,
  media_url     text,                   -- image / audio
  difficulty    difficulty_level not null default 'beginner',
  sort_order    int not null default 0,
  check (type not in ('multiple_choice','image_choice','part_identification') or options is not null)
);
create index if not exists idx_qq_quiz on quiz_questions(quiz_id);

-- =====================================================================
-- Source links for ANY entity (multiple sources per record, auditable)
-- =====================================================================
create table if not exists entity_sources (
  id           bigint generated always as identity primary key,
  entity_table text not null check (entity_table in
    ('terms','parts','systems','diagnostics','repair_scenarios','lessons','vehicle_models','brands')),
  entity_id    text not null,
  source_id    text not null references sources(id) on delete restrict,
  citation_note text           -- page / section / URL fragment
);
create unique index if not exists uq_entity_sources
  on entity_sources (entity_table, entity_id, source_id, coalesce(citation_note,''));
create index if not exists idx_entity_sources_lookup on entity_sources(entity_table, entity_id);

-- QA view: records marked verified but lacking any source (must stay empty)
create or replace view v_verified_without_source as
select 'terms' as entity_table, t.id from terms t
 where t.verification_status='verified'
   and not exists (select 1 from entity_sources e where e.entity_table='terms' and e.entity_id=t.id)
union all
select 'parts', p.id from parts p
 where p.verification_status='verified'
   and not exists (select 1 from entity_sources e where e.entity_table='parts' and e.entity_id=p.id)
union all
select 'systems', s.id from systems s
 where s.verification_status='verified'
   and not exists (select 1 from entity_sources e where e.entity_table='systems' and e.entity_id=s.id)
union all
select 'diagnostics', d.id from diagnostics d
 where d.verification_status='verified'
   and not exists (select 1 from entity_sources e where e.entity_table='diagnostics' and e.entity_id=d.id)
union all
select 'repair_scenarios', r.id from repair_scenarios r
 where r.verification_status='verified'
   and not exists (select 1 from entity_sources e where e.entity_table='repair_scenarios' and e.entity_id=r.id);

-- =====================================================================
-- updated_at triggers
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['sources','categories','systems','parts','terms','brands',
                           'vehicle_models','diagnostics','repair_scenarios','lessons','quizzes']
  loop
    execute format('drop trigger if exists trg_%1$s_updated on %1$I;', t);
    execute format('create trigger trg_%1$s_updated before update on %1$I
                    for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- =====================================================================
-- Supabase Row Level Security: public read-only, writes via service role
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['sources','categories','systems','parts','terms','term_synonyms',
    'term_translations','related_terms','part_terms','system_components','brands','vehicle_models',
    'vehicle_specifications','part_vehicle_compatibility','diagnostics','diagnostic_parts',
    'diagnostic_terms','repair_scenarios','scenario_terms','scenario_diagnostics','lessons',
    'lesson_prerequisites','lesson_terms','learning_examples','quizzes','quiz_questions','entity_sources']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "public read" on %I;', t);
    execute format('create policy "public read" on %I for select using (true);', t);
  end loop;
end $$;

-- Suggested import order for JSON files:
--  sources -> categories -> brands -> systems -> parts -> terms -> vehicle_models ->
--  vehicle_specifications -> diagnostics -> repair_scenarios -> lessons -> quizzes
