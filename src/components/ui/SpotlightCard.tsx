import { useRef, useState, type ReactNode, type MouseEvent } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  mode?: 'dark' | 'light'
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 106, 48, 0.15)',
  mode = 'dark',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const baseClasses = mode === 'dark'
    ? 'border-white/[0.08] bg-[#111]'
    : 'border-neutral-200/30 bg-white/70 backdrop-blur-sm'

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(0.6) }}
      onBlur={() => { setIsFocused(false); setOpacity(0) }}
      onMouseEnter={() => setOpacity(mode === 'dark' ? 0.6 : 0.4)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl border overflow-hidden ${baseClasses} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
