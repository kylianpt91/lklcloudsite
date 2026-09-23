import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmLabel?: string
  confirmColor?: string
  loading?: boolean
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

const shakeVariants = {
  initial: { rotate: 0 },
  shake: {
    rotate: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5, delay: 0.2 },
  },
}

export function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmLabel = 'Supprimer', confirmColor, loading }: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      const main = document.querySelector('.admin-root main')
      if (main) (main as HTMLElement).style.overflow = 'hidden'
      return () => {
        if (main) (main as HTMLElement).style.overflow = ''
      }
    }
  }, [open])

  const portalTarget = document.querySelector('.admin-root') || document.body

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-[var(--admin-overlay)] backdrop-blur-xl"
            onClick={onCancel}
          />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-md w-full admin-dialog-panel rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                variants={shakeVariants}
                initial="initial"
                animate="shake"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmColor === 'orange'
                    ? 'bg-[var(--admin-primary-surface)] border border-[var(--admin-primary)]/20'
                    : 'bg-[var(--admin-danger-surface)] border border-[var(--admin-danger)]/20'
                }`}
              >
                <AlertTriangle size={18} className={
                  confirmColor === 'orange' ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-danger)]'
                } />
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-[var(--admin-text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--admin-text-secondary)] mt-1">{message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold rounded-full border border-[var(--admin-border)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface)] transition-colors duration-300 disabled:opacity-50"
              >
                Annuler
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                disabled={loading}
                className={`px-5 py-2 text-sm font-semibold rounded-full text-white transition-colors duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2 ${
                  confirmColor === 'orange'
                    ? 'bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-dark)] shadow-[var(--admin-primary)]/20'
                    : 'bg-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/80 shadow-[var(--admin-danger)]/20'
                }`}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}
