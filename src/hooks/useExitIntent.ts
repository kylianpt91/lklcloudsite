import { useState, useEffect, useCallback, useRef } from 'react'

interface ExitIntentOptions {
  threshold?: number
  delay?: number
}

interface ExitIntentReturn {
  showExitIntent: boolean
  dismiss: () => void
}

const SESSION_KEY = 'lkl_exit_intent_shown'

export function useExitIntent(options?: ExitIntentOptions): ExitIntentReturn {
  const { threshold = 0, delay = 5000 } = options ?? {}
  const [showExitIntent, setShowExitIntent] = useState<boolean>(false)
  const mountTimeRef = useRef<number>(Date.now())
  const hasTriggeredRef = useRef<boolean>(false)

  const dismiss = useCallback(() => {
    setShowExitIntent(false)
    try {
      sessionStorage.setItem(SESSION_KEY, 'true')
    } catch {
      // sessionStorage not available
    }
  }, [])

  useEffect(() => {
    // Check if already shown this session
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        hasTriggeredRef.current = true
        return
      }
    } catch {
      // sessionStorage not available
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (hasTriggeredRef.current) return

      // Only trigger when mouse leaves from the top
      if (event.clientY > threshold) return

      // Check if minimum delay has passed
      const elapsed = Date.now() - mountTimeRef.current
      if (elapsed < delay) return

      hasTriggeredRef.current = true
      setShowExitIntent(true)

      try {
        sessionStorage.setItem(SESSION_KEY, 'true')
      } catch {
        // sessionStorage not available
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [threshold, delay])

  return { showExitIntent, dismiss }
}
