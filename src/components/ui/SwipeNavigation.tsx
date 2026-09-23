import { useRef, useCallback } from 'react'
import type { ReactNode, TouchEvent as ReactTouchEvent } from 'react'

interface SwipeNavigationProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: ReactNode
  threshold?: number
}

export default function SwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  children,
  threshold = 50,
}: SwipeNavigationProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isSwipingRef = useRef(false)

  const handleTouchStart = useCallback((e: ReactTouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    isSwipingRef.current = false
  }, [])

  const handleTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.touches[0]
      if (!touch) return

      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      // Only engage horizontal swipe if the horizontal movement exceeds vertical
      // This prevents interfering with vertical scroll
      if (!isSwipingRef.current) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          isSwipingRef.current = true
        }
      }

      // Prevent default scrolling only when we're doing a horizontal swipe
      if (isSwipingRef.current) {
        e.preventDefault()
      }
    },
    [],
  )

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent) => {
      if (!touchStartRef.current || !isSwipingRef.current) {
        touchStartRef.current = null
        return
      }

      const touch = e.changedTouches[0]
      if (!touch) {
        touchStartRef.current = null
        return
      }

      const deltaX = touch.clientX - touchStartRef.current.x

      if (deltaX < -threshold) {
        onSwipeLeft?.()
      } else if (deltaX > threshold) {
        onSwipeRight?.()
      }

      touchStartRef.current = null
      isSwipingRef.current = false
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  )
}
