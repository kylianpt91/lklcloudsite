import { useRef, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface HeroParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export default function HeroParallax({
  children,
  speed = 0.5,
  className = '',
}: HeroParallaxProps) {
  const [offset, setOffset] = useState(0)
  const rafRef = useRef<number>(0)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    rafRef.current = requestAnimationFrame(() => {
      setOffset(window.scrollY)
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offset * speed}px)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
