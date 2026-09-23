import { useCallback, useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'

interface CardProps {
  variant?: 'default' | 'glass' | 'spotlight'
  hoverable?: boolean
  className?: string
  children: ReactNode
}

export default function Card({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (variant !== 'spotlight') return
      const rect = e.currentTarget.getBoundingClientRect()
      setSpotlightPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [variant]
  )

  const baseClasses = 'relative overflow-hidden'

  const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
    default:
      'bg-paper rounded-2xl border border-line',
    glass: 'bg-paper rounded-2xl border border-line',
    spotlight:
      'bg-paper rounded-2xl border border-line',
  }

  const hoverClasses = hoverable
    ? 'transition-colors duration-300 hover:border-neutral-dark/20'
    : ''

  const classes = [baseClasses, variantClasses[variant], hoverClasses, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={cardRef}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {variant === 'spotlight' && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(248, 129, 79, 0.1), transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
