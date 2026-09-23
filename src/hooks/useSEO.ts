import { useSyncExternalStore } from 'react'
import { subscribeToBridgeUpdates, getSEOConfig } from '@/lib/bridge'
import type { SEOConfig } from '@/admin/lib/types'

export function useSEO(pageSlug: string): SEOConfig | null {
  return useSyncExternalStore(
    subscribeToBridgeUpdates,
    () => getSEOConfig(pageSlug),
  )
}
