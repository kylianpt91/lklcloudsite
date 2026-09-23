import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Star } from 'lucide-react'
import type { ProductCategory } from '@/types/index.ts'
import Button from '@/components/ui/Button.tsx'

interface ProductQuickViewProps {
  product: ProductCategory | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-label={`Apercu de ${product.name}`}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-6 pb-4 border-b border-neutral-gray/20 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-dark">{product.name}</h2>
                  <p className="text-sm text-neutral-medium mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-1.5 rounded-full hover:bg-neutral-light transition-colors cursor-pointer shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-neutral-medium" />
                </button>
              </div>

              {/* Plans summary */}
              <div className="p-6 space-y-3">
                <h3 className="text-xs font-bold text-neutral-medium uppercase tracking-wider mb-4">
                  Offres disponibles
                </h3>

                {product.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={[
                      'flex items-center justify-between p-4 rounded-xl border-2 transition-colors',
                      plan.highlighted
                        ? 'border-primary bg-primary/5'
                        : 'border-neutral-gray/30',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      {plan.highlighted && (
                        <Star className="w-4 h-4 text-primary fill-primary" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-dark">{plan.name}</span>
                          {plan.badge && (
                            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-medium mt-0.5">
                          {plan.specs.cpu} &middot; {plan.specs.ram} &middot; {plan.specs.storage}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={[
                        'text-lg font-extrabold',
                        plan.highlighted ? 'text-primary' : 'text-neutral-dark',
                      ].join(' ')}>
                        {plan.price.toLocaleString('fr-FR')}€
                      </span>
                      <span className="text-xs text-neutral-medium">/{plan.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  href={`/products/${product.slug}`}
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Voir tous les details
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
