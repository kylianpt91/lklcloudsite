import { createClient } from '@supabase/supabase-js'

const env = import.meta.env

/**
 * Real config comes from `.env` (VITE_SUPABASE_*). See `.env.example`.
 *
 * When those vars are missing (fresh clone, no `.env` yet) the app still
 * boots: the public marketing site runs entirely on the hardcoded fallback
 * data in `src/data/*` via `src/lib/bridge.ts`. The admin panel and live
 * content sync stay disabled until a `.env` file is added.
 */
export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY,
)

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] No VITE_SUPABASE_* env vars found — running in offline mode. ' +
      'The public site uses fallback data; the admin panel and live content ' +
      'sync are disabled until you add a .env file (see .env.example).',
  )
}

const SUPABASE_URL = env.VITE_SUPABASE_URL ?? 'https://offline.supabase.co'
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? 'offline-placeholder-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'lkl-admin-auth',
  },
})

/**
 * A short-lived client that never touches the stored admin session — used
 * for operations that would otherwise clobber it (creating another user,
 * verifying a password). Returns `null` in offline mode.
 */
export function createEphemeralClient(storageKey: string) {
  if (!isSupabaseConfigured) return null
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, storageKey },
  })
}
