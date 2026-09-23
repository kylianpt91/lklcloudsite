import { useState } from 'react'
import type { ReactNode } from 'react'

interface CardFlipProps {
  front: ReactNode
  back: ReactNode
  flipped?: boolean
  className?: string
}

export default function CardFlip({
  front,
  back,
  flipped: controlledFlipped,
  className = '',
}: CardFlipProps) {
  const [hovered, setHovered] = useState(false)

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : hovered

  return (
    <div
      className={className}
      style={{ perspective: 1000 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
          }}
        >
          {front}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
