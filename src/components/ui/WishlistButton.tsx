import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface WishlistButtonProps {
  productSlug: string
  productName: string
  className?: string
}

const STORAGE_KEY = 'lkl_wishlist'

interface WishlistItem {
  slug: string
  name: string
}

function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as WishlistItem[]
  } catch {
    return []
  }
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage unavailable
  }
}

export default function WishlistButton({
  productSlug,
  productName,
  className = '',
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    const list = getWishlist()
    setInWishlist(list.some((item) => item.slug === productSlug))
  }, [productSlug])

  const toggle = useCallback(() => {
    const list = getWishlist()
    const exists = list.some((item) => item.slug === productSlug)

    if (exists) {
      const updated = list.filter((item) => item.slug !== productSlug)
      saveWishlist(updated)
      setInWishlist(false)
    } else {
      const updated = [...list, { slug: productSlug, name: productName }]
      saveWishlist(updated)
      setInWishlist(true)
    }
  }, [productSlug, productName])

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      className={`p-2 rounded-full hover:bg-primary/5 transition-colors duration-200 cursor-pointer ${className}`}
      aria-label={inWishlist ? `Retirer ${productName} des favoris` : `Ajouter ${productName} aux favoris`}
      aria-pressed={inWishlist}
    >
      <motion.div
        animate={inWishlist ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-200 ${
            inWishlist ? 'fill-primary text-primary' : 'text-neutral-medium'
          }`}
          aria-hidden="true"
        />
      </motion.div>
    </motion.button>
  )
}
