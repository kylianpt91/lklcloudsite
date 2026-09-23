import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useAdmin } from '../lib/context'
import { ActivityFeed } from './ActivityFeed'

export function NotificationBell() {
  const { unreadCount, markAllNotificationsRead } = useAdmin()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface)] transition-all"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-[var(--admin-primary)] text-white text-[10px] font-bold leading-none"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--admin-border-strong)] bg-[var(--admin-bg-elevated)] shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--admin-border)]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-semibold">
                    {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--admin-primary)] hover:text-[var(--admin-primary-dark)] transition-colors"
                >
                  <CheckCheck size={12} />
                  Tout lire
                </button>
              )}
            </div>

            {/* Feed */}
            <ActivityFeed onClose={() => setOpen(false)} />

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[var(--admin-border)] flex items-center justify-center">
              <span className="text-[10px] text-[var(--admin-text-muted)] flex items-center gap-1">
                <Check size={10} />
                Les notifications expirent après 30 jours
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
