import { useRef, useState, useEffect } from 'react'
import type { RefObject } from 'react'

interface UseInViewOptions {
  /** The threshold at which the observer callback fires (0 to 1). Defaults to 0.1. */
  threshold?: number
  /** Margin around the root element. Defaults to '0px'. */
  rootMargin?: string
  /** If true, the observer disconnects after the element first enters the viewport. Defaults to true. */
  triggerOnce?: boolean
}

/**
 * Custom hook that uses IntersectionObserver to detect when an element enters
 * the viewport. Useful for scroll-triggered animations and lazy loading.
 *
 * @param options - Configuration options for the IntersectionObserver.
 * @returns A tuple of [ref, isInView] where ref should be attached to the
 *          target element and isInView indicates whether the element is
 *          currently (or has been) in view.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState<boolean>(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return [ref, isInView]
}
