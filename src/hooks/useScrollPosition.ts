import { useState, useEffect } from 'react'

/**
 * Custom hook that tracks the current vertical scroll position of the window.
 * Returns the current `window.scrollY` value, updated on every scroll event.
 *
 * @returns The current scroll Y position in pixels.
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY)
    }

    // Set initial value
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollY
}
