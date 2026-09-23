import { useRef, useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface ParticleNetworkProps {
  className?: string
  particleCount?: number
  color?: string
  lineOpacity?: number
  maxDistance?: number
  speed?: number
  interactive?: boolean
}

export default function ParticleNetwork({
  className = '',
  particleCount = 60,
  color = '255, 106, 48',
  lineOpacity = 0.15,
  maxDistance = 120,
  speed = 0.3,
  interactive = true,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -9999, y: -9999 })
  const rafId = useRef(0)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * window.devicePixelRatio
    canvas.height = h * window.devicePixelRatio

    particles.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 1.5 + 0.5,
    }))
  }, [particleCount, speed])

  useEffect(() => {
    init()

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio
    ctx.scale(dpr, dpr)

    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight

    const draw = () => {
      ctx.clearRect(0, 0, w(), h())
      const pts = particles.current

      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w()) p.vx *= -1
        if (p.y < 0 || p.y > h()) p.vy *= -1

        if (interactive) {
          const dx = p.x - mouse.current.x
          const dy = p.y - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            p.x += dx * 0.02
            p.y += dy * 0.02
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, 0.5)`
        ctx.fill()
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * lineOpacity
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${color}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafId.current = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 }
    }

    window.addEventListener('resize', handleResize)
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouse)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', handleResize)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouse)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [init, color, lineOpacity, maxDistance, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    />
  )
}
