import { useEffect, useRef, useState } from 'react'

interface MouseTrailProps {
  color?: string
  trailLength?: number
  maxRadius?: number
}

interface TrailPoint {
  x: number
  y: number
}

export default function MouseTrail({
  color = '248, 129, 79',
  trailLength = 18,
  maxRadius = 6,
}: MouseTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<TrailPoint[]>([])
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

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({ x: e.clientX, y: e.clientY })

      if (pointsRef.current.length > trailLength) {
        pointsRef.current.shift()
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const points = pointsRef.current

      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const progress = i / points.length
        const radius = maxRadius * progress
        const alpha = progress * 0.5

        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isPointerFine, color, trailLength, maxRadius])

  if (!isPointerFine) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  )
}
