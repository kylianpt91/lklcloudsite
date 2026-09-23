import { forwardRef } from 'react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  loading?: boolean
  href?: string
  children: ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-neutral-dark text-white hover:bg-primary active:scale-[0.98]',
  secondary:
    'bg-primary text-white hover:bg-primary-light active:scale-[0.98]',
  outline:
    'border border-neutral-dark/15 text-neutral-dark hover:border-neutral-dark/40 active:scale-[0.98]',
  ghost:
    'text-neutral-dark hover:bg-neutral-dark/[0.05] active:bg-neutral-dark/10',
  glass:
    'bg-paper border border-line text-neutral-dark hover:border-neutral-dark/30 active:scale-[0.98]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-sm gap-2',
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      loading = false,
      href,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-300 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none'

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const content = (
      <>
        {loading ? <Spinner /> : icon ? icon : null}
        {children}
      </>
    )

    if (href && !disabled && !loading) {
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className={classes}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
