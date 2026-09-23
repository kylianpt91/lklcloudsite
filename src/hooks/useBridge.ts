import { useSyncExternalStore } from 'react'
import {
  subscribeToBridgeUpdates,
  getBridgeSnapshot,
} from '@/lib/bridge'
import type { BridgeSnapshot } from '@/lib/bridge'
import type { ProductCategory, NavItem, FAQ } from '@/types'
import type { TeamMember } from '@/data/team'
import type { Annonce, HeroConfig, SiteSettings, MaintenanceMode } from '@/admin/lib/types'

// ── Generic selector hook ────────────────────────────────────────────

function useBridgeSelector<T>(selector: (snap: BridgeSnapshot) => T): T {
  return useSyncExternalStore(
    subscribeToBridgeUpdates,
    () => selector(getBridgeSnapshot()),
  )
}

// ── Granular hooks — each returns only the data the component needs ──

export function useBridgeProducts(): ProductCategory[] {
  return useBridgeSelector(s => s.products)
}

export function useBridgeNavigation(): NavItem[] {
  return useBridgeSelector(s => s.navigation)
}

export function useBridgeProductGroups(): BridgeSnapshot['productGroups'] {
  return useBridgeSelector(s => s.productGroups)
}

export function useBridgeTeam(): TeamMember[] {
  return useBridgeSelector(s => s.team)
}

export function useBridgeFaqs(): FAQ[] {
  return useBridgeSelector(s => s.faqs)
}

export function useBridgeAnnonce(): Annonce | null {
  return useBridgeSelector(s => s.annonce)
}

export function useBridgeHero(): HeroConfig {
  return useBridgeSelector(s => s.hero)
}

export function useBridgeSettings(): SiteSettings {
  return useBridgeSelector(s => s.settings)
}

export function useBridgeMaintenance(): MaintenanceMode {
  return useBridgeSelector(s => s.maintenance)
}

export function useBridgeProductBySlug(slug: string): ProductCategory | undefined {
  return useBridgeSelector(s => s.products.find(p => p.slug === slug))
}
