import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

interface PrefetchLinkProps extends Omit<LinkProps, 'prefetch'> {
  prefetch?: boolean
}

/**
 * Map of route paths to their lazy import functions.
 * Used to preload route chunks on hover for faster navigation.
 */
const routeImportMap: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/pages/Home'),
  '/produits/plesk': () => import('@/pages/products/ProductCategory'),
  '/produits/vps-linux': () => import('@/pages/products/ProductCategory'),
  '/produits/vps-windows': () => import('@/pages/products/ProductCategory'),
  '/produits/vps-game': () => import('@/pages/products/ProductCategory'),
  '/produits/python': () => import('@/pages/products/ProductCategory'),
  '/produits/nodejs': () => import('@/pages/products/ProductCategory'),
  '/produits/fivem': () => import('@/pages/products/ProductCategory'),
  '/produits/minecraft': () => import('@/pages/products/ProductCategory'),
  '/produits/garrysmod': () => import('@/pages/products/ProductCategory'),
  '/produits/ark': () => import('@/pages/products/ProductCategory'),
  '/produits/rust': () => import('@/pages/products/ProductCategory'),
  '/produits/hytale': () => import('@/pages/products/ProductCategory'),
  '/mentions-legales': () => import('@/pages/legal/MentionsLegales'),
  '/cgv': () => import('@/pages/legal/CGV'),
  '/cgu': () => import('@/pages/legal/CGU'),
  '/politique-confidentialite': () =>
    import('@/pages/legal/PolitiqueConfidentialite'),
}

function findImportFn(to: string): (() => Promise<unknown>) | undefined {
  // Direct match first
  if (routeImportMap[to]) return routeImportMap[to]

  // Try matching product routes (dynamic :category param)
  if (to.startsWith('/produits/')) {
    return routeImportMap['/produits/plesk']
  }

  return undefined
}

export default function PrefetchLink({
  prefetch = true,
  onMouseEnter,
  to,
  ...props
}: PrefetchLinkProps) {
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefetch) {
        const path = typeof to === 'string' ? to : to.pathname ?? ''
        const importFn = findImportFn(path)
        if (importFn) {
          importFn().catch(() => {
            // Silently ignore prefetch failures
          })
        }
      }
      onMouseEnter?.(e)
    },
    [prefetch, to, onMouseEnter],
  )

  return <Link to={to} onMouseEnter={handleMouseEnter} {...props} />
}
