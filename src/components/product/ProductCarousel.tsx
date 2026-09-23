import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { ProductCategory } from '@/types/index.ts'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

interface ProductCarouselProps {
  products: ProductCategory[]
  className?: string
  autoScroll?: boolean
}

export default function ProductCarousel({ products, className = '', autoScroll = false }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }, [])

  const scrollTo = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    updateScrollButtons()
    return () => el.removeEventListener('scroll', updateScrollButtons)
  }, [updateScrollButtons])

  useEffect(() => {
    if (autoScroll && products.length > 1) {
      intervalRef.current = setInterval(() => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft >= scrollWidth - clientWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollTo('right')
        }
      }, 4000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoScroll, products.length, scrollTo])

  const getStartingPrice = (product: ProductCategory): number => {
    return Math.min(...product.plans.map((p) => p.price))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Navigation arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-neutral-gray/20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer -ml-4"
          aria-label="Faire defiler vers la gauche"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-dark" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollTo('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-neutral-gray/20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer -mr-4"
          aria-label="Faire defiler vers la droite"
        >
          <ChevronRight className="w-5 h-5 text-neutral-dark" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => {
          const startingPrice = getStartingPrice(product)

          return (
            <motion.div
              key={product.slug}
              className="flex-shrink-0 w-72 snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' as const }}
            >
              <Card variant="glass" hoverable className="p-6 h-full flex flex-col">
                <h4 className="text-base font-bold text-neutral-dark mb-2">
                  {product.name}
                </h4>
                <p className="text-xs text-neutral-medium leading-relaxed mb-4 flex-1 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xs text-neutral-medium">A partir de</span>
                  <span className="text-xl font-extrabold text-primary">
                    {startingPrice.toLocaleString('fr-FR')}€
                  </span>
                  <span className="text-xs text-neutral-medium">/mois</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  href={`/products/${product.slug}`}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Decouvrir
                </Button>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
