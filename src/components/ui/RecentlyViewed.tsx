import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface RecentProduct {
  slug: string
  name: string
  shortName: string
}

interface RecentlyViewedProps {
  className?: string
}

const STORAGE_KEY = 'lkl_recently_viewed'
const MAX_ITEMS = 6

function getStoredProducts(): RecentProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, MAX_ITEMS) as RecentProduct[]
  } catch {
    return []
  }
}

/**
 * Call this function when a user visits a product page
 * to track it as recently viewed.
 */
export function trackProductView(product: RecentProduct) {
  if (typeof window === 'undefined') return

  try {
    const current = getStoredProducts()
    const filtered = current.filter((p) => p.slug !== product.slug)
    const updated = [product, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
}

export default function RecentlyViewed({ className = '' }: RecentlyViewedProps) {
  const [products, setProducts] = useState<RecentProduct[]>([])

  useEffect(() => {
    setProducts(getStoredProducts())
  }, [])

  if (products.length === 0) return null

  return (
    <section className={className} aria-label="Produits consultés récemment">
      <h3 className="text-sm font-bold text-neutral-dark mb-3">
        Consult&eacute;s r&eacute;cemment
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {products.map((product) => (
          <Link
            key={product.slug}
            to={`/produits/${product.slug}`}
            className="shrink-0 glass rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-dark hover:text-primary hover:border-primary/30 transition-colors duration-200 whitespace-nowrap"
          >
            {product.shortName || product.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
