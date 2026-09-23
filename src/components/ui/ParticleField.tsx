import { useEffect, useRef } from 'react'

interface ParticleFieldProps {
  particleCount?: number
  color?: string
  speed?: number
  interactive?: boolean
  className?: string
}

interface FieldParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function ParticleField({
  particleCount = 50,
  color = '248, 129, 79',
  speed = 0.5,
  interactive = false,
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<FieldParticle[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvas.width = width
        canvas.height = height
      }
    })

    observer.observe(canvas.parentElement ?? canvas)

    const initParticles = () => {
      const w = canvas.width || 800
      const h = canvas.height || 600
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 1.5 + 0.5,
      }))
    }

    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    const animate = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        if (interactive) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const force = (100 - dist) / 100
            p.vx += (dx / dist) * force * 0.2
            p.vy += (dy / dist) * force * 0.2
          }

          const maxSpeed = speed * 3
          const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (currentSpeed > maxSpeed) {
            p.vx = (p.vx / currentSpeed) * maxSpeed
            p.vy = (p.vy / currentSpeed) * maxSpeed
          }

          p.vx *= 0.99
          p.vy *= 0.99

          if (Math.abs(p.vx) < speed * 0.1) {
            p.vx = (Math.random() - 0.5) * speed
          }
          if (Math.abs(p.vy) < speed * 0.1) {
            p.vy = (Math.random() - 0.5) * speed
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, 0.6)`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${color}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [particleCount, color, speed, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  )
}
