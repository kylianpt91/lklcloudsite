import { useRef, useEffect } from 'react'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
  color = 'var(--admin-text-secondary)',
  shineColor = 'var(--admin-text-primary)',
}: ShinyTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    let start: number | null = null
    let raf: number
    const duration = speed * 1000

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = (elapsed % duration) / duration
      const position = 150 - progress * 200
      el.style.backgroundPosition = `${position}% center`
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [speed, disabled])

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {text}
    </span>
  )
}
