import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to target over ~600ms with easing.
 * Re-triggers whenever `target` changes.
 */
export function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const prevTarget = useRef(target)

  useEffect(() => {
    if (target === prevTarget.current && current !== 0) return
    prevTarget.current = target

    const from = 0
    const to = target
    if (to === 0) { setCurrent(0); return }

    startRef.current = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      setCurrent(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return current
}
