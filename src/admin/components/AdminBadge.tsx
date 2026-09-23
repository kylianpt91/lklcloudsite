import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AdminBadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange'
  children: string
  pulse?: boolean
  size?: 'sm' | 'md'
  icon?: ReactNode
}

const variantStyles = {
  success: 'bg-[var(--admin-success-surface)] text-[var(--admin-success-light)] border-[var(--admin-success)]/20',
  warning: 'bg-[var(--admin-warning-surface)] text-[var(--admin-warning-light)] border-[var(--admin-warning)]/20',
  danger: 'bg-[var(--admin-danger-surface)] text-[var(--admin-danger-light)] border-[var(--admin-danger)]/20',
  info: 'bg-[var(--admin-info-surface)] text-[var(--admin-info-light)] border-[var(--admin-info)]/20',
  neutral: 'bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] border-[var(--admin-border)]',
  orange: 'bg-[var(--admin-primary-surface)] text-[var(--admin-primary-light)] border-[var(--admin-primary)]/20',
}

export function AdminBadge({ variant, children, pulse, size = 'md', icon }: AdminBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${variantStyles[variant]} ${
        pulse ? 'sync-pending' : ''
      } ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}
    >
      {icon}
      {variant === 'success' && !icon && <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-success)] admin-pulse-dot" />}
      {children}
    </motion.span>
  )
}
