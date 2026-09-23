import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Gift } from 'lucide-react'

interface ExitIntentPopupProps {
  onDismiss: () => void
}

const STORAGE_KEY = 'lkl_exit_intent_dismissed'

export default function ExitIntentPopup({ onDismiss }: ExitIntentPopupProps) {
  const [visible, setVisible] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
    onDismiss()
  }, [onDismiss])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') return

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!visible) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, dismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Offre de bienvenue"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-neutral-dark/50 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative glass-strong rounded-2xl shadow-2xl shadow-black/10 max-w-md w-full p-8 text-center"
          >
            {/* Close */}
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-neutral-medium" aria-hidden="true" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Gift className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-xl font-bold text-neutral-dark mb-2">
              Attendez !
            </h2>
            <p className="text-neutral-medium text-sm mb-4">
              Profitez de <span className="font-bold text-primary">-10%</span> sur votre
              premi&egrave;re commande avec le code :
            </p>

            {/* Promo code */}
            <div className="inline-flex items-center gap-2 bg-neutral-light rounded-xl px-5 py-3 mb-6">
              <span className="text-lg font-mono font-bold text-neutral-dark tracking-wider select-all">
                BIENVENUE10
              </span>
            </div>

            {/* CTA */}
            <div>
              <Link
                to="/produits/plesk"
                onClick={dismiss}
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm rounded-full py-3 px-6 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-300"
              >
                En profiter maintenant
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
