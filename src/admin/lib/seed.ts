import {
  seedFirestore,
  isFirestoreSeeded,
  checkFirestoreConnection,
  fetchRolesFS,
  addRoleFS,
} from './db'
import { productCategories } from '@/data/products'
import { mainNavigation } from '@/data/navigation'
import { teamMembers } from '@/data/team'
import { generalFaqs } from '@/data/faqs'
import type {
  Gamme,
  Offre,
  FAQItem,
  NavGroup,
  NavItemAdmin,
  TeamMemberAdmin,
  HeroConfig,
  SiteSettings,
  MaintenanceMode,
  AdminPermissions,
} from './types'

/**
 * Map from navigation comingSoon labels to their real product hrefs.
 * The bridge converts comingSoon items to `/coming-soon` at read time,
 * so Firestore stores the real product URL.
 */
const comingSoonHrefMap: Record<string, string> = {
  'Serveur Minecraft Java': '/produits/minecraft',
  "Serveur Garry's Mod": '/produits/garrysmod',
  'Serveur ARK': '/produits/ark',
  'Serveur Rust': '/produits/rust',
  'Serveur Hytale': '/produits/hytale',
  'VPS Windows': '/produits/vps-windows',
  'VPS Game': '/produits/vps-game',
}

/**
 * Seed all hardcoded data into Firestore.
 * Returns `true` if data was seeded, `false` if already seeded.
 * Throws with a descriptive message if Firestore is unreachable.
 */
export async function seedAllData(): Promise<boolean> {
  // 1. Check Firestore connectivity first (with timeout)
  const reachable = await checkFirestoreConnection(10_000)
  if (!reachable) {
    throw new Error(
      'Impossible de se connecter à la base Supabase. ' +
      'Vérifiez que le fichier .env contient VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY, ' +
      'et que le schéma SQL (supabase/migrations) a bien été exécuté.'
    )
  }

  const seeded = await isFirestoreSeeded()
  if (seeded) return false

  const now = new Date().toISOString()

  // ── Convert productCategories → Gammes + Offres + FAQ ───────────────

  const gammes: Omit<Gamme, 'id'>[] = productCategories.map((cat, index) => ({
    nom: cat.name,
    shortName: cat.shortName,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    category: cat.category,
    heroTitle: cat.heroTitle,
    heroDescription: cat.heroDescription,
    useCases: cat.useCases,
    comingSoon: cat.comingSoon ?? false,
    actif: true,
    ordre: index,
    createdAt: now,
    updatedAt: now,
  }))

  const offres: Omit<Offre, 'id'>[] = []
  const faqItems: Omit<FAQItem, 'id'>[] = []

  for (const cat of productCategories) {
    // Convert plans → Offres
    for (const [planIndex, plan] of cat.plans.entries()) {
      offres.push({
        gammeId: cat.slug, // seedFirestore uses slug as gamme document ID
        nom: plan.name,
        slug: plan.name.toLowerCase().replace(/\s+/g, '-'),
        tagline: '',
        description: '',
        features: plan.features,
        prix: {
          mensuel: plan.price,
          trimestriel: plan.priceQuarterly,
          annuel: plan.priceYearly,
          afficherMensuel: true,
          afficherTrimestriel: plan.priceQuarterly !== undefined,
          afficherAnnuel: plan.priceYearly !== undefined,
        },
        specs: plan.specs,
        badge: plan.badge,
        orderUrl: plan.orderUrl,
        statut: 'actif',
        misEnAvant: plan.highlighted ?? false,
        ordre: planIndex,
        createdAt: now,
        updatedAt: now,
      })
    }

    // Convert product-specific FAQs
    for (const [faqIndex, faq] of cat.faqs.entries()) {
      faqItems.push({
        gammeId: cat.slug,
        question: faq.question,
        reponse: faq.answer,
        position: faqIndex,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  // Convert global FAQs
  for (const [index, faq] of generalFaqs.entries()) {
    faqItems.push({
      gammeId: 'global',
      question: faq.question,
      reponse: faq.answer,
      position: index,
      createdAt: now,
      updatedAt: now,
    })
  }

  // ── Convert navigation → NavGroups + NavItems ───────────────────────

  // Group metadata matching current hardcoded header colors and icons
  const groupMeta: Record<string, { color: string; icon: string }> = {
    'Game Hosting': { color: 'bg-primary', icon: 'Gamepad2' },
    'Cloud Hosting': { color: 'bg-emerald-500', icon: 'Cloud' },
    'App Hosting': { color: 'bg-blue-500', icon: 'Globe' },
  }

  const navGroups: Omit<NavGroup, 'id'>[] = []
  const navItems: Omit<NavItemAdmin, 'id'>[] = []

  let groupOrder = 0
  for (const navItem of mainNavigation) {
    if (navItem.children) {
      const groupId = navItem.label.toLowerCase().replace(/\s+/g, '-')
      const meta = groupMeta[navItem.label] || { color: 'bg-primary', icon: 'Package' }

      navGroups.push({
        label: navItem.label,
        color: meta.color,
        icon: meta.icon,
        ordre: groupOrder++,
        createdAt: now,
        updatedAt: now,
      })

      for (const [childIndex, child] of navItem.children.entries()) {
        // For comingSoon items, store the real product URL (not /coming-soon).
        // The bridge applies `/coming-soon` redirect at read time based on the flag.
        const href = child.comingSoon
          ? (comingSoonHrefMap[child.label] ?? child.href)
          : child.href

        navItems.push({
          label: child.label,
          href,
          groupId,
          ordre: childIndex,
          comingSoon: child.comingSoon ?? false,
          createdAt: now,
          updatedAt: now,
        })
      }
    }
  }

  // ── Convert team members ────────────────────────────────────────────

  const team: Omit<TeamMemberAdmin, 'id'>[] = teamMembers.map((m, index) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    avatar: m.avatar,
    socials: m.socials || {},
    ordre: index,
    createdAt: now,
    updatedAt: now,
  }))

  // ── Hero config (current hardcoded defaults) ────────────────────────

  const heroConfig: HeroConfig = {
    titleLine1: 'Votre nouvel hébergeur',
    titleLine2: 'Haute Performance',
    typedWords: ['Haute Performance'],
    subtitle: "Des solutions d'hébergement adaptées à vos besoins, des performances optimales à des prix compétitifs.",
    ctaPrimaryText: 'Découvrir nos offres',
    ctaSecondaryText: 'En savoir plus',
  }

  // ── Site settings (current hardcoded defaults) ──────────────────────

  const siteSettings: SiteSettings = {
    contactEmail: 'support@lklcloud.fr',
    socialInstagram: 'https://instagram.com/lklcloud',
    socialDiscord: 'https://discord.gg/lklcloud',
    socialLinkedin: 'https://linkedin.com/company/lklcloud',
    whmcsBaseUrl: 'https://clients.lklcloud.fr',
    companyTagline: 'Hébergeur français premium. Performance, fiabilité et support expert pour tous vos projets.',
  }

  // ── Maintenance mode (disabled by default) ──────────────────────────

  const maintenance: MaintenanceMode = {
    enabled: false,
    message: 'Le site est actuellement en maintenance. Nous serons de retour très bientôt.',
  }

  // ── Execute seed ────────────────────────────────────────────────────

  await seedFirestore({
    gammes,
    offres,
    faq: faqItems,
    navGroups,
    navItems,
    team,
    heroConfig,
    siteSettings,
    maintenance,
  })

  return true
}

// ── Default admin roles seed ────────────────────────────────────────

function allPerms(): AdminPermissions {
  return {
    dashboard: { view: true },
    gammes: { view: true, create: true, edit: true, delete: true },
    offres: { view: true, create: true, edit: true, delete: true },
    faq: { view: true, create: true, edit: true, delete: true },
    navigation: { view: true, create: true, edit: true, delete: true },
    annonces: { view: true, create: true, edit: true, delete: true },
    equipe: { view: true, create: true, edit: true, delete: true },
    hero: { view: true, edit: true },
    maintenance: { view: true, edit: true },
    historique: { view: true },
    parametres: { view: true, edit: true },
    administration: { view: true, manage: true },
  }
}

function editorPerms(): AdminPermissions {
  return {
    dashboard: { view: true },
    gammes: { view: true, create: true, edit: true, delete: false },
    offres: { view: true, create: true, edit: true, delete: false },
    faq: { view: true, create: true, edit: true, delete: false },
    navigation: { view: true, create: true, edit: true, delete: false },
    annonces: { view: true, create: true, edit: true, delete: false },
    equipe: { view: true, create: true, edit: true, delete: false },
    hero: { view: true, edit: true },
    maintenance: { view: true, edit: false },
    historique: { view: true },
    parametres: { view: true, edit: false },
    administration: { view: false, manage: false },
  }
}

function readerPerms(): AdminPermissions {
  return {
    dashboard: { view: true },
    gammes: { view: true, create: false, edit: false, delete: false },
    offres: { view: true, create: false, edit: false, delete: false },
    faq: { view: true, create: false, edit: false, delete: false },
    navigation: { view: true, create: false, edit: false, delete: false },
    annonces: { view: true, create: false, edit: false, delete: false },
    equipe: { view: true, create: false, edit: false, delete: false },
    hero: { view: true, edit: false },
    maintenance: { view: true, edit: false },
    historique: { view: true },
    parametres: { view: true, edit: false },
    administration: { view: false, manage: false },
  }
}

/**
 * Seed 3 default admin roles: Super Admin, Éditeur, Lecteur.
 * Throws if roles already exist.
 */
export async function seedDefaultRoles(): Promise<number> {
  const existing = await fetchRolesFS()
  if (existing.length > 0) {
    throw new Error('Des rôles existent déjà. Supprimez-les avant de réinitialiser.')
  }

  const now = new Date().toISOString()
  const roles = [
    { name: 'Super Admin', description: 'Accès complet à toutes les fonctionnalités', permissions: allPerms() },
    { name: 'Éditeur', description: 'Peut créer et modifier, mais pas supprimer ni gérer les utilisateurs', permissions: editorPerms() },
    { name: 'Lecteur', description: 'Accès en lecture seule à toutes les données', permissions: readerPerms() },
  ]

  for (const role of roles) {
    await addRoleFS({ ...role, createdAt: now, updatedAt: now })
  }
  return roles.length
}
