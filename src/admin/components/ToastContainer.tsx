import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../lib/context'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

const iconMap = {
  success: <CheckCircle size={16} className="text-[var(--admin-success)]" />,
  error: <AlertCircle size={16} className="text-[var(--admin-danger)]" />,
  info: <Info size={16} className="text-[var(--admin-primary)]" />,
  warning: <AlertTriangle size={16} className="text-[var(--admin-warning)]" />,
}

const borderMap = {
  success: 'border-l-[var(--admin-success)]',
  error: 'border-l-[var(--admin-danger)]',
  info: 'border-l-[var(--admin-primary)]',
  warning: 'border-l-[var(--admin-warning)]',
}

const progressColorMap = {
  success: 'bg-[var(--admin-success)]',
  error: 'bg-[var(--admin-danger)]',
  info: 'bg-[var(--admin-primary)]',
  warning: 'bg-[var(--admin-warning)]',
}

const toastVariants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

function ToastProgressBar({ type, duration = 4000 }: { type: string; duration?: number }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining > 0) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--admin-surface)] rounded-b-2xl overflow-hidden">
      <div
        className={`h-full ${progressColorMap[type as keyof typeof progressColorMap]} transition-none`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useAdmin()

  return (
    <div className="fixed bottom-6 right-6 z-[60] space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative flex items-center gap-3 admin-glass-strong rounded-2xl border-l-[3px] ${borderMap[toast.type]} px-4 py-3 shadow-xl overflow-hidden`}
          >
            {iconMap[toast.type]}
            <p className="flex-1 text-sm text-[var(--admin-text-primary)] font-medium">{toast.message}</p>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] transition-colors"
            >
              <X size={14} />
            </motion.button>
            <ToastProgressBar type={toast.type} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
