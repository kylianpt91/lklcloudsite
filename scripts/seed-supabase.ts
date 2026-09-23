/**
 * One-shot Supabase seeder — mirrors src/admin/lib/seed.ts but runnable from
 * the CLI. Signs in with an existing admin account (RLS requires an
 * authenticated session for writes), then populates roles + content + the
 * caller's admin profile.
 *
 * Usage:
 *   SEED_EMAIL=you@example.com SEED_PASSWORD='...' \
 *     node --experimental-strip-types scripts/seed-supabase.ts
 */
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { productCategories } from '../src/data/products.ts'
import { mainNavigation } from '../src/data/navigation.ts'
import { teamMembers } from '../src/data/team.ts'
import { generalFaqs } from '../src/data/faqs.ts'

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)

const EMAIL = process.env.SEED_EMAIL
const PASSWORD = process.env.SEED_PASSWORD
if (!EMAIL || !PASSWORD) { console.error('Set SEED_EMAIL and SEED_PASSWORD'); process.exit(1) }

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

const now = () => new Date().toISOString()
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

async function ins(table: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const { error } = await sb.from(table).insert(rows)
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`  ${table.padEnd(11)} +${rows.length}`)
}

// ── auth ────────────────────────────────────────────────────────────
const { data: session, error: authErr } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASSWORD })
if (authErr) { console.error('Sign-in failed:', authErr.message); process.exit(1) }
console.log('Signed in as', session.user.email)


// ── roles ───────────────────────────────────────────────────────────
const full = { view: true, create: true, edit: true, delete: true }
const ro = { view: true, create: false, edit: false, delete: false }
const noAdmin = { view: false, manage: false }
const superPerms = {
  dashboard: { view: true }, gammes: full, offres: full, faq: full, navigation: full,
  annonces: full, equipe: full, hero: { view: true, edit: true }, maintenance: { view: true, edit: true },
  historique: { view: true }, parametres: { view: true, edit: true }, administration: { view: true, manage: true },
}
const editorPerms = {
  dashboard: { view: true },
  gammes: { ...full, delete: false }, offres: { ...full, delete: false }, faq: { ...full, delete: false },
  navigation: { ...full, delete: false }, annonces: { ...full, delete: false }, equipe: { ...full, delete: false },
  hero: { view: true, edit: true }, maintenance: { view: true, edit: false }, historique: { view: true },
  parametres: { view: true, edit: false }, administration: noAdmin,
}
const readerPerms = {
  dashboard: { view: true }, gammes: ro, offres: ro, faq: ro, navigation: ro, annonces: ro, equipe: ro,
  hero: { view: true, edit: false }, maintenance: { view: true, edit: false }, historique: { view: true },
  parametres: { view: true, edit: false }, administration: noAdmin,
}

const { data: existingRoles } = await sb.from('adminRoles').select('id,name')
const wantRoles = [
  { name: 'Super Admin', description: 'Accès complet à toutes les fonctionnalités', permissions: superPerms },
  { name: 'Éditeur', description: 'Peut créer et modifier, mais pas supprimer ni gérer les utilisateurs', permissions: editorPerms },
  { name: 'Lecteur', description: 'Accès en lecture seule à toutes les données', permissions: readerPerms },
]
const missingRoles = wantRoles.filter((w) => !existingRoles?.some((e) => e.name === w.name))
if (missingRoles.length) {
  const ts = now()
  const { error } = await sb.from('adminRoles').insert(missingRoles.map((r) => ({ ...r, createdAt: ts, updatedAt: ts })))
  if (error) throw new Error(`adminRoles: ${error.message}`)
  console.log(`  adminRoles  +${missingRoles.length}`)
} else {
  console.log('  adminRoles  already complete')
}
const { data: rolesNow } = await sb.from('adminRoles').select('id,name')
const superRoleId = rolesNow?.find((r) => r.name === 'Super Admin')?.id as string | undefined

// ── content (skip if the real catalogue is already loaded) ──────────
const { count: gammeCount } = await sb.from('gammes').select('*', { count: 'exact', head: true })
if ((gammeCount ?? 0) >= productCategories.length) {
  console.log(`  content already seeded (${gammeCount} gammes), skipping`)
} else {
  const ts = now()

  await ins('gammes', productCategories.map((c, i) => ({
    id: c.slug, nom: c.name, shortName: c.shortName, slug: c.slug, description: c.description,
    icon: c.icon, category: c.category, heroTitle: c.heroTitle, heroDescription: c.heroDescription, useCases: c.useCases,
    comingSoon: c.comingSoon ?? false, actif: true, ordre: i, createdAt: ts, updatedAt: ts,
  })))

  const offres: Record<string, unknown>[] = []
  const faq: Record<string, unknown>[] = []
  for (const c of productCategories) {
    c.plans.forEach((p, pi) => offres.push({
      gammeId: c.slug, nom: p.name, slug: slugify(p.name), tagline: '', description: '',
      features: p.features,
      prix: {
        mensuel: p.price, trimestriel: p.priceQuarterly, annuel: p.priceYearly,
        afficherMensuel: true, afficherTrimestriel: p.priceQuarterly !== undefined, afficherAnnuel: p.priceYearly !== undefined,
      },
      specs: p.specs, badge: p.badge, orderUrl: p.orderUrl, statut: 'actif',
      misEnAvant: p.highlighted ?? false, ordre: pi, createdAt: ts, updatedAt: ts,
    }))
    c.faqs.forEach((f, fi) => faq.push({ gammeId: c.slug, question: f.question, reponse: f.answer, position: fi, createdAt: ts, updatedAt: ts }))
  }
  generalFaqs.forEach((f, i) => faq.push({ gammeId: 'global', question: f.question, reponse: f.answer, position: i, createdAt: ts, updatedAt: ts }))
  await ins('offres', offres)
  await ins('faq', faq)

  const comingSoonHref: Record<string, string> = {
    'Serveur Minecraft Java': '/produits/minecraft', "Serveur Garry's Mod": '/produits/garrysmod',
    'Serveur ARK': '/produits/ark', 'Serveur Rust': '/produits/rust', 'Serveur Hytale': '/produits/hytale',
    'VPS Windows': '/produits/vps-windows', 'VPS Game': '/produits/vps-game',
  }
  const groupMeta: Record<string, { color: string; icon: string }> = {
    'Game Hosting': { color: 'bg-primary', icon: 'Gamepad2' },
    'Cloud Hosting': { color: 'bg-emerald-500', icon: 'Cloud' },
    'App Hosting': { color: 'bg-blue-500', icon: 'Globe' },
  }
  const navGroups: Record<string, unknown>[] = []
  const navItems: Record<string, unknown>[] = []
  let g = 0
  for (const item of mainNavigation) {
    if (!item.children) continue
    const groupId = slugify(item.label)
    const meta = groupMeta[item.label] ?? { color: 'bg-primary', icon: 'Package' }
    navGroups.push({ id: groupId, label: item.label, color: meta.color, icon: meta.icon, ordre: g++, createdAt: ts, updatedAt: ts })
    item.children.forEach((ch, ci) => navItems.push({
      label: ch.label,
      href: ch.comingSoon ? (comingSoonHref[ch.label] ?? ch.href) : ch.href,
      groupId, ordre: ci, comingSoon: ch.comingSoon ?? false, createdAt: ts, updatedAt: ts,
    }))
  }
  await ins('navGroups', navGroups)
  await ins('navItems', navItems)

  await ins('team', teamMembers.map((m, i) => ({
    name: m.name, role: m.role, bio: m.bio, avatar: m.avatar, socials: m.socials ?? {}, ordre: i, createdAt: ts, updatedAt: ts,
  })))

  const { error: cfgErr } = await sb.from('config').upsert([
    { key: 'hero', value: {
      badgeText: 'Bienvenue chez LKLCloud', titleLine1: 'Votre nouvel hébergeur', titleLine2: 'Haute Performance',
      typedWords: ['Haute Performance'],
      subtitle: "Des solutions d'hébergement adaptées à vos besoins, des performances optimales à des prix compétitifs.",
      ctaPrimaryText: 'Découvrir nos offres', ctaSecondaryText: 'En savoir plus',
    } },
    { key: 'settings', value: {
      contactEmail: 'support@lklcloud.fr', socialInstagram: 'https://instagram.com/lklcloud',
      socialDiscord: 'https://discord.gg/lklcloud', socialLinkedin: 'https://linkedin.com/company/lklcloud',
      whmcsBaseUrl: 'https://client.lklcloud.fr',
      companyTagline: 'Hébergeur français premium. Performance, fiabilité et support expert pour tous vos projets.',
      footerText: 'LKL Cloud — Hébergeur français nouvelle génération.',
    } },
    { key: 'maintenance', value: { enabled: false, message: 'Le site est actuellement en maintenance. Nous serons de retour très bientôt.' } },
  ], { onConflict: 'key' })
  if (cfgErr) throw new Error(`config: ${cfgErr.message}`)
  console.log('  config      +3')
}

// ── caller's admin profile ─────────────────────────────────────────
const { data: me } = await sb.from('adminUsers').select('id').eq('email', EMAIL).maybeSingle()
if (!me) {
  const ts = now()
  const { error } = await sb.from('adminUsers').insert({
    email: EMAIL, displayName: 'Kylian', roleId: superRoleId ?? '', createdAt: ts, updatedAt: ts,
  })
  if (error) throw new Error(`adminUsers: ${error.message}`)
  console.log('  adminUsers  +1 (Super Admin)')
} else if (superRoleId) {
  await sb.from('adminUsers').update({ roleId: superRoleId }).eq('email', EMAIL)
  console.log('  adminUsers  profile exists — Super Admin role reassigned')
}

console.log('\n✅ Seed terminé.')
