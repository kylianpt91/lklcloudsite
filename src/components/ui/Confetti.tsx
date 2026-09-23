import { useRef, useCallback, useEffect } from 'react'
import type { FC } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'rect' | 'circle'
}

interface FireOptions {
  x?: number
  y?: number
  count?: number
}

const COLORS = [
  '#FF6A30', // primary orange
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#3B82F6', // blue
]

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const activeRef = useRef(false)

  const fire = useCallback((options?: FireOptions) => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const originX = options?.x ?? window.innerWidth / 2
    const originY = options?.y ?? 0
    const count = options?.count ?? 60 + Math.floor(Math.random() * 20)

    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -8 - 4,
        width: Math.random() * 8 + 4,
        height: Math.random() * 6 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      })
    }

    particlesRef.current = [...particlesRef.current, ...newParticles]

    if (!activeRef.current) {
      activeRef.current = true
      animate(ctx, canvas)
    }

    setTimeout(() => {
      particlesRef.current = particlesRef.current.filter(
        (p) => !newParticles.includes(p)
      )
    }, 3000)
  }, [])

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      if (particles.length === 0) {
        activeRef.current = false
        return
      }

      for (const p of particles) {
        p.x += p.vx
        p.vy += 0.25
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, p.opacity - 0.008)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(() => animate(ctx, canvas))
    },
    []
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const ConfettiCanvas: FC = () => (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )

  return { fire, ConfettiCanvas }
}
