import { useEffect, useRef, useState } from 'react'

interface GradientCursorProps {
  size?: number
  color?: string
  opacity?: number
}

export default function GradientCursor({
  size = 300,
  color = '248, 129, 79',
  opacity = 0.08,
}: GradientCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -size, y: -size })
  const targetRef = useRef({ x: -size, y: -size })
  const rafRef = useRef(0)
  const [isPointerFine, setIsPointerFine] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(pointer: fine)')
    setIsPointerFine(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isPointerFine) return

    const el = dotRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const pos = posRef.current
      const target = targetRef.current

      pos.x += (target.x - pos.x) * 0.1
      pos.y += (target.y - pos.y) * 0.1

      el.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isPointerFine, size])

  if (!isPointerFine) return null

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  )
}
