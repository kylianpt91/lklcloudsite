-- ════════════════════════════════════════════════════════════════════
--  LKL Cloud — Supabase schema (replaces Firestore)
--  Run this once in the Supabase SQL Editor on a fresh project.
--  Column names are quoted camelCase so rows map 1:1 to the TS types
--  in src/admin/lib/types.ts (supabase-js returns columns verbatim).
-- ════════════════════════════════════════════════════════════════════

-- ── Content tables ──────────────────────────────────────────────────

create table if not exists public.gammes (
  id                text primary key default gen_random_uuid()::text,
  nom               text not null default '',
  "shortName"       text not null default '',
  slug              text not null unique,
  description       text not null default '',
  icon              text not null default 'Package',
  "heroTitle"       text not null default '',
  "heroDescription" text not null default '',
  "useCases"        jsonb not null default '[]'::jsonb,
  "comingSoon"      boolean not null default false,
  actif             boolean not null default true,
  ordre             integer not null default 0,
  "scheduleConfig"  jsonb,
  "createdAt"       text not null default (now()::text),
  "updatedAt"       text not null default (now()::text)
);

create table if not exists public.offres (
  id               text primary key default gen_random_uuid()::text,
  "gammeId"        text not null,
  nom              text not null default '',
  slug             text not null default '',
  tagline          text not null default '',
  description      text not null default '',
  features         jsonb not null default '[]'::jsonb,
  prix             jsonb not null default '{}'::jsonb,
  specs            jsonb not null default '{}'::jsonb,
  badge            text,
  "orderUrl"       text,
  statut           text not null default 'brouillon',
  "misEnAvant"     boolean not null default false,
  ordre            integer not null default 0,
  "scheduleConfig" jsonb,
  "createdAt"      text not null default (now()::text),
  "updatedAt"      text not null default (now()::text)
);
create index if not exists offres_gamme_idx on public.offres ("gammeId");

create table if not exists public.faq (
  id          text primary key default gen_random_uuid()::text,
  "gammeId"   text not null default 'global',
  question    text not null default '',
  reponse     text not null default '',
  position    integer not null default 0,
  "createdAt" text not null default (now()::text),
  "updatedAt" text not null default (now()::text)
);
create index if not exists faq_gamme_idx on public.faq ("gammeId");

create table if not exists public."navGroups" (
  id          text primary key default gen_random_uuid()::text,
  label       text not null default '',
  color       text not null default 'bg-primary',
  icon        text not null default 'Package',
  ordre       integer not null default 0,
  "createdAt" text not null default (now()::text),
  "updatedAt" text not null default (now()::text)
);

create table if not exists public."navItems" (
  id          text primary key default gen_random_uuid()::text,
  label       text not null default '',
  href        text not null default '',
  "groupId"   text not null,
  ordre       integer not null default 0,
  "comingSoon" boolean not null default false,
  "createdAt" text not null default (now()::text),
  "updatedAt" text not null default (now()::text)
);
create index if not exists navitems_group_idx on public."navItems" ("groupId");

create table if not exists public.annonces (
  id               text primary key default gen_random_uuid()::text,
  message          text not null default '',
  "linkText"       text,
  "linkAction"     text,
  actif            boolean not null default false,
  "dateDebut"      text,
  "dateFin"        text,
  "isPromo"        boolean,
  "promoReduction" integer,
  "promoGammeIds"  jsonb,
  "createdAt"      text not null default (now()::text),
  "updatedAt"      text not null default (now()::text)
);

create table if not exists public.team (
  id          text primary key default gen_random_uuid()::text,
  name        text not null default '',
  role        text not null default '',
  bio         text not null default '',
  avatar      text not null default '',
  socials     jsonb not null default '{}'::jsonb,
  ordre       integer not null default 0,
  "createdAt" text not null default (now()::text),
  "updatedAt" text not null default (now()::text)
);

create table if not exists public.seo (
  id                text primary key default gen_random_uuid()::text,
  "pageSlug"        text not null,
  "pageType"        text not null default 'other',
  title             text not null default '',
  description       text not null default '',
  keywords          jsonb not null default '[]'::jsonb,
  "ogImage"         text,
  "ogTitle"         text,
  "ogDescription"   text,
  "canonicalUrl"    text,
  "noIndex"         boolean,
  "noFollow"        boolean,
  "jsonLd"          text,
  "lastAuditScore"  integer,
  "lastAuditAt"     text,
  "createdAt"       text not null default (now()::text),
  "updatedAt"       text not null default (now()::text)
);

-- ── Config (single-document store: hero / settings / maintenance / discord) ──

create table if not exists public.config (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);

-- ── Admin-only tables ───────────────────────────────────────────────

create table if not exists public.history (
  id           text primary key default gen_random_uuid()::text,
  "entityType" text not null,
  action       text not null,
  "entityName" text not null default '',
  timestamp    text not null default (now()::text),
  "userId"     text,
  "userName"   text,
  "userAvatar" text
);
create index if not exists history_ts_idx on public.history (timestamp desc);

create table if not exists public.versions (
  id              text primary key default gen_random_uuid()::text,
  "entityId"      text not null,
  "entityType"    text not null,
  version         integer not null default 1,
  data            jsonb not null default '{}'::jsonb,
  "createdAt"     text not null default (now()::text),
  "createdBy"     text,
  "createdByName" text,
  comment         text
);
create index if not exists versions_entity_idx on public.versions ("entityId", "entityType", version desc);

create table if not exists public.notifications (
  id              text primary key default gen_random_uuid()::text,
  type            text not null default 'info',
  title           text not null default '',
  message         text not null default '',
  "entityType"    text,
  read            boolean not null default false,
  "createdAt"     text not null default (now()::text),
  "createdBy"     text,
  "createdByName" text,
  "targetUserId"  text not null
);
create index if not exists notifications_target_idx on public.notifications ("targetUserId", "createdAt" desc);

create table if not exists public."adminRoles" (
  id          text primary key default gen_random_uuid()::text,
  name        text not null default '',
  description text not null default '',
  permissions jsonb not null default '{}'::jsonb,
  "createdAt" text not null default (now()::text),
  "updatedAt" text not null default (now()::text)
);

create table if not exists public."adminUsers" (
  id            text primary key default gen_random_uuid()::text,
  email         text not null unique,
  "displayName" text not null default '',
  avatar        text,
  "roleId"      text not null default '',
  "createdAt"   text not null default (now()::text),
  "updatedAt"   text not null default (now()::text)
);

-- ── Realtime ────────────────────────────────────────────────────────
-- Mirrors Firestore onSnapshot: the app re-fetches a table when it changes.

alter publication supabase_realtime add table
  public.gammes, public.offres, public.faq, public."navGroups", public."navItems",
  public.annonces, public.team, public.seo, public.config,
  public.history, public.versions, public.notifications,
  public."adminRoles", public."adminUsers";

-- ── Storage bucket for team / user avatars ──────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
