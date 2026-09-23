/**
 * Read-only Supabase state check (authenticated).
 *   SEED_EMAIL=… SEED_PASSWORD=… node --experimental-strip-types scripts/check-supabase.ts
 */
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const { error } = await sb.auth.signInWithPassword({ email: process.env.SEED_EMAIL!, password: process.env.SEED_PASSWORD! })
if (error) { console.error(error.message); process.exit(1) }

for (const t of ['gammes', 'offres', 'faq', 'navGroups', 'navItems', 'team', 'config', 'adminRoles', 'adminUsers', 'annonces', 'seo', 'history']) {
  const { count } = await sb.from(t).select('*', { count: 'exact', head: true })
  console.log(t.padEnd(12), count)
}
const g = await sb.from('gammes').select('slug,nom,actif,comingSoon,ordre').order('ordre')
console.log('\ngammes:')
g.data?.forEach((r) => console.log('  ', String(r.slug).padEnd(14), r.actif ? 'actif  ' : 'inactif', r.comingSoon ? 'soon' : '    ', r.nom))
const u = await sb.from('adminUsers').select('email,displayName,roleId')
const roles = await sb.from('adminRoles').select('id,name')
console.log('\nroles     :', roles.data?.map((r) => r.name).join(', '))
console.log('adminUsers:', u.data?.map((x) => `${x.displayName} <${x.email}> role=${roles.data?.find((r) => r.id === x.roleId)?.name ?? x.roleId}`).join(' | '))
const a = await sb.from('annonces').select('id,message,actif')
console.log('annonces  :', JSON.stringify(a.data))
