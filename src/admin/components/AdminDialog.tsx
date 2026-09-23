import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AdminDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'md' | 'lg' | 'xl' | 'full'
  footer?: ReactNode
}

const sizeMap = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

export function AdminDialog({ open, onClose, title, description, children, size = 'lg', footer }: AdminDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      // Also freeze the admin main scroll container
      const main = document.querySelector('.admin-root main')
      if (main) (main as HTMLElement).style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        if (main) (main as HTMLElement).style.overflow = ''
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

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
            onClick={onClose}
          />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative ${sizeMap[size]} w-full admin-dialog-panel rounded-2xl max-h-[85vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)] shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[var(--admin-text-primary)]">{title}</h2>
                {description && <p className="text-sm text-[var(--admin-text-secondary)] mt-0.5">{description}</p>}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="p-2 rounded-full text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface)] transition-colors duration-300"
              >
                <X size={18} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
            {footer && (
              <div className="px-6 py-4 border-t border-[var(--admin-border)] shrink-0 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}
