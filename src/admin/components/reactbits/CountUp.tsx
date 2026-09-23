import { useEffect, useRef, useCallback } from 'react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  separator?: string
  decimals?: number
  prefix?: string
  suffix?: string
}

export default function CountUp({
  to,
  from = 0,
  duration = 2000,
  className = '',
  separator = '',
  decimals = 0,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  const formatValue = useCallback(
    (value: number) => {
      const fixed = value.toFixed(decimals)
      if (!separator) return `${prefix}${fixed}${suffix}`

      const [intPart, decPart] = fixed.split('.')
      const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      return `${prefix}${decPart ? `${formatted}.${decPart}` : formatted}${suffix}`
    },
    [decimals, separator, prefix, suffix],
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver to trigger animation on view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

        const animate = (timestamp: number) => {
          if (!startTimeRef.current) startTimeRef.current = timestamp
          const elapsed = timestamp - startTimeRef.current
          const progress = Math.min(elapsed / duration, 1)
          const eased = easeOutQuart(progress)
          const current = from + (to - from) * eased

          el.textContent = formatValue(current)

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate)
          }
        }

        rafRef.current = requestAnimationFrame(animate)
      },
      { threshold: 0.1 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [to, from, duration, formatValue])

  return (
    <span className={className} ref={ref}>
      {formatValue(from)}
    </span>
  )
}
