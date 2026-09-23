// ── Scheduled Publishing ────────────────────────────────────────────
export interface ScheduleConfig {
  publishAt?: string     // ISO date — auto-activate at this date
  unpublishAt?: string   // ISO date — auto-deactivate at this date
}

// ── Gamme (product category) ──────────────────────────────────────────

export interface Gamme {
  id: string
  nom: string
  shortName: string
  slug: string
  description: string
  icon: string              // Lucide icon name (e.g. 'Globe', 'Server')
  heroTitle: string
  heroDescription: string
  useCases: string[]
  category: string          // id of a NavGroup (see Navigation admin) — which menu group this gamme belongs to
  comingSoon: boolean
  actif: boolean
  ordre: number
  scheduleConfig?: ScheduleConfig
  createdAt: string
  updatedAt: string
}

// ── Offre (pricing plan) ─────────────────────────────────────────────
export interface Prix {
  mensuel?: number
  trimestriel?: number
  annuel?: number
  afficherMensuel: boolean
  afficherTrimestriel: boolean
  afficherAnnuel: boolean
}

export interface Offre {
  id: string
  gammeId: string
  nom: string
  slug: string
  tagline: string
  description: string
  features: string[]
  prix: Prix
  specs: {
    ram: string
    cpu: string
    storage: string
    bandwidth: string
  }
  badge?: string            // e.g. 'Populaire', 'Meilleur rapport'
  orderUrl?: string         // WHMCS order link
  statut: 'actif' | 'brouillon' | 'archive'
  misEnAvant: boolean
  ordre: number
  scheduleConfig?: ScheduleConfig
  createdAt: string
  updatedAt: string
}

// ── FAQ ──────────────────────────────────────────────────────────────
export interface FAQItem {
  id: string
  gammeId: string           // 'global' for site-wide FAQ
  question: string
  reponse: string
  position: number
  createdAt: string
  updatedAt: string
}

// ── Navigation ───────────────────────────────────────────────────────
export interface NavGroup {
  id: string
  label: string
  color: string             // Tailwind class e.g. 'bg-primary'
  icon: string              // Lucide icon name
  ordre: number
  createdAt: string
  updatedAt: string
}

export interface NavItemAdmin {
  id: string
  label: string
  href: string
  groupId: string
  ordre: number
  comingSoon: boolean
  createdAt: string
  updatedAt: string
}

// ── Annonce (announcement bar) ───────────────────────────────────────
export interface Annonce {
  id: string
  message: string
  linkText?: string
  linkAction?: string       // URL or 'deploy-modal'
  actif: boolean
  dateDebut?: string
  dateFin?: string
  isPromo?: boolean
  promoReduction?: number    // Percentage: 1-99
  promoGammeIds?: string[]   // Targeted gamme IDs
  createdAt: string
  updatedAt: string
}

// ── Equipe ───────────────────────────────────────────────────────────
export interface TeamMemberAdmin {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  socials: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  ordre: number
  createdAt: string
  updatedAt: string
}

// ── Hero config ──────────────────────────────────────────────────────
export interface HeroConfig {
  titleLine1: string
  titleLine2: string
  typedWords: string[]
  subtitle: string
  ctaPrimaryText: string
  ctaSecondaryText: string
}

// ── Site settings ────────────────────────────────────────────────────
export interface SiteSettings {
  contactEmail: string
  socialInstagram: string
  socialDiscord: string
  socialLinkedin: string
  whmcsBaseUrl: string
  companyTagline: string
}

// ── Maintenance mode ─────────────────────────────────────────────────
export interface MaintenanceMode {
  enabled: boolean
  message: string
  estimatedReturn?: string
}

// ── History log ──────────────────────────────────────────────────────
export interface HistoryEntry {
  id: string
  entityType: 'gamme' | 'offre' | 'faq' | 'navigation' | 'annonce' | 'equipe' | 'hero' | 'settings' | 'maintenance' | 'seo'
  action: 'create' | 'update' | 'delete'
  entityName: string
  timestamp: string
  userId?: string
  userName?: string
  userAvatar?: string
}

// ── Admin permissions & roles ────────────────────────────────────────

export interface AdminPermissions {
  dashboard: { view: boolean }
  gammes: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  offres: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  faq: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  navigation: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  annonces: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  equipe: { view: boolean; create: boolean; edit: boolean; delete: boolean }
  hero: { view: boolean; edit: boolean }
  maintenance: { view: boolean; edit: boolean }
  historique: { view: boolean }
  parametres: { view: boolean; edit: boolean }
  administration: { view: boolean; manage: boolean }
}

export interface AdminRole {
  id: string
  name: string
  description: string
  permissions: AdminPermissions
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  email: string
  displayName: string
  avatar?: string
  roleId: string
  createdAt: string
  updatedAt: string
}

// ── Content Versioning ──────────────────────────────────────────────
export interface ContentVersion {
  id: string
  entityId: string
  entityType: HistoryEntry['entityType']
  version: number
  data: Record<string, unknown>
  createdAt: string
  createdBy?: string
  createdByName?: string
  comment?: string
}

export interface DiffField {
  field: string
  oldValue: unknown
  newValue: unknown
  type: 'added' | 'removed' | 'changed'
}

// ── Notifications ───────────────────────────────────────────────────
export interface AdminNotification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  entityType?: HistoryEntry['entityType']
  read: boolean
  createdAt: string
  createdBy?: string
  createdByName?: string
  targetUserId: string
}

export interface DiscordWebhookConfig {
  url: string
  enabled: boolean
  events: HistoryEntry['action'][]
}

// ── SEO ─────────────────────────────────────────────────────────────
export interface SEOConfig {
  id: string
  pageSlug: string          // "home", "produits/plesk", "mentions-legales"
  pageType: 'home' | 'product' | 'legal' | 'case-study' | 'other'
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  jsonLd?: string           // JSON-LD brut valide
  lastAuditScore?: number
  lastAuditAt?: string
  createdAt: string
  updatedAt: string
}

export interface SEOAuditCheck {
  name: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  recommendation?: string
}

// ── Toast (local UI only) ────────────────────────────────────────────
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}
