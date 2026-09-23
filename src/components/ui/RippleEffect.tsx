import { useState, useCallback } from 'react'
import type { FC, MouseEvent } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
}

interface RippleContainerProps {
  ripples: Ripple[]
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const onMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 700)
  }, [])

  const RippleContainer: FC<RippleContainerProps> = ({ ripples: items }) => (
    <span
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    >
      {items.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            borderRadius: '50%',
            backgroundColor: 'rgba(248,129,79,0.3)',
            transform: 'scale(0)',
            animation: 'ripple-expand 700ms ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple-expand {
          0% {
            transform: scale(0);
            opacity: 0.4;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  )

  const BoundRippleContainer: FC = () => <RippleContainer ripples={ripples} />

  return { ripples, onMouseDown, RippleContainer: BoundRippleContainer }
}
