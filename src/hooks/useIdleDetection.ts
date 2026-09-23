import { useState, useEffect, useRef, useCallback } from 'react'

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'touchmove',
]

export function useIdleDetection(timeoutMs: number): { isIdle: boolean } {
  const [isIdle, setIsIdle] = useState<boolean>(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    setIsIdle(false)

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true)
    }, timeoutMs)
  }, [timeoutMs])

  useEffect(() => {
    // Start the initial timer
    resetTimer()

    const handler = () => {
      resetTimer()
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handler, { passive: true })
    }

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handler)
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [resetTimer])

  return { isIdle }
}
