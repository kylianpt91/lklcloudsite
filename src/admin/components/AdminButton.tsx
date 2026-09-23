import { forwardRef } from 'react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface AdminButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  loading?: boolean
  children?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-primary-dark)] text-white hover:shadow-lg hover:shadow-[var(--admin-primary)]/20',
  secondary:
    'border border-[var(--admin-border-strong)] text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-hover)]',
  ghost:
    'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text-primary)]',
  danger:
    'bg-[var(--admin-danger)] text-white hover:shadow-lg hover:shadow-[var(--admin-danger)]/20',
  warning:
    'border border-[var(--admin-warning)]/20 text-[var(--admin-warning)] hover:bg-[var(--admin-warning)]/10',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
  icon: 'p-2',
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading = false, children, className = '', disabled, ...props }, ref) => {
    const classes = [
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ')

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={classes}
        disabled={disabled || loading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? <Spinner /> : icon ?? null}
        {children}
      </motion.button>
    )
  }
)

AdminButton.displayName = 'AdminButton'
