import { useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'

interface TiltCardProps {
  tiltAmount?: number
  glareEffect?: boolean
  className?: string
  children: ReactNode
}

export default function TiltCard({
  tiltAmount = 10,
  glareEffect = false,
  className = '',
  children,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 })

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4), transparent 60%)`

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const percentX = (e.clientX - centerX) / (rect.width / 2)
      const percentY = (e.clientY - centerY) / (rect.height / 2)

      rotateX.set(-percentY * tiltAmount)
      rotateY.set(percentX * tiltAmount)

      if (glareEffect) {
        glareX.set(((e.clientX - rect.left) / rect.width) * 100)
        glareY.set(((e.clientY - rect.top) / rect.height) * 100)
        glareOpacity.set(0.15)
      }
    },
    [tiltAmount, glareEffect, rotateX, rotateY, glareX, glareY, glareOpacity]
  )

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }, [rotateX, rotateY, glareOpacity])

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        className={className}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {glareEffect && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: glareBackground,
              opacity: glareOpacity,
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  )
}
