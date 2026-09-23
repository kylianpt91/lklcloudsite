/**
 * Bridge module — connects the Supabase (admin) data to the public site.
 *
 * Uses an in-memory cache populated by realtime listeners (src/admin/lib/db.ts).
 * Falls back to hardcoded data files when the database is unreachable or empty.
 */
import type { ProductCategory, PricingPlan, FAQ, NavItem } from '@/types'
import type { TeamMember } from '@/data/team'
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
  SEOConfig,
} from '@/admin/lib/types'
import {
  onGammesChange,
  onOffresChange,
  onFAQChange,
  onNavGroupsChange,
  onNavItemsChange,
  onAnnoncesChange,
  onTeamChange,
  onHeroConfigChange,
  onSiteSettingsChange,
  onMaintenanceModeChange,
  onSEOConfigsChange,
} from '@/admin/lib/db'

// Fallback data (hardcoded defaults)
import { productCategories } from '@/data/products'
import { mainNavigation as defaultNavigation, productGroups as defaultProductGroups } from '@/data/navigation'
import { teamMembers as defaultTeam } from '@/data/team'
import { generalFaqs as defaultFaqs } from '@/data/faqs'

// ── In-memory cache ──────────────────────────────────────────────────

let cachedGammes: Gamme[] | null = null
let cachedOffres: Offre[] | null = null
let cachedFaq: FAQItem[] | null = null
let cachedNavGroups: NavGroup[] | null = null
let cachedNavItems: NavItemAdmin[] | null = null
let cachedAnnonces: Annonce[] | null = null
let cachedTeam: TeamMemberAdmin[] | null = null
let cachedHeroConfig: HeroConfig | null = null
let cachedSiteSettings: SiteSettings | null = null
let cachedMaintenanceMode: MaintenanceMode | null = null
let cachedSEOConfigs: SEOConfig[] | null = null

// Change listeners for React reactivity
type Listener = () => void
const listeners = new Set<Listener>()
let cachedSnapshot: BridgeSnapshot | null = null

export interface BridgeSnapshot {
  products: ProductCategory[]
  navigation: NavItem[]
  productGroups: ReturnType<typeof getProductGroups>
  team: TeamMember[]
  faqs: FAQ[]
  annonce: Annonce | null
  hero: HeroConfig
  settings: SiteSettings
  maintenance: MaintenanceMode
}

function notifyListeners() {
  cachedSnapshot = null // invalidate snapshot
  listeners.forEach(fn => fn())
}

export function subscribeToBridgeUpdates(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getBridgeSnapshot(): BridgeSnapshot {
  if (cachedSnapshot) return cachedSnapshot
  cachedSnapshot = {
    products: getProductCategories(),
    navigation: getNavigation(),
    productGroups: getProductGroups(),
    team: getTeamMembers(),
    faqs: getGeneralFaqs(),
    annonce: getActiveAnnonce(),
    hero: getHeroConfig(),
    settings: getSiteSettings(),
    maintenance: getMaintenanceMode(),
  }
  return cachedSnapshot
}


// ── Initialization ───────────────────────────────────────────────────

let initialized = false

export function initBridge(): void {
  if (initialized) return
  initialized = true

  let connected = false
  const markConnected = () => {
    if (!connected) {
      connected = true
      console.log('[Bridge] Supabase connected — real-time sync active')
    }
  }
  const onErr = (label: string) => (err: Error) => {
    console.warn(`[Bridge] ${label} listener error — using fallback data:`, err.message)
    // Force a notify so components get fallback data instead of waiting forever
    notifyListeners()
  }

  onGammesChange(data => { cachedGammes = data; markConnected(); notifyListeners() }, onErr('gammes'))
  onOffresChange(data => { cachedOffres = data; notifyListeners() }, onErr('offres'))
  onFAQChange(data => { cachedFaq = data; notifyListeners() }, onErr('faq'))
  onNavGroupsChange(data => { cachedNavGroups = data; notifyListeners() }, onErr('navGroups'))
  onNavItemsChange(data => { cachedNavItems = data; notifyListeners() }, onErr('navItems'))
  onAnnoncesChange(data => { cachedAnnonces = data; notifyListeners() }, onErr('annonces'))
  onTeamChange(data => { cachedTeam = data; notifyListeners() }, onErr('team'))
  onHeroConfigChange(data => { cachedHeroConfig = data; notifyListeners() }, onErr('heroConfig'))
  onSiteSettingsChange(data => { cachedSiteSettings = data; notifyListeners() }, onErr('siteSettings'))
  onMaintenanceModeChange(data => { cachedMaintenanceMode = data; notifyListeners() }, onErr('maintenance'))
  onSEOConfigsChange(data => { cachedSEOConfigs = data; notifyListeners() }, onErr('seo'))

  // Timeout: if the database never responds (not provisioned), force a notify
  // so components stop waiting and use hardcoded fallback data
  setTimeout(() => {
    if (!connected) {
      console.warn('[Bridge] Supabase connection timeout (10s) — using fallback data')
      notifyListeners()
    }
  }, 10_000)
}

// ── Converters ───────────────────────────────────────────────────────

function applyPromoDiscount(price: number, percent: number): number {
  return Math.round(price * (1 - percent / 100) * 100) / 100
}

function offreToPricingPlan(offre: Offre, promo?: { percent: number }): PricingPlan {
  const basePrice = offre.prix.mensuel ?? 0
  const baseQuarterly = offre.prix.trimestriel
  const baseYearly = offre.prix.annuel

  const plan: PricingPlan = {
    id: offre.id,
    name: offre.nom,
    price: basePrice,
    priceQuarterly: baseQuarterly,
    priceYearly: baseYearly,
    period: 'mois',
    features: offre.features,
    highlighted: offre.misEnAvant,
    badge: offre.badge,
    orderUrl: offre.orderUrl,
    specs: offre.specs,
  }

  if (promo && basePrice > 0) {
    plan.originalPrice = basePrice
    plan.price = applyPromoDiscount(basePrice, promo.percent)
    plan.promoPercent = promo.percent
    if (baseQuarterly != null && baseQuarterly > 0) {
      plan.originalPriceQuarterly = baseQuarterly
      plan.priceQuarterly = applyPromoDiscount(baseQuarterly, promo.percent)
    }
    if (baseYearly != null && baseYearly > 0) {
      plan.originalPriceYearly = baseYearly
      plan.priceYearly = applyPromoDiscount(baseYearly, promo.percent)
    }
  }

  return plan
}

function gammeToProductCategory(
  gamme: Gamme,
  offres: Offre[],
  faq: FAQItem[],
  activeAnnonce: Annonce | null,
): ProductCategory {
  const promo = activeAnnonce?.isPromo &&
    activeAnnonce.promoReduction &&
    activeAnnonce.promoGammeIds?.includes(gamme.id)
    ? { percent: activeAnnonce.promoReduction }
    : undefined

  return {
    slug: gamme.slug,
    name: gamme.nom,
    shortName: gamme.shortName,
    description: gamme.description,
    icon: gamme.icon,
    heroTitle: gamme.heroTitle,
    heroDescription: gamme.heroDescription,
    category: gamme.category,
    comingSoon: gamme.comingSoon,
    useCases: gamme.useCases,
    plans: offres
      .filter(o => o.gammeId === gamme.id && o.statut === 'actif')
      .sort((a, b) => a.ordre - b.ordre)
      .map(o => offreToPricingPlan(o, promo)),
    faqs: faq
      .filter(f => f.gammeId === gamme.id)
      .sort((a, b) => a.position - b.position)
      .map(f => ({ question: f.question, answer: f.reponse })),
  }
}

// ── Public API ───────────────────────────────────────────────────────

export function getProductCategories(): ProductCategory[] {
  if (!cachedGammes || !cachedOffres || !cachedFaq) return productCategories
  if (cachedGammes.length === 0) return productCategories
  const annonce = getActiveAnnonce()
  return cachedGammes
    .filter(g => g.actif)
    .sort((a, b) => a.ordre - b.ordre)
    .map(g => gammeToProductCategory(g, cachedOffres!, cachedFaq!, annonce))
}

export function getProductBySlug(slug: string): ProductCategory | undefined {
  if (!cachedGammes || !cachedOffres || !cachedFaq) {
    return productCategories.find(p => p.slug === slug)
  }
  if (cachedGammes.length === 0) {
    return productCategories.find(p => p.slug === slug)
  }
  const gamme = cachedGammes.find(g => g.slug === slug)
  if (!gamme) return undefined
  const annonce = getActiveAnnonce()
  return gammeToProductCategory(gamme, cachedOffres, cachedFaq, annonce)
}

/**
 * Find the gamme matching a nav item's product href (if any).
 */
function findGammeForNavItem(navItem: NavItemAdmin): Gamme | undefined {
  const match = navItem.href.match(/^\/produits\/(.+)$/)
  if (match && cachedGammes) {
    return cachedGammes.find(g => g.slug === match[1])
  }
  return undefined
}

/**
 * Returns true if the nav item should be hidden (gamme is inactive).
 */
function isNavItemHidden(navItem: NavItemAdmin): boolean {
  const gamme = findGammeForNavItem(navItem)
  return gamme ? !gamme.actif : false
}

/**
 * Resolve comingSoon status from the gamme (single source of truth).
 */
function resolveComingSoon(navItem: NavItemAdmin): boolean {
  const gamme = findGammeForNavItem(navItem)
  if (gamme) return gamme.comingSoon
  return navItem.comingSoon
}

export function getNavigation(): NavItem[] {
  if (!cachedNavGroups || !cachedNavItems) return defaultNavigation
  if (cachedNavGroups.length === 0) return defaultNavigation

  const items: NavItem[] = [
    { label: 'Accueil', href: '/' },
  ]

  const sortedGroups = [...cachedNavGroups].sort((a, b) => a.ordre - b.ordre)
  for (const group of sortedGroups) {
    const groupItems = cachedNavItems
      .filter(i => i.groupId === group.id && !isNavItemHidden(i))
      .sort((a, b) => a.ordre - b.ordre)
      .map(i => {
        const comingSoon = resolveComingSoon(i)
        return {
          label: i.label,
          href: comingSoon ? '/coming-soon' : i.href,
          comingSoon,
        }
      })

    if (groupItems.length === 0) continue

    items.push({
      label: group.label,
      href: '#',
      children: groupItems,
    })
  }

  const settings = getSiteSettings()
  items.push({ label: 'Contact', href: `mailto:${settings.contactEmail}` })

  return items
}

/**
 * Product groups shown in the header, the homepage "Nos solutions" section,
 * the footer and the "Découvrir nos offres" modal — one single source of
 * truth used by all four. A group's title/color/icon come from the
 * "Navigation" admin page; which gammes belong to it comes from each
 * gamme's own "Catégorie" field (set in the Gammes admin) matching the
 * group's id. A gamme only needs its category set — no separate manual
 * link to maintain per product.
 */
export function getProductGroups(): { label: string; color: string; icon: string; items: NavItem[] }[] {
  if (!cachedNavGroups || cachedNavGroups.length === 0) {
    return defaultProductGroups.map(g => ({ ...g, color: 'bg-primary', icon: 'Package' }))
  }

  const products = getProductCategories()

  return [...cachedNavGroups]
    .sort((a, b) => a.ordre - b.ordre)
    .map(group => ({
      label: group.label,
      color: group.color,
      icon: group.icon,
      items: products
        .filter(p => p.category === group.id)
        .map(p => ({
          label: p.shortName || p.name,
          href: p.comingSoon ? '/coming-soon' : `/produits/${p.slug}`,
          comingSoon: p.comingSoon,
        })),
    }))
    .filter(g => g.items.length > 0)
}

export function getTeamMembers(): TeamMember[] {
  if (!cachedTeam) return defaultTeam
  if (cachedTeam.length === 0) return defaultTeam
  return [...cachedTeam]
    .sort((a, b) => a.ordre - b.ordre)
    .map(m => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      avatar: m.avatar,
      socials: m.socials,
    }))
}

export function getGeneralFaqs(): FAQ[] {
  if (!cachedFaq) return defaultFaqs
  const globalFaqs = cachedFaq.filter(f => f.gammeId === 'global')
  if (globalFaqs.length === 0) return defaultFaqs
  return globalFaqs
    .sort((a, b) => a.position - b.position)
    .map(f => ({ question: f.question, answer: f.reponse }))
}

export function getActiveAnnonce(): Annonce | null {
  if (!cachedAnnonces) return null
  const now = new Date()
  return cachedAnnonces.find(a => {
    if (!a.actif) return false
    if (a.dateDebut && new Date(a.dateDebut) > now) return false
    if (a.dateFin && new Date(a.dateFin) < now) return false
    return true
  }) ?? null
}

const DEFAULT_HERO: HeroConfig = {
  titleLine1: 'Votre nouvel hébergeur',
  titleLine2: 'Haute Performance',
  typedWords: ['Haute Performance'],
  subtitle: "Des solutions d'hébergement adaptées à vos besoins, des performances optimales à des prix compétitifs.",
  ctaPrimaryText: 'Découvrir nos offres',
  ctaSecondaryText: 'En savoir plus',
}

export function getHeroConfig(): HeroConfig {
  return cachedHeroConfig ?? DEFAULT_HERO
}

const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: 'support@lklcloud.fr',
  socialInstagram: 'https://instagram.com/lklcloud',
  socialDiscord: 'https://discord.gg/lklcloud',
  socialLinkedin: 'https://linkedin.com/company/lklcloud',
  whmcsBaseUrl: 'https://clients.lklcloud.fr',
  companyTagline: 'Hébergeur français premium. Performance, fiabilité et support expert pour tous vos projets.',
}

export function getSiteSettings(): SiteSettings {
  return cachedSiteSettings ?? DEFAULT_SETTINGS
}

const DEFAULT_MAINTENANCE: MaintenanceMode = {
  enabled: false,
  message: 'Le site est actuellement en maintenance. Nous serons de retour très bientôt.',
}

export function getMaintenanceMode(): MaintenanceMode {
  return cachedMaintenanceMode ?? DEFAULT_MAINTENANCE
}

export function getSEOConfig(pageSlug: string): SEOConfig | null {
  if (!cachedSEOConfigs) return null
  return cachedSEOConfigs.find(c => c.pageSlug === pageSlug) ?? null
}

// ── Direct cache access (for admin context) ──────────────────────────

export function getCachedGammes(): Gamme[] | null { return cachedGammes }
export function getCachedOffres(): Offre[] | null { return cachedOffres }
export function getCachedFaq(): FAQItem[] | null { return cachedFaq }
export function getCachedNavGroups(): NavGroup[] | null { return cachedNavGroups }
export function getCachedNavItems(): NavItemAdmin[] | null { return cachedNavItems }
export function getCachedAnnonces(): Annonce[] | null { return cachedAnnonces }
export function getCachedTeam(): TeamMemberAdmin[] | null { return cachedTeam }
