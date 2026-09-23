import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
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
  SEOConfig,
  Toast,
  AdminRole,
  AdminUser,
} from '@/admin/lib/types'
import {
  // Gamme
  addGammeFS,
  updateGammeFS,
  deleteGammeFS,
  onGammesChange,
  // Offre
  addOffreFS,
  updateOffreFS,
  deleteOffreFS,
  onOffresChange,
  // FAQ
  addFAQFS,
  updateFAQFS,
  deleteFAQFS,
  onFAQChange,
  // Nav groups
  addNavGroupFS,
  updateNavGroupFS,
  deleteNavGroupFS,
  onNavGroupsChange,
  // Nav items
  addNavItemFS,
  updateNavItemFS,
  deleteNavItemFS,
  onNavItemsChange,
  // Annonces
  addAnnonceFS,
  updateAnnonceFS,
  deleteAnnonceFS,
  onAnnoncesChange,
  // Team
  addTeamMemberFS,
  updateTeamMemberFS,
  deleteTeamMemberFS,
  onTeamChange,
  // Config
  updateHeroConfigFS,
  onHeroConfigChange,
  updateSiteSettingsFS,
  onSiteSettingsChange,
  updateMaintenanceModeFS,
  onMaintenanceModeChange,
  // History
  addHistoryEntryFS,
  fetchHistoryFS,
  // Batch reorder
  batchReorderFS,
  // Batch delete / update
  batchDeleteSimpleFS,
  batchDeleteGammesFS,
  batchUpdateFieldFS,
  // Versioning
  saveVersionFS,
  fetchVersionsFS,
  deleteOldVersionsFS,
  // Notifications
  addNotificationsBatchFS,
  markNotificationReadFS,
  markAllNotificationsReadFS,
  onNotificationsChange,
  deleteOldNotificationsFS,
  // Discord
  updateDiscordConfigFS,
  onDiscordConfigChange,
  // SEO
  addSEOConfigFS,
  updateSEOConfigFS,
  deleteSEOConfigFS,
  onSEOConfigsChange,
  // Admin users & roles
  addRoleFS,
  updateRoleFS,
  deleteRoleFS,
  onRolesChange,
  addUserFS,
  updateUserFS,
  deleteUserFS,
  onUsersChange,
  getUserByEmailFS,
} from '@/admin/lib/db'
import { onAuthChange } from '@/admin/lib/auth'
import { sendDiscordNotification } from '@/admin/lib/discord'

// ── Context interface ────────────────────────────────────────────────

interface AdminContextValue {
  // Data (populated by Firestore listeners)
  gammes: Gamme[]
  offres: Offre[]
  faq: FAQItem[]
  navGroups: NavGroup[]
  navItems: NavItemAdmin[]
  annonces: Annonce[]
  team: TeamMemberAdmin[]
  heroConfig: HeroConfig | null
  siteSettings: SiteSettings | null
  maintenanceMode: MaintenanceMode | null
  history: HistoryEntry[]

  // Admin users & roles
  adminUsers: AdminUser[]
  adminRoles: AdminRole[]
  currentUser: AdminUser | null

  // SEO
  seoConfigs: SEOConfig[]

  // Notifications
  notifications: AdminNotification[]
  unreadCount: number
  discordConfig: DiscordWebhookConfig | null

  // UI state
  toasts: Toast[]
  loading: boolean

  // Gamme CRUD
  addGamme: (g: Omit<Gamme, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateGamme: (id: string, data: Partial<Gamme>) => Promise<void>
  deleteGamme: (id: string) => Promise<void>

  // Offre CRUD
  addOffre: (o: Omit<Offre, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateOffre: (id: string, data: Partial<Offre>) => Promise<void>
  deleteOffre: (id: string) => Promise<void>

  // FAQ CRUD
  addFAQ: (f: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFAQ: (id: string, data: Partial<FAQItem>) => Promise<void>
  deleteFAQ: (id: string) => Promise<void>

  // Navigation CRUD
  addNavGroup: (g: Omit<NavGroup, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNavGroup: (id: string, data: Partial<NavGroup>) => Promise<void>
  deleteNavGroup: (id: string) => Promise<void>
  addNavItem: (i: Omit<NavItemAdmin, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNavItem: (id: string, data: Partial<NavItemAdmin>) => Promise<void>
  deleteNavItem: (id: string) => Promise<void>

  // Annonce CRUD
  addAnnonce: (a: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAnnonce: (id: string, data: Partial<Annonce>) => Promise<void>
  deleteAnnonce: (id: string) => Promise<void>

  // Team CRUD
  addTeamMember: (m: Omit<TeamMemberAdmin, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTeamMember: (id: string, data: Partial<TeamMemberAdmin>) => Promise<void>
  deleteTeamMember: (id: string) => Promise<void>

  // Clone operations
  cloneGamme: (id: string) => Promise<void>
  cloneOffre: (id: string) => Promise<void>
  cloneFAQ: (id: string) => Promise<void>
  cloneTeamMember: (id: string) => Promise<void>
  cloneNavItem: (id: string) => Promise<void>
  cloneAnnonce: (id: string) => Promise<void>

  // Bulk operations
  bulkDeleteGammes: (ids: string[]) => Promise<void>
  bulkDeleteOffres: (ids: string[]) => Promise<void>
  bulkDeleteFAQ: (ids: string[]) => Promise<void>
  bulkDeleteTeam: (ids: string[]) => Promise<void>
  bulkUpdateOffreStatus: (ids: string[], statut: Offre['statut']) => Promise<void>
  bulkToggleMisEnAvant: (ids: string[], value: boolean) => Promise<void>

  // Reorder (DnD)
  reorderGammes: (orderedIds: string[]) => Promise<void>
  reorderOffres: (orderedIds: string[]) => Promise<void>
  reorderFAQ: (orderedIds: string[]) => Promise<void>
  reorderTeam: (orderedIds: string[]) => Promise<void>
  reorderNavGroups: (orderedIds: string[]) => Promise<void>
  reorderNavItems: (orderedIds: string[]) => Promise<void>

  // Config
  updateHeroConfig: (config: HeroConfig) => Promise<void>
  updateSiteSettings: (settings: SiteSettings) => Promise<void>
  updateMaintenanceMode: (mode: MaintenanceMode) => Promise<void>

  // Admin Role CRUD
  addRole: (r: Omit<AdminRole, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRole: (id: string, data: Partial<AdminRole>) => Promise<void>
  deleteRole: (id: string) => Promise<void>

  // Admin User CRUD
  addAdminUser: (u: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAdminUser: (id: string, data: Partial<AdminUser>) => Promise<void>
  deleteAdminUser: (id: string) => Promise<void>

  // Versioning
  fetchVersions: (entityId: string, entityType: HistoryEntry['entityType']) => Promise<ContentVersion[]>

  // Notifications
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>

  // SEO
  addSEOConfig: (config: Omit<SEOConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSEOConfig: (id: string, data: Partial<SEOConfig>) => Promise<void>
  deleteSEOConfig: (id: string) => Promise<void>

  // Discord
  updateDiscordConfig: (config: DiscordWebhookConfig) => Promise<void>

  // History
  refreshHistory: () => Promise<void>

  // Toast
  addToast: (type: Toast['type'], message: string) => void
  removeToast: (id: string) => void
}

// ── Context ──────────────────────────────────────────────────────────

const AdminContext = createContext<AdminContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
  // Data state (populated by Firestore onSnapshot listeners)
  const [gammes, setGammes] = useState<Gamme[]>([])
  const [offres, setOffres] = useState<Offre[]>([])
  const [faq, setFaq] = useState<FAQItem[]>([])
  const [navGroups, setNavGroups] = useState<NavGroup[]>([])
  const [navItems, setNavItems] = useState<NavItemAdmin[]>([])
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [team, setTeam] = useState<TeamMemberAdmin[]>([])
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Admin users & roles
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([])
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)

  // SEO
  const [seoConfigs, setSeoConfigs] = useState<SEOConfig[]>([])

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [discordConfig, setDiscordConfig] = useState<DiscordWebhookConfig | null>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  // Refs for stable access in callbacks (avoids stale closures)
  const currentUserRef = useRef(currentUser)
  currentUserRef.current = currentUser
  const adminUsersRef = useRef(adminUsers)
  adminUsersRef.current = adminUsers
  const discordConfigRef = useRef(discordConfig)
  discordConfigRef.current = discordConfig

  // UI state
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState(true)

  // ── Toast helpers ────────────────────────────────────────────────

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Firestore listeners (subscribe on mount, cleanup on unmount) ─

  useEffect(() => {
    const unsubs: (() => void)[] = []

    // The first listener to fire (success or error) marks loading as done
    let initialLoadDone = false
    const markLoaded = () => {
      if (!initialLoadDone) {
        initialLoadDone = true
        setLoading(false)
      }
    }

    // Show a single error toast on first Firestore failure
    let errorShown = false
    const onListenerError = (err: Error) => {
      markLoaded()
      if (!errorShown) {
        errorShown = true
        addToast('error', `Base de données inaccessible : ${err.message}. Vérifiez la config Supabase (.env) et le schéma SQL.`)
      }
    }

    unsubs.push(onGammesChange(data => { setGammes(data); markLoaded() }, onListenerError))
    unsubs.push(onOffresChange(data => setOffres(data), onListenerError))
    unsubs.push(onFAQChange(data => setFaq(data), onListenerError))
    unsubs.push(onNavGroupsChange(data => setNavGroups(data), onListenerError))
    unsubs.push(onNavItemsChange(data => setNavItems(data), onListenerError))
    unsubs.push(onAnnoncesChange(data => setAnnonces(data), onListenerError))
    unsubs.push(onTeamChange(data => setTeam(data), onListenerError))

    // Config documents
    unsubs.push(onHeroConfigChange(data => setHeroConfig(data), onListenerError))
    unsubs.push(onSiteSettingsChange(data => setSiteSettings(data), onListenerError))
    unsubs.push(onMaintenanceModeChange(data => setMaintenanceMode(data), onListenerError))

    // Admin users & roles
    unsubs.push(onRolesChange(data => setAdminRoles(data), onListenerError))
    unsubs.push(onUsersChange(data => setAdminUsers(data), onListenerError))

    // Discord config
    unsubs.push(onDiscordConfigChange(data => setDiscordConfig(data), onListenerError))

    // SEO configs
    unsubs.push(onSEOConfigsChange(data => setSeoConfigs(data), onListenerError))

    // Cleanup old notifications on mount (fire-and-forget)
    deleteOldNotificationsFS(30).catch(() => { /* ignore */ })

    // History (fetch once, not a real-time listener)
    fetchHistoryFS(500).then(data => setHistory(data)).catch(() => { /* ignore */ })

    // Timeout: if Firestore never responds within 12s, unblock the UI
    const timeoutId = setTimeout(() => {
      if (!initialLoadDone) {
        markLoaded()
        addToast('warning', 'Connexion à la base trop lente — vérifiez la config Supabase (.env).')
      }
    }, 12_000)

    return () => {
      clearTimeout(timeoutId)
      unsubs.forEach(fn => fn())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Current user (match Firebase Auth email → Firestore adminUser) ─

  useEffect(() => {
    const unsub = onAuthChange(async (authUser) => {
      if (authUser?.email) {
        try {
          const user = await getUserByEmailFS(authUser.email)
          setCurrentUser(user)
        } catch {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    })
    return unsub
  }, [])

  // ── Notifications listener (depends on currentUser) ────────────

  useEffect(() => {
    if (!currentUser?.id) {
      setNotifications([])
      return
    }
    const unsub = onNotificationsChange(
      currentUser.id,
      data => setNotifications(data),
      err => console.error('[Notifications] listener error:', err),
    )
    return unsub
  }, [currentUser?.id])

  // ── History refresh ──────────────────────────────────────────────

  const refreshHistory = useCallback(async () => {
    const data = await fetchHistoryFS(500)
    setHistory(data)
  }, [])

  // ── History helper (includes current user name + notifications + Discord) ─
  // Uses refs to always read latest values — avoids stale closures in CRUD callbacks
  const logHistory = useCallback(async (entry: Omit<HistoryEntry, 'id'>) => {
    const user = currentUserRef.current
    const users = adminUsersRef.current
    const discord = discordConfigRef.current

    const enriched = { ...entry, userName: user?.displayName ?? 'Système', userId: user?.id, userAvatar: user?.avatar }
    await addHistoryEntryFS(enriched)

    // Broadcast notifications to all other admins
    try {
      const otherAdmins = users.filter(u => u.id !== user?.id)
      if (otherAdmins.length > 0) {
        const actionLabels: Record<string, string> = {
          create: 'Création',
          update: 'Modification',
          delete: 'Suppression',
        }
        const notifs = otherAdmins.map(u => ({
          type: (entry.action === 'delete' ? 'warning' : 'info') as AdminNotification['type'],
          title: `${actionLabels[entry.action] ?? entry.action} — ${entry.entityType}`,
          message: entry.entityName,
          entityType: entry.entityType,
          read: false,
          createdAt: entry.timestamp,
          createdBy: user?.id,
          createdByName: user?.displayName ?? 'Système',
          targetUserId: u.id,
        }))
        await addNotificationsBatchFS(notifs)
      }
    } catch (err) {
      console.error('[Notifications] Failed to broadcast:', err)
    }

    // Discord webhook (fire-and-forget)
    if (discord) {
      sendDiscordNotification(discord, enriched).catch(() => { /* ignore */ })
    }
  }, []) // stable — reads from refs

  // ── Versioning helper ──────────────────────────────────────────

  const saveVersion = useCallback(async (
    entityId: string,
    entityType: HistoryEntry['entityType'],
    data: Record<string, unknown>,
  ) => {
    try {
      const user = currentUserRef.current
      // Get current max version
      const existing = await fetchVersionsFS(entityId, entityType)
      const maxVersion = existing.length > 0 ? Math.max(...existing.map(v => v.version)) : 0
      await saveVersionFS({
        entityId,
        entityType,
        version: maxVersion + 1,
        data,
        createdAt: new Date().toISOString(),
        createdBy: user?.id,
        createdByName: user?.displayName,
      })
      // Trim old versions (keep 50)
      await deleteOldVersionsFS(entityId, entityType, 50)
    } catch (err) {
      console.error('[Versioning] Failed to save version:', err)
    }
  }, []) // stable — reads from ref

  const fetchVersions = useCallback(async (
    entityId: string,
    entityType: HistoryEntry['entityType'],
  ): Promise<ContentVersion[]> => {
    return fetchVersionsFS(entityId, entityType)
  }, [])

  // ── Notification helpers ─────────────────────────────────────────

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await markNotificationReadFS(id)
    } catch (err) {
      console.error('[Notifications] Failed to mark read:', err)
    }
  }, [])

  const markAllNotificationsRead = useCallback(async () => {
    const userId = currentUserRef.current?.id
    if (!userId) return
    try {
      await markAllNotificationsReadFS(userId)
    } catch (err) {
      console.error('[Notifications] Failed to mark all read:', err)
    }
  }, []) // stable — reads from ref

  // ── Discord config ────────────────────────────────────────────

  const updateDiscordConfig = useCallback(async (config: DiscordWebhookConfig) => {
    try {
      await updateDiscordConfigFS(config)
      addToast('success', 'Configuration Discord mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  // ── Gamme CRUD ───────────────────────────────────────────────────

  const addGamme = useCallback(async (g: Omit<Gamme, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addGammeFS({ ...g, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'gamme', action: 'create', entityName: g.nom, timestamp: now })
      addToast('success', `Gamme "${g.nom}" créée`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateGamme = useCallback(async (id: string, data: Partial<Gamme>) => {
    try {
      // Save current state as a version before updating
      const current = gammes.find(g => g.id === id)
      if (current) {
        const { id: _id, ...snapshot } = current
        await saveVersion(id, 'gamme', snapshot as unknown as Record<string, unknown>)
      }
      await updateGammeFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'gamme', action: 'update', entityName: data.nom ?? id, timestamp: now })
      addToast('success', 'Gamme mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, gammes, saveVersion])

  const deleteGamme = useCallback(async (id: string) => {
    try {
      const gamme = gammes.find(g => g.id === id)
      await deleteGammeFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'gamme', action: 'delete', entityName: gamme?.nom ?? id, timestamp: now })
      addToast('info', 'Gamme supprimée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, gammes])

  // ── Offre CRUD ───────────────────────────────────────────────────

  const addOffre = useCallback(async (o: Omit<Offre, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addOffreFS({ ...o, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'offre', action: 'create', entityName: o.nom, timestamp: now })
      addToast('success', `Offre "${o.nom}" créée`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateOffre = useCallback(async (id: string, data: Partial<Offre>) => {
    try {
      // Save current state as a version before updating
      const current = offres.find(o => o.id === id)
      if (current) {
        const { id: _id, ...snapshot } = current
        await saveVersion(id, 'offre', snapshot as unknown as Record<string, unknown>)
      }
      await updateOffreFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'offre', action: 'update', entityName: data.nom ?? id, timestamp: now })
      addToast('success', 'Offre mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, offres, saveVersion])

  const deleteOffre = useCallback(async (id: string) => {
    try {
      const offre = offres.find(o => o.id === id)
      await deleteOffreFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'offre', action: 'delete', entityName: offre?.nom ?? id, timestamp: now })
      addToast('info', 'Offre supprimée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, offres])

  // ── FAQ CRUD ─────────────────────────────────────────────────────

  const addFAQ = useCallback(async (f: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addFAQFS({ ...f, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'faq', action: 'create', entityName: f.question, timestamp: now })
      addToast('success', 'Question ajoutée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateFAQ = useCallback(async (id: string, data: Partial<FAQItem>) => {
    try {
      await updateFAQFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'faq', action: 'update', entityName: data.question ?? id, timestamp: now })
      addToast('success', 'Question mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteFAQ = useCallback(async (id: string) => {
    try {
      const item = faq.find(f => f.id === id)
      await deleteFAQFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'faq', action: 'delete', entityName: item?.question ?? id, timestamp: now })
      addToast('info', 'Question supprimée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, faq])

  // ── Navigation Group CRUD ────────────────────────────────────────

  const addNavGroup = useCallback(async (g: Omit<NavGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addNavGroupFS({ ...g, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'navigation', action: 'create', entityName: g.label, timestamp: now })
      addToast('success', `Groupe "${g.label}" créé`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateNavGroup = useCallback(async (id: string, data: Partial<NavGroup>) => {
    try {
      await updateNavGroupFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'navigation', action: 'update', entityName: data.label ?? id, timestamp: now })
      addToast('success', 'Groupe de navigation mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteNavGroup = useCallback(async (id: string) => {
    try {
      const group = navGroups.find(g => g.id === id)
      await deleteNavGroupFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'navigation', action: 'delete', entityName: group?.label ?? id, timestamp: now })
      addToast('info', 'Groupe de navigation supprimé')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, navGroups])

  // ── Navigation Item CRUD ─────────────────────────────────────────

  const addNavItem = useCallback(async (i: Omit<NavItemAdmin, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addNavItemFS({ ...i, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'navigation', action: 'create', entityName: i.label, timestamp: now })
      addToast('success', `Lien "${i.label}" créé`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateNavItem = useCallback(async (id: string, data: Partial<NavItemAdmin>) => {
    try {
      await updateNavItemFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'navigation', action: 'update', entityName: data.label ?? id, timestamp: now })
      addToast('success', 'Lien de navigation mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteNavItem = useCallback(async (id: string) => {
    try {
      const item = navItems.find(i => i.id === id)
      await deleteNavItemFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'navigation', action: 'delete', entityName: item?.label ?? id, timestamp: now })
      addToast('info', 'Lien de navigation supprimé')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, navItems])

  // ── Annonce CRUD ─────────────────────────────────────────────────

  const addAnnonce = useCallback(async (a: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addAnnonceFS({ ...a, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'annonce', action: 'create', entityName: a.message, timestamp: now })
      addToast('success', 'Annonce créée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateAnnonce = useCallback(async (id: string, data: Partial<Annonce>) => {
    try {
      await updateAnnonceFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'annonce', action: 'update', entityName: data.message ?? id, timestamp: now })
      addToast('success', 'Annonce mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteAnnonce = useCallback(async (id: string) => {
    try {
      const annonce = annonces.find(a => a.id === id)
      await deleteAnnonceFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'annonce', action: 'delete', entityName: annonce?.message ?? id, timestamp: now })
      addToast('info', 'Annonce supprimée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, annonces])

  // ── Team CRUD ────────────────────────────────────────────────────

  const addTeamMember = useCallback(async (m: Omit<TeamMemberAdmin, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addTeamMemberFS({ ...m, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'equipe', action: 'create', entityName: m.name, timestamp: now })
      addToast('success', `Membre "${m.name}" ajouté`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateTeamMember = useCallback(async (id: string, data: Partial<TeamMemberAdmin>) => {
    try {
      await updateTeamMemberFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'equipe', action: 'update', entityName: data.name ?? id, timestamp: now })
      addToast('success', 'Membre mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      const member = team.find(m => m.id === id)
      await deleteTeamMemberFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'equipe', action: 'delete', entityName: member?.name ?? id, timestamp: now })
      addToast('info', 'Membre supprimé')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, team])

  // ── Clone operations ──────────────────────────────────────────────

  const cloneGamme = useCallback(async (id: string) => {
    try {
      const source = gammes.find(g => g.id === id)
      if (!source) { addToast('error', 'Gamme introuvable'); return }
      const maxOrdre = gammes.reduce((max, g) => Math.max(max, g.ordre), 0)
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addGammeFS({
        ...data,
        nom: `${data.nom} (copie)`,
        shortName: `${data.shortName} (copie)`,
        slug: `${data.slug}-copie`,
        ordre: maxOrdre + 1,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'gamme', action: 'create', entityName: `Duplication de "${source.nom}"`, timestamp: now })
      addToast('success', `Gamme "${source.nom}" dupliquée`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, gammes])

  const cloneOffre = useCallback(async (id: string) => {
    try {
      const source = offres.find(o => o.id === id)
      if (!source) { addToast('error', 'Offre introuvable'); return }
      const sameGammeOffres = offres.filter(o => o.gammeId === source.gammeId)
      const maxOrdre = sameGammeOffres.reduce((max, o) => Math.max(max, o.ordre), 0)
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addOffreFS({
        ...data,
        nom: `${data.nom} (copie)`,
        slug: `${data.slug}-copie`,
        ordre: maxOrdre + 1,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'offre', action: 'create', entityName: `Duplication de "${source.nom}"`, timestamp: now })
      addToast('success', `Offre "${source.nom}" dupliquée`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, offres])

  const cloneFAQ = useCallback(async (id: string) => {
    try {
      const source = faq.find(f => f.id === id)
      if (!source) { addToast('error', 'Question introuvable'); return }
      const sameGammeFaq = faq.filter(f => f.gammeId === source.gammeId)
      const maxPos = sameGammeFaq.reduce((max, f) => Math.max(max, f.position), 0)
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addFAQFS({
        ...data,
        question: `${data.question} (copie)`,
        position: maxPos + 1,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'faq', action: 'create', entityName: `Duplication de "${source.question}"`, timestamp: now })
      addToast('success', 'Question dupliquée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, faq])

  const cloneTeamMember = useCallback(async (id: string) => {
    try {
      const source = team.find(m => m.id === id)
      if (!source) { addToast('error', 'Membre introuvable'); return }
      const maxOrdre = team.reduce((max, m) => Math.max(max, m.ordre), 0)
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addTeamMemberFS({
        ...data,
        name: `${data.name} (copie)`,
        ordre: maxOrdre + 1,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'equipe', action: 'create', entityName: `Duplication de "${source.name}"`, timestamp: now })
      addToast('success', `Membre "${source.name}" dupliqué`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, team])

  const cloneNavItem = useCallback(async (id: string) => {
    try {
      const source = navItems.find(i => i.id === id)
      if (!source) { addToast('error', 'Lien introuvable'); return }
      const sameGroupItems = navItems.filter(i => i.groupId === source.groupId)
      const maxOrdre = sameGroupItems.reduce((max, i) => Math.max(max, i.ordre), 0)
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addNavItemFS({
        ...data,
        label: `${data.label} (copie)`,
        ordre: maxOrdre + 1,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'navigation', action: 'create', entityName: `Duplication de "${source.label}"`, timestamp: now })
      addToast('success', `Lien "${source.label}" dupliqué`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, navItems])

  const cloneAnnonce = useCallback(async (id: string) => {
    try {
      const source = annonces.find(a => a.id === id)
      if (!source) { addToast('error', 'Annonce introuvable'); return }
      const now = new Date().toISOString()
      const { id: _id, createdAt: _c, updatedAt: _u, ...data } = source
      await addAnnonceFS({
        ...data,
        actif: false,
        createdAt: now,
        updatedAt: now,
      })
      await logHistory({ entityType: 'annonce', action: 'create', entityName: `Duplication de "${source.message}"`, timestamp: now })
      addToast('success', 'Annonce dupliquée (inactive)')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, annonces])

  // ── Bulk operations ─────────────────────────────────────────────

  const bulkDeleteGammes = useCallback(async (ids: string[]) => {
    try {
      await batchDeleteGammesFS(ids)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'gamme', action: 'delete', entityName: `Suppression groupée de ${ids.length} gamme${ids.length > 1 ? 's' : ''}`, timestamp: now })
      addToast('success', `${ids.length} gamme${ids.length > 1 ? 's' : ''} supprimée${ids.length > 1 ? 's' : ''}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const bulkDeleteOffres = useCallback(async (ids: string[]) => {
    try {
      await batchDeleteSimpleFS('offres', ids)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'offre', action: 'delete', entityName: `Suppression groupée de ${ids.length} offre${ids.length > 1 ? 's' : ''}`, timestamp: now })
      addToast('success', `${ids.length} offre${ids.length > 1 ? 's' : ''} supprimée${ids.length > 1 ? 's' : ''}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const bulkDeleteFAQ = useCallback(async (ids: string[]) => {
    try {
      await batchDeleteSimpleFS('faq', ids)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'faq', action: 'delete', entityName: `Suppression groupée de ${ids.length} question${ids.length > 1 ? 's' : ''}`, timestamp: now })
      addToast('success', `${ids.length} question${ids.length > 1 ? 's' : ''} supprimée${ids.length > 1 ? 's' : ''}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const bulkDeleteTeam = useCallback(async (ids: string[]) => {
    try {
      await batchDeleteSimpleFS('team', ids)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'equipe', action: 'delete', entityName: `Suppression groupée de ${ids.length} membre${ids.length > 1 ? 's' : ''}`, timestamp: now })
      addToast('success', `${ids.length} membre${ids.length > 1 ? 's' : ''} supprimé${ids.length > 1 ? 's' : ''}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const bulkUpdateOffreStatus = useCallback(async (ids: string[], statut: Offre['statut']) => {
    try {
      await batchUpdateFieldFS('offres', ids, { statut })
      const now = new Date().toISOString()
      const label = statut === 'actif' ? 'activées' : statut === 'brouillon' ? 'passées en brouillon' : 'archivées'
      await logHistory({ entityType: 'offre', action: 'update', entityName: `${ids.length} offre${ids.length > 1 ? 's' : ''} ${label}`, timestamp: now })
      addToast('success', `${ids.length} offre${ids.length > 1 ? 's' : ''} ${label}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const bulkToggleMisEnAvant = useCallback(async (ids: string[], value: boolean) => {
    try {
      await batchUpdateFieldFS('offres', ids, { misEnAvant: value })
      const now = new Date().toISOString()
      const label = value ? 'mises en avant' : 'retirées de la mise en avant'
      await logHistory({ entityType: 'offre', action: 'update', entityName: `${ids.length} offre${ids.length > 1 ? 's' : ''} ${label}`, timestamp: now })
      addToast('success', `${ids.length} offre${ids.length > 1 ? 's' : ''} ${label}`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  // ── Reorder (DnD) ───────────────────────────────────────────────

  const reorderGammes = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('gammes', reorders)
      addToast('success', 'Ordre des gammes mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const reorderOffres = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('offres', reorders)
      addToast('success', 'Ordre des offres mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const reorderFAQ = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('faq', reorders, 'position')
      addToast('success', 'Ordre des FAQ mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const reorderTeam = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('team', reorders)
      addToast('success', 'Ordre de l\'équipe mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const reorderNavGroups = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('navGroups', reorders)
      addToast('success', 'Ordre des groupes mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const reorderNavItems = useCallback(async (orderedIds: string[]) => {
    try {
      const reorders = orderedIds.map((id, i) => ({ id, ordre: i + 1 }))
      await batchReorderFS('navItems', reorders)
      addToast('success', 'Ordre des items mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  // ── Config updates ───────────────────────────────────────────────

  const updateHeroConfig = useCallback(async (config: HeroConfig) => {
    try {
      // Save current state as a version before updating
      if (heroConfig) {
        await saveVersion('hero', 'hero', heroConfig as unknown as Record<string, unknown>)
      }
      await updateHeroConfigFS(config)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'hero', action: 'update', entityName: 'Configuration Hero', timestamp: now })
      addToast('success', 'Configuration Hero mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, heroConfig, saveVersion])

  const updateSiteSettings = useCallback(async (settings: SiteSettings) => {
    try {
      await updateSiteSettingsFS(settings)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'settings', action: 'update', entityName: 'Paramètres du site', timestamp: now })
      addToast('success', 'Paramètres du site mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateMaintenanceMode = useCallback(async (mode: MaintenanceMode) => {
    try {
      await updateMaintenanceModeFS(mode)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'maintenance', action: 'update', entityName: 'Mode maintenance', timestamp: now })
      addToast('success', 'Mode maintenance mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  // ── Admin Role CRUD ─────────────────────────────────────────────

  const addRole = useCallback(async (r: Omit<AdminRole, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addRoleFS({ ...r, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'settings', action: 'create', entityName: `Rôle "${r.name}"`, timestamp: now })
      addToast('success', `Rôle "${r.name}" créé`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast])

  const updateRole = useCallback(async (id: string, data: Partial<AdminRole>) => {
    try {
      await updateRoleFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'settings', action: 'update', entityName: `Rôle "${data.name ?? id}"`, timestamp: now })
      addToast('success', 'Rôle mis à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast])

  const deleteRole = useCallback(async (id: string) => {
    try {
      const role = adminRoles.find(r => r.id === id)
      await deleteRoleFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'settings', action: 'delete', entityName: `Rôle "${role?.name ?? id}"`, timestamp: now })
      addToast('info', 'Rôle supprimé')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast, adminRoles])

  // ── Admin User CRUD ────────────────────────────────────────────

  const addAdminUser = useCallback(async (u: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addUserFS({ ...u, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'settings', action: 'create', entityName: `Utilisateur "${u.displayName}"`, timestamp: now })
      addToast('success', `Utilisateur "${u.displayName}" créé`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast])

  const updateAdminUser = useCallback(async (id: string, data: Partial<AdminUser>) => {
    try {
      await updateUserFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'settings', action: 'update', entityName: `Utilisateur "${data.displayName ?? id}"`, timestamp: now })
      addToast('success', 'Utilisateur mis à jour')
      // Refresh currentUser if it's the same user
      if (currentUser?.id === id) {
        setCurrentUser(prev => prev ? { ...prev, ...data } : prev)
      }
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast, currentUser])

  const deleteAdminUser = useCallback(async (id: string) => {
    try {
      const user = adminUsers.find(u => u.id === id)
      await deleteUserFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'settings', action: 'delete', entityName: `Utilisateur "${user?.displayName ?? id}"`, timestamp: now })
      addToast('info', 'Utilisateur supprimé')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
      throw err
    }
  }, [addToast, adminUsers])

  // ── SEO CRUD ──────────────────────────────────────────────────────

  const addSEOConfig = useCallback(async (config: Omit<SEOConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      await addSEOConfigFS({ ...config, createdAt: now, updatedAt: now })
      await logHistory({ entityType: 'seo', action: 'create', entityName: config.pageSlug, timestamp: now })
      addToast('success', `SEO pour "${config.pageSlug}" créé`)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const updateSEOConfig = useCallback(async (id: string, data: Partial<SEOConfig>) => {
    try {
      await updateSEOConfigFS(id, data)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'seo', action: 'update', entityName: data.pageSlug ?? id, timestamp: now })
      addToast('success', 'Configuration SEO mise à jour')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast])

  const deleteSEOConfig = useCallback(async (id: string) => {
    try {
      const config = seoConfigs.find(c => c.id === id)
      await deleteSEOConfigFS(id)
      const now = new Date().toISOString()
      await logHistory({ entityType: 'seo', action: 'delete', entityName: config?.pageSlug ?? id, timestamp: now })
      addToast('info', 'Configuration SEO supprimée')
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    }
  }, [addToast, seoConfigs])

  // ── Provider value ───────────────────────────────────────────────

  return (
    <AdminContext.Provider value={{
      // Data
      gammes, offres, faq, navGroups, navItems, annonces, team,
      heroConfig, siteSettings, maintenanceMode, history,

      // Admin users & roles
      adminUsers, adminRoles, currentUser,

      // SEO
      seoConfigs,

      // Notifications
      notifications, unreadCount, discordConfig,

      // UI state
      toasts, loading,

      // Gamme CRUD
      addGamme, updateGamme, deleteGamme,

      // Offre CRUD
      addOffre, updateOffre, deleteOffre,

      // FAQ CRUD
      addFAQ, updateFAQ, deleteFAQ,

      // Navigation CRUD
      addNavGroup, updateNavGroup, deleteNavGroup,
      addNavItem, updateNavItem, deleteNavItem,

      // Annonce CRUD
      addAnnonce, updateAnnonce, deleteAnnonce,

      // Team CRUD
      addTeamMember, updateTeamMember, deleteTeamMember,

      // Clone operations
      cloneGamme, cloneOffre, cloneFAQ, cloneTeamMember, cloneNavItem, cloneAnnonce,

      // Bulk operations
      bulkDeleteGammes, bulkDeleteOffres, bulkDeleteFAQ, bulkDeleteTeam,
      bulkUpdateOffreStatus, bulkToggleMisEnAvant,

      // Reorder (DnD)
      reorderGammes, reorderOffres, reorderFAQ, reorderTeam, reorderNavGroups, reorderNavItems,

      // Config
      updateHeroConfig, updateSiteSettings, updateMaintenanceMode,

      // Admin Role CRUD
      addRole, updateRole, deleteRole,

      // Admin User CRUD
      addAdminUser, updateAdminUser, deleteAdminUser,

      // Versioning
      fetchVersions,

      // Notifications
      markNotificationRead, markAllNotificationsRead,

      // SEO
      addSEOConfig, updateSEOConfig, deleteSEOConfig,

      // Discord
      updateDiscordConfig,

      // History
      refreshHistory,

      // Toast
      addToast, removeToast,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
