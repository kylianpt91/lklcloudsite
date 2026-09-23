import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface AnnouncementBarProps {
  message: string
  link?: { label: string; href?: string; onClick?: () => void }
  dismissible?: boolean
  variant?: 'primary' | 'info' | 'promo'
  onDismiss?: () => void
}

const STORAGE_KEY = 'lkl_announcement_dismissed'

const variantClasses: Record<NonNullable<AnnouncementBarProps['variant']>, string> = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark text-white',
  info: 'bg-neutral-dark text-white',
  promo: 'bg-gradient-to-r from-violet-600 to-primary text-white',
}

export default function AnnouncementBar({
  message,
  link,
  dismissible = true,
  variant = 'primary',
  onDismiss,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem(STORAGE_KEY)
    const isDismissed = stored === 'true'
    setDismissed(isDismissed)
    if (isDismissed) {
      onDismiss?.()
    }
  }, [onDismiss])

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="overflow-hidden w-full"
          role="banner"
          aria-label="Annonce"
        >
          <div
            className={`flex items-center justify-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-medium ${variantClasses[variant]}`}
          >
            <span>{message}</span>

            {link && (
              link.onClick ? (
                <button
                  type="button"
                  onClick={link.onClick}
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold whitespace-nowrap cursor-pointer"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  href={link.href}
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold whitespace-nowrap"
                >
                  {link.label}
                </a>
              )
            )}

            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
                aria-label="Fermer l'annonce"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
