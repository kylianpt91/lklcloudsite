import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gamepad2, Cloud, Globe, Server, Code, Cpu, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBridgeProductGroups } from '@/hooks/useBridge'

const iconMap: Record<string, LucideIcon> = {
  Gamepad2, Cloud, Globe, Server, Code, Cpu, Package,
}

export default function DeployModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const groups = useBridgeProductGroups()

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    // Stop Lenis smooth scroll too (it bypasses CSS overflow)
    const lenis = (window as unknown as Record<string, { stop: () => void; start: () => void }>).__lenis
    lenis?.stop()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une gamme"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative bg-surface border border-hairline rounded-2xl shadow-2xl shadow-black/60 max-w-lg w-full p-6 sm:p-8"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-dark/[0.05] transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-neutral-medium" />
            </button>

            <h2 className="text-lg font-bold text-neutral-dark mb-1">
              Quelle gamme vous intéresse ?
            </h2>
            <p className="text-sm text-neutral-dark/55 mb-6">
              Sélectionnez une catégorie pour découvrir nos offres
            </p>

            <div className="space-y-3">
              {groups.map((range) => {
                const RangeIcon = iconMap[range.icon] || Package
                return (
                  <div key={range.label} className="rounded-xl border border-hairline bg-surface-2 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-dark/[0.05]">
                        <RangeIcon className="w-4.5 h-4.5 text-neutral-dark" />
                      </div>
                      <h3 className="font-semibold text-neutral-dark text-sm">{range.label}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {range.items.map((item) =>
                        item.comingSoon ? (
                          <span
                            key={item.href + item.label}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-dark/[0.04] text-neutral-dark/50 cursor-default"
                          >
                            {item.label}
                            <span className="text-[9px] font-semibold text-primary border border-primary/30 rounded px-1.5 py-0.5 leading-none">
                              Bientôt
                            </span>
                          </span>
                        ) : (
                          <Link
                            key={item.href + item.label}
                            to={item.href}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-dark/[0.05] text-neutral-dark hover:bg-primary hover:text-white transition-colors"
                          >
                            {item.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
