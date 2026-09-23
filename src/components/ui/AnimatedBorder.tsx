import { useId, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface AnimatedBorderProps {
  color?: string
  speed?: number
  borderRadius?: string
  children: ReactNode
  className?: string
}

export default function AnimatedBorder({
  color = '#FF6A30',
  speed = 3,
  borderRadius = '0.75rem',
  children,
  className = '',
}: AnimatedBorderProps) {
  const id = useId()
  const animName = `ab-spin-${id.replace(/:/g, '')}`
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gradientRef.current
    if (!el) return

    el.style.animation = `${animName} ${speed}s linear infinite`
  }, [animName, speed])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius,
        padding: '1.5px',
      }}
    >
      {/* Rotating conic gradient */}
      <div
        ref={gradientRef}
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius,
          background: `conic-gradient(from 0deg, ${color}, transparent 30%, transparent 70%, ${color})`,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Inner mask to only show border */}
      <div
        style={{
          position: 'absolute',
          inset: '1.5px',
          borderRadius: `calc(${borderRadius} - 1.5px)`,
          backgroundColor: 'white',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderRadius: `calc(${borderRadius} - 1.5px)`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes ${animName} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
