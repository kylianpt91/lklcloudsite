import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
}

export default function GradientText({
  children,
  className = '',
  colors = ['var(--admin-primary)', 'var(--admin-primary-light)', '#f97316', 'var(--admin-primary)'],
  animationSpeed = 6,
}: GradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let start: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const duration = animationSpeed * 1000
      const progress = (elapsed % (duration * 2)) / duration
      // Yoyo: 0→100→0
      const position = progress <= 1 ? progress * 100 : (2 - progress) * 100
      el.style.backgroundPosition = `${position}% 50%`
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [animationSpeed])

  const gradientColors = [...colors, colors[0]].join(', ')

  return (
    <span
      ref={ref}
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientColors})`,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}
