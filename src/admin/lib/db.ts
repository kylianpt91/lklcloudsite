/**
 * Database layer — Supabase (Postgres) implementation.
 *
 * Replaces the former Firestore layer. Exported names are unchanged so
 * `src/lib/bridge.ts`, `src/admin/lib/context.tsx` and the admin pages keep
 * working without edits. The `*FS` suffixes are historical.
 *
 * Realtime: Firestore `onSnapshot` is emulated with a Supabase
 * `postgres_changes` channel that re-fetches the whole (small) table on any
 * change and hands the fresh list to the callback — same contract as before.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  Gamme,
  Offre,
  FAQItem,
  NavGroup,
  NavItemAdmin,
  Annonce,
  TeamMemberAdmin,
  HeroConfig,
  SiteSettings,
  MaintenanceMode,
  HistoryEntry,
  ContentVersion,
  AdminNotification,
  DiscordWebhookConfig,
  AdminRole,
  AdminUser,
  SEOConfig,
} from './types'

// ── Table names ─────────────────────────────────────────────────────

const T = {
  gammes: 'gammes',
  offres: 'offres',
  faq: 'faq',
  navGroups: 'navGroups',
  navItems: 'navItems',
  annonces: 'annonces',
  team: 'team',
  history: 'history',
  versions: 'versions',
  notifications: 'notifications',
  seo: 'seo',
  adminRoles: 'adminRoles',
  adminUsers: 'adminUsers',
  config: 'config',
} as const

const CONFIG_KEY = {
  hero: 'hero',
  settings: 'settings',
  maintenance: 'maintenance',
  discord: 'discord',
} as const

// ── Helpers ─────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString()
}

/** Recursively strip `undefined` — Postgres/jsonb round-trips cleanly without them. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripUndefined<T extends Record<string, any>>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = stripUndefined(value)
    } else {
      result[key] = value
    }
  }
  return result as T
}

async function selectAll<R>(
  table: string,
  order?: { column: string; ascending?: boolean },
  limit?: number,
): Promise<R[]> {
  let q = supabase.from(table).select('*')
  if (order) q = q.order(order.column, { ascending: order.ascending ?? true })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []) as R[]
}

/**
 * Postgrest's "unknown column" error, e.g. when a field was added to the app
 * before the matching database migration was run. Message looks like:
 * "Could not find the 'category' column of 'gammes' in the schema cache".
 */
function missingColumn(message: string): string | null {
  const m = message.match(/Could not find the '([^']+)' column/i)
  return m ? m[1] : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertRow(table: string, row: Record<string, any>): Promise<string> {
  let payload = stripUndefined(row)
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select('id')
      .single()
    if (!error) return (data as { id: string }).id
    const col = missingColumn(error.message)
    if (col && col in payload) {
      const { [col]: _drop, ...rest } = payload
      payload = rest
      continue
    }
    throw new Error(error.message)
  }
  throw new Error(`Échec de l'insertion dans ${table} après plusieurs tentatives`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertMany(table: string, rows: Record<string, any>[]): Promise<void> {
  if (rows.length === 0) return
  const { error } = await supabase.from(table).insert(rows.map(stripUndefined))
  if (error) throw new Error(error.message)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateRow(table: string, id: string, patch: Record<string, any>): Promise<void> {
  let payload = stripUndefined(patch)
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from(table).update(payload).eq('id', id)
    if (!error) return
    const col = missingColumn(error.message)
    if (col && col in payload) {
      const { [col]: _drop, ...rest } = payload
      payload = rest
      continue
    }
    throw new Error(error.message)
  }
  throw new Error(`Échec de la mise à jour dans ${table} après plusieurs tentatives`)
}

async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

async function deleteWhereIn(table: string, column: string, values: string[]): Promise<void> {
  if (values.length === 0) return
  const { error } = await supabase.from(table).delete().in(column, values)
  if (error) throw new Error(error.message)
}

/**
 * Emulates Firestore `onSnapshot`: fires `callback` with the full ordered
 * list now and again whenever the table changes. Returns an unsubscribe fn.
 */
function watch<R>(
  table: string,
  fetcher: () => Promise<R>,
  callback: (data: R) => void,
  onError: ((err: Error) => void) | undefined,
  filter?: string,
): () => void {
  let cancelled = false

  const refetch = () => {
    fetcher()
      .then(d => { if (!cancelled) callback(d) })
      .catch(e => {
        if (cancelled) return
        console.error(`[db] ${table} listener:`, e)
        onError?.(e instanceof Error ? e : new Error(String(e)))
      })
  }

  if (!isSupabaseConfigured) {
    // Offline: run once so callers fall back to hardcoded data immediately.
    onError?.(new Error('Supabase not configured'))
    return () => { cancelled = true }
  }

  refetch()

  const channel = supabase
    .channel(`realtime:${table}:${Math.random().toString(36).slice(2)}`)
    .on(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'postgres_changes' as any,
      { event: '*', schema: 'public', table, ...(filter ? { filter } : {}) },
      () => refetch(),
    )
    .subscribe()

  return () => {
    cancelled = true
    supabase.removeChannel(channel)
  }
}

// ── Config single-document store ────────────────────────────────────

async function getConfig<R>(key: string): Promise<R | null> {
  const { data, error } = await supabase.from(T.config).select('value').eq('key', key).maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.value as R) ?? null
}

async function setConfig(key: string, value: unknown): Promise<void> {
  const { error } = await supabase.from(T.config).upsert({ key, value }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}

function watchConfig<R>(
  key: string,
  callback: (value: R | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch<R | null>(
    T.config,
    () => getConfig<R>(key),
    callback,
    onError,
    `key=eq.${key}`,
  )
}

// ── Gammes ──────────────────────────────────────────────────────────

export async function fetchGammes(): Promise<Gamme[]> {
  return selectAll<Gamme>(T.gammes, { column: 'ordre' })
}

export async function addGammeFS(gamme: Omit<Gamme, 'id'>): Promise<string> {
  return insertRow(T.gammes, gamme)
}

export async function updateGammeFS(id: string, data: Partial<Gamme>): Promise<void> {
  return updateRow(T.gammes, id, { ...data, updatedAt: now() })
}

export async function deleteGammeFS(id: string): Promise<void> {
  await deleteRow(T.gammes, id)
  // Cascade: related offres + product FAQ
  await deleteWhereIn(T.offres, 'gammeId', [id])
  await deleteWhereIn(T.faq, 'gammeId', [id])
}

export function onGammesChange(
  callback: (gammes: Gamme[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.gammes, fetchGammes, callback, onError)
}

// ── Offres ──────────────────────────────────────────────────────────

export async function fetchOffres(): Promise<Offre[]> {
  return selectAll<Offre>(T.offres, { column: 'ordre' })
}

export async function addOffreFS(offre: Omit<Offre, 'id'>): Promise<string> {
  return insertRow(T.offres, offre)
}

export async function updateOffreFS(id: string, data: Partial<Offre>): Promise<void> {
  return updateRow(T.offres, id, { ...data, updatedAt: now() })
}

export async function deleteOffreFS(id: string): Promise<void> {
  return deleteRow(T.offres, id)
}

export function onOffresChange(
  callback: (offres: Offre[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.offres, fetchOffres, callback, onError)
}

// ── FAQ ─────────────────────────────────────────────────────────────

export async function fetchFAQ(): Promise<FAQItem[]> {
  return selectAll<FAQItem>(T.faq, { column: 'position' })
}

export async function addFAQFS(item: Omit<FAQItem, 'id'>): Promise<string> {
  return insertRow(T.faq, item)
}

export async function updateFAQFS(id: string, data: Partial<FAQItem>): Promise<void> {
  return updateRow(T.faq, id, { ...data, updatedAt: now() })
}

export async function deleteFAQFS(id: string): Promise<void> {
  return deleteRow(T.faq, id)
}

export function onFAQChange(
  callback: (items: FAQItem[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.faq, fetchFAQ, callback, onError)
}

// ── Navigation groups ───────────────────────────────────────────────

export async function fetchNavGroups(): Promise<NavGroup[]> {
  return selectAll<NavGroup>(T.navGroups, { column: 'ordre' })
}

export async function addNavGroupFS(group: Omit<NavGroup, 'id'>): Promise<string> {
  return insertRow(T.navGroups, group)
}

export async function updateNavGroupFS(id: string, data: Partial<NavGroup>): Promise<void> {
  return updateRow(T.navGroups, id, { ...data, updatedAt: now() })
}

export async function deleteNavGroupFS(id: string): Promise<void> {
  await deleteRow(T.navGroups, id)
  await deleteWhereIn(T.navItems, 'groupId', [id])
}

export function onNavGroupsChange(
  callback: (groups: NavGroup[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.navGroups, fetchNavGroups, callback, onError)
}

// ── Navigation items ────────────────────────────────────────────────

export async function fetchNavItems(): Promise<NavItemAdmin[]> {
  return selectAll<NavItemAdmin>(T.navItems, { column: 'ordre' })
}

export async function addNavItemFS(item: Omit<NavItemAdmin, 'id'>): Promise<string> {
  return insertRow(T.navItems, item)
}

export async function updateNavItemFS(id: string, data: Partial<NavItemAdmin>): Promise<void> {
  return updateRow(T.navItems, id, { ...data, updatedAt: now() })
}

export async function deleteNavItemFS(id: string): Promise<void> {
  return deleteRow(T.navItems, id)
}

export function onNavItemsChange(
  callback: (items: NavItemAdmin[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.navItems, fetchNavItems, callback, onError)
}

// ── Annonces ────────────────────────────────────────────────────────

export async function fetchAnnonces(): Promise<Annonce[]> {
  return selectAll<Annonce>(T.annonces)
}

export async function addAnnonceFS(annonce: Omit<Annonce, 'id'>): Promise<string> {
  return insertRow(T.annonces, annonce)
}

export async function updateAnnonceFS(id: string, data: Partial<Annonce>): Promise<void> {
  return updateRow(T.annonces, id, { ...data, updatedAt: now() })
}

export async function deleteAnnonceFS(id: string): Promise<void> {
  return deleteRow(T.annonces, id)
}

export function onAnnoncesChange(
  callback: (annonces: Annonce[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.annonces, fetchAnnonces, callback, onError)
}

// ── Team ────────────────────────────────────────────────────────────

export async function fetchTeam(): Promise<TeamMemberAdmin[]> {
  return selectAll<TeamMemberAdmin>(T.team, { column: 'ordre' })
}

export async function addTeamMemberFS(member: Omit<TeamMemberAdmin, 'id'>): Promise<string> {
  return insertRow(T.team, member)
}

export async function updateTeamMemberFS(id: string, data: Partial<TeamMemberAdmin>): Promise<void> {
  return updateRow(T.team, id, { ...data, updatedAt: now() })
}

export async function deleteTeamMemberFS(id: string): Promise<void> {
  return deleteRow(T.team, id)
}

export function onTeamChange(
  callback: (members: TeamMemberAdmin[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.team, fetchTeam, callback, onError)
}

// ── Config documents ────────────────────────────────────────────────

export async function getHeroConfigFS(): Promise<HeroConfig | null> {
  return getConfig<HeroConfig>(CONFIG_KEY.hero)
}

export async function updateHeroConfigFS(data: HeroConfig): Promise<void> {
  return setConfig(CONFIG_KEY.hero, stripUndefined(data))
}

export function onHeroConfigChange(
  callback: (config: HeroConfig | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return watchConfig<HeroConfig>(CONFIG_KEY.hero, callback, onError)
}

export async function getSiteSettingsFS(): Promise<SiteSettings | null> {
  return getConfig<SiteSettings>(CONFIG_KEY.settings)
}

export async function updateSiteSettingsFS(data: SiteSettings): Promise<void> {
  return setConfig(CONFIG_KEY.settings, stripUndefined(data))
}

export function onSiteSettingsChange(
  callback: (settings: SiteSettings | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return watchConfig<SiteSettings>(CONFIG_KEY.settings, callback, onError)
}

export async function getMaintenanceModeFS(): Promise<MaintenanceMode | null> {
  return getConfig<MaintenanceMode>(CONFIG_KEY.maintenance)
}

export async function updateMaintenanceModeFS(data: MaintenanceMode): Promise<void> {
  return setConfig(CONFIG_KEY.maintenance, stripUndefined(data))
}

export function onMaintenanceModeChange(
  callback: (mode: MaintenanceMode | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return watchConfig<MaintenanceMode>(CONFIG_KEY.maintenance, callback, onError)
}

// ── History ─────────────────────────────────────────────────────────

export async function addHistoryEntryFS(entry: Omit<HistoryEntry, 'id'>): Promise<void> {
  const { error } = await supabase.from(T.history).insert(stripUndefined(entry))
  if (error) throw new Error(error.message)
}

export async function fetchHistoryFS(max = 500): Promise<HistoryEntry[]> {
  return selectAll<HistoryEntry>(T.history, { column: 'timestamp', ascending: false }, max)
}

// ── Content versioning ──────────────────────────────────────────────

export async function saveVersionFS(version: Omit<ContentVersion, 'id'>): Promise<string> {
  return insertRow(T.versions, version)
}

export async function fetchVersionsFS(
  entityId: string,
  entityType: ContentVersion['entityType'],
): Promise<ContentVersion[]> {
  const { data, error } = await supabase
    .from(T.versions)
    .select('*')
    .eq('entityId', entityId)
    .eq('entityType', entityType)
    .order('version', { ascending: false })
    .limit(50)
  if (error) throw new Error(error.message)
  return (data ?? []) as ContentVersion[]
}

export async function deleteOldVersionsFS(
  entityId: string,
  entityType: ContentVersion['entityType'],
  keepCount = 50,
): Promise<void> {
  const { data, error } = await supabase
    .from(T.versions)
    .select('id')
    .eq('entityId', entityId)
    .eq('entityType', entityType)
    .order('version', { ascending: false })
  if (error) throw new Error(error.message)
  const rows = (data ?? []) as { id: string }[]
  if (rows.length <= keepCount) return
  await deleteWhereIn(T.versions, 'id', rows.slice(keepCount).map(r => r.id))
}

// ── Notifications ───────────────────────────────────────────────────

export async function addNotificationFS(notif: Omit<AdminNotification, 'id'>): Promise<string> {
  return insertRow(T.notifications, notif)
}

export async function addNotificationsBatchFS(
  notifs: Omit<AdminNotification, 'id'>[],
): Promise<void> {
  return insertMany(T.notifications, notifs)
}

export async function markNotificationReadFS(id: string): Promise<void> {
  return updateRow(T.notifications, id, { read: true })
}

export async function markAllNotificationsReadFS(userId: string): Promise<void> {
  const { error } = await supabase
    .from(T.notifications)
    .update({ read: true })
    .eq('targetUserId', userId)
    .eq('read', false)
  if (error) throw new Error(error.message)
}

export function onNotificationsChange(
  userId: string,
  callback: (notifications: AdminNotification[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from(T.notifications)
      .select('*')
      .eq('targetUserId', userId)
      .order('createdAt', { ascending: false })
      .limit(100)
    if (error) throw new Error(error.message)
    return (data ?? []) as AdminNotification[]
  }
  return watch(T.notifications, fetcher, callback, onError, `targetUserId=eq.${userId}`)
}

export async function deleteOldNotificationsFS(daysOld = 30): Promise<void> {
  const cutoff = new Date(Date.now() - daysOld * 86400000).toISOString()
  const { error } = await supabase.from(T.notifications).delete().lt('createdAt', cutoff)
  if (error) throw new Error(error.message)
}

// ── Discord webhook config ──────────────────────────────────────────

export async function getDiscordConfigFS(): Promise<DiscordWebhookConfig | null> {
  return getConfig<DiscordWebhookConfig>(CONFIG_KEY.discord)
}

export async function updateDiscordConfigFS(data: DiscordWebhookConfig): Promise<void> {
  return setConfig(CONFIG_KEY.discord, stripUndefined(data))
}

export function onDiscordConfigChange(
  callback: (config: DiscordWebhookConfig | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return watchConfig<DiscordWebhookConfig>(CONFIG_KEY.discord, callback, onError)
}

// ── SEO configs ─────────────────────────────────────────────────────

export async function fetchSEOConfigsFS(): Promise<SEOConfig[]> {
  return selectAll<SEOConfig>(T.seo, { column: 'pageSlug' })
}

export async function addSEOConfigFS(config: Omit<SEOConfig, 'id'>): Promise<string> {
  return insertRow(T.seo, config)
}

export async function updateSEOConfigFS(id: string, data: Partial<SEOConfig>): Promise<void> {
  return updateRow(T.seo, id, { ...data, updatedAt: now() })
}

export async function deleteSEOConfigFS(id: string): Promise<void> {
  return deleteRow(T.seo, id)
}

export function onSEOConfigsChange(
  callback: (configs: SEOConfig[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.seo, fetchSEOConfigsFS, callback, onError)
}

// ── Batch delete / update ───────────────────────────────────────────

export async function batchDeleteSimpleFS(tableName: string, ids: string[]): Promise<void> {
  return deleteWhereIn(tableName, 'id', ids)
}

export async function batchDeleteGammesFS(ids: string[]): Promise<void> {
  await deleteWhereIn(T.gammes, 'id', ids)
  await deleteWhereIn(T.offres, 'gammeId', ids)
  await deleteWhereIn(T.faq, 'gammeId', ids)
}

export async function batchUpdateFieldFS(
  tableName: string,
  ids: string[],
  updates: Record<string, unknown>,
): Promise<void> {
  if (ids.length === 0) return
  const { error } = await supabase
    .from(tableName)
    .update({ ...updates, updatedAt: now() })
    .in('id', ids)
  if (error) throw new Error(error.message)
}

// ── Batch reorder ───────────────────────────────────────────────────

export async function batchReorderFS(
  tableName: string,
  reorders: { id: string; ordre: number }[],
  orderField = 'ordre',
): Promise<void> {
  await Promise.all(
    reorders.map(({ id, ordre }) =>
      supabase
        .from(tableName)
        .update({ [orderField]: ordre, updatedAt: now() })
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw new Error(error.message)
        }),
    ),
  )
}

// ── Connectivity / seeding ──────────────────────────────────────────

export async function checkFirestoreConnection(timeoutMs = 8000): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  try {
    const result = await Promise.race([
      supabase
        .from(T.gammes)
        .select('id')
        .limit(1)
        .then(({ error }) => !error),
      new Promise<false>(resolve => setTimeout(() => resolve(false), timeoutMs)),
    ])
    return result
  } catch {
    return false
  }
}

export async function isFirestoreSeeded(): Promise<boolean> {
  const { data, error } = await supabase.from(T.gammes).select('id').limit(1)
  if (error) return false
  return (data?.length ?? 0) > 0
}

export async function seedFirestore(data: {
  gammes: Omit<Gamme, 'id'>[]
  offres: Omit<Offre, 'id'>[]
  faq: Omit<FAQItem, 'id'>[]
  navGroups: Omit<NavGroup, 'id'>[]
  navItems: Omit<NavItemAdmin, 'id'>[]
  team: Omit<TeamMemberAdmin, 'id'>[]
  heroConfig: HeroConfig
  siteSettings: SiteSettings
  maintenance: MaintenanceMode
}): Promise<void> {
  // Gammes — deterministic id = slug so offres/faq can reference by slug.
  await insertMany(
    T.gammes,
    data.gammes.map(g => ({ ...g, id: g.slug })),
  )
  await insertMany(T.offres, data.offres)
  await insertMany(T.faq, data.faq)
  // Nav groups — deterministic id = slugified label (matches seed.ts groupId).
  await insertMany(
    T.navGroups,
    data.navGroups.map(g => ({ ...g, id: g.label.toLowerCase().replace(/\s+/g, '-') })),
  )
  await insertMany(T.navItems, data.navItems)
  await insertMany(T.team, data.team)

  const { error } = await supabase.from(T.config).upsert(
    [
      { key: CONFIG_KEY.hero, value: data.heroConfig },
      { key: CONFIG_KEY.settings, value: data.siteSettings },
      { key: CONFIG_KEY.maintenance, value: data.maintenance },
    ],
    { onConflict: 'key' },
  )
  if (error) throw new Error(error.message)
}

// ── Admin roles ─────────────────────────────────────────────────────

export async function fetchRolesFS(): Promise<AdminRole[]> {
  return selectAll<AdminRole>(T.adminRoles)
}

export async function addRoleFS(role: Omit<AdminRole, 'id'>): Promise<string> {
  return insertRow(T.adminRoles, role)
}

export async function updateRoleFS(id: string, data: Partial<AdminRole>): Promise<void> {
  return updateRow(T.adminRoles, id, { ...data, updatedAt: now() })
}

export async function deleteRoleFS(id: string): Promise<void> {
  return deleteRow(T.adminRoles, id)
}

export function onRolesChange(
  callback: (roles: AdminRole[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.adminRoles, fetchRolesFS, callback, onError)
}

// ── Admin users ─────────────────────────────────────────────────────

export async function fetchUsersFS(): Promise<AdminUser[]> {
  return selectAll<AdminUser>(T.adminUsers)
}

export async function addUserFS(user: Omit<AdminUser, 'id'>): Promise<string> {
  return insertRow(T.adminUsers, user)
}

export async function updateUserFS(id: string, data: Partial<AdminUser>): Promise<void> {
  return updateRow(T.adminUsers, id, { ...data, updatedAt: now() })
}

export async function deleteUserFS(id: string): Promise<void> {
  return deleteRow(T.adminUsers, id)
}

export function onUsersChange(
  callback: (users: AdminUser[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return watch(T.adminUsers, fetchUsersFS, callback, onError)
}

export async function getUserByEmailFS(email: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from(T.adminUsers)
    .select('*')
    .eq('email', email)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as AdminUser) ?? null
}
