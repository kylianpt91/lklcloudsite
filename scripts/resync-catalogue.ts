/**
 * Re-syncs the Supabase catalogue with src/data/* after the cloud-only pivot.
 * Removes the retired game gammes, refreshes gamme metadata, and rebuilds the
 * navigation from src/data/navigation.ts.
 *
 *   SEED_EMAIL=… SEED_PASSWORD=… node --experimental-strip-types scripts/resync-catalogue.ts
 */
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { productCategories } from '../src/data/products.ts'
import { mainNavigation } from '../src/data/navigation.ts'

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const now = () => new Date().toISOString()
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

const { error: authErr } = await sb.auth.signInWithPassword({ email: process.env.SEED_EMAIL!, password: process.env.SEED_PASSWORD! })
if (authErr) { console.error(authErr.message); process.exit(1) }

const keepSlugs = productCategories.map((c) => c.slug)

// 1. Remove retired gammes (and their offres / faq)
const { data: existing } = await sb.from('gammes').select('id,slug')
const retired = (existing ?? []).filter((g) => !keepSlugs.includes(g.slug))
for (const g of retired) {
  await sb.from('offres').delete().eq('gammeId', g.id)
  await sb.from('faq').delete().eq('gammeId', g.id)
  await sb.from('gammes').delete().eq('id', g.id)
  console.log('retired', g.slug)
}

// 2. Upsert current gammes (id = slug) with fresh metadata
const ts = now()
for (const [i, c] of productCategories.entries()) {
  const row = {
    id: c.slug, nom: c.name, shortName: c.shortName, slug: c.slug, description: c.description,
    icon: c.icon, category: c.category, heroTitle: c.heroTitle, heroDescription: c.heroDescription, useCases: c.useCases,
    comingSoon: c.comingSoon ?? false, actif: true, ordre: i, updatedAt: ts,
  }
  const { error } = await sb.from('gammes').upsert({ ...row, createdAt: ts }, { onConflict: 'id' })
  if (error) { console.error('gamme', c.slug, error.message); continue }

  // refresh offres for this gamme
  await sb.from('offres').delete().eq('gammeId', c.slug)
  if (c.plans.length) {
    const offres = c.plans.map((p, pi) => ({
      gammeId: c.slug, nom: p.name, slug: slugify(p.name), tagline: '', description: '',
      features: p.features,
      prix: {
        mensuel: p.price, trimestriel: p.priceQuarterly, annuel: p.priceYearly,
        afficherMensuel: true, afficherTrimestriel: p.priceQuarterly != null, afficherAnnuel: p.priceYearly != null,
      },
      specs: p.specs, badge: p.badge, orderUrl: p.orderUrl, statut: 'actif',
      misEnAvant: p.highlighted ?? false, ordre: pi, createdAt: ts, updatedAt: ts,
    }))
    const { error: oErr } = await sb.from('offres').insert(offres)
    if (oErr) console.error('offres', c.slug, oErr.message)
  }

  // refresh product FAQ
  await sb.from('faq').delete().eq('gammeId', c.slug)
  if (c.faqs.length) {
    const faq = c.faqs.map((f, fi) => ({ gammeId: c.slug, question: f.question, reponse: f.answer, position: fi, createdAt: ts, updatedAt: ts }))
    const { error: fErr } = await sb.from('faq').insert(faq)
    if (fErr) console.error('faq', c.slug, fErr.message)
  }
  console.log('synced', c.slug, `(${c.plans.length} offres)`)
}

// 3. Rebuild navigation from src/data/navigation.ts
await sb.from('navItems').delete().neq('id', '__none__')
await sb.from('navGroups').delete().neq('id', '__none__')
const groupMeta: Record<string, { color: string; icon: string }> = {
  Cloud: { color: 'bg-primary', icon: 'Cloud' },
  'Bots Discord': { color: 'bg-indigo-500', icon: 'Bot' },
  Domaines: { color: 'bg-emerald-500', icon: 'Link' },
}
let g = 0
for (const item of mainNavigation) {
  if (!item.children) continue
  const id = slugify(item.label)
  const meta = groupMeta[item.label] ?? { color: 'bg-primary', icon: 'Package' }
  await sb.from('navGroups').insert({ id, label: item.label, color: meta.color, icon: meta.icon, ordre: g++, createdAt: ts, updatedAt: ts })
  const items = item.children.map((ch, ci) => ({
    label: ch.label,
    href: ch.href,
    groupId: id, ordre: ci, comingSoon: ch.comingSoon ?? false, createdAt: ts, updatedAt: ts,
  }))
  await sb.from('navItems').insert(items)
  console.log('nav group', item.label, `(${items.length})`)
}

console.log('\n✅ Catalogue re-synchronisé (cloud-only).')
