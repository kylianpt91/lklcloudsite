-- ════════════════════════════════════════════════════════════════════
--  Grants + Row Level Security — replaces firestore.rules
--  Public site (anon key) reads content; only signed-in admins write.
--  Run after 0001_init.sql. Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════════════════

grant usage on schema public to anon, authenticated;

-- Tables the public marketing site reads through src/lib/bridge.ts.
-- anon: SELECT only.  authenticated: full CRUD.  RLS does the real gating.
do $$
declare t text;
begin
  foreach t in array array[
    'gammes','offres','faq','navGroups','navItems','annonces','team','seo','config'
  ]
  loop
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "auth write" on public.%I', t);
    execute format('create policy "auth write" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Admin-only tables: no anon access at all; authenticated full CRUD.
do $$
declare t text;
begin
  foreach t in array array[
    'history','versions','notifications','adminRoles','adminUsers'
  ]
  loop
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "auth read" on public.%I', t);
    execute format('create policy "auth read" on public.%I for select to authenticated using (true)', t);
    execute format('drop policy if exists "auth write" on public.%I', t);
    execute format('create policy "auth write" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Keep future tables working without another manual grant.
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

-- ── Storage: avatars bucket ─────────────────────────────────────────

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars auth write" on storage.objects;
create policy "avatars auth write" on storage.objects
  for all to authenticated
  using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');
