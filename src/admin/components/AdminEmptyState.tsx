import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface AdminEmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function AdminEmptyState({
  icon = <Inbox size={40} />,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-20 h-20 rounded-3xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-center mb-5 text-[var(--admin-text-muted)]"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-bold text-[var(--admin-text-primary)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--admin-text-secondary)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
