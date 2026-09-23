import { useState, useEffect, useRef } from 'react'

interface WebVitals {
  cls: number | null
  fid: number | null
  lcp: number | null
  fcp: number | null
  ttfb: number | null
}

const initialVitals: WebVitals = {
  cls: null,
  fid: null,
  lcp: null,
  fcp: null,
  ttfb: null,
}

function logVital(name: string, value: number): void {
  if (import.meta.env.DEV) {
    console.log(`[Web Vital] ${name}: ${value.toFixed(2)}`)
  }
}

export function useWebVitals(): WebVitals {
  const [vitals, setVitals] = useState<WebVitals>(initialVitals)
  const observersRef = useRef<PerformanceObserver[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
      return
    }

    const observers: PerformanceObserver[] = []

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          // LayoutShift entries have a 'hadRecentInput' property
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean
            value?: number
          }
          if (!layoutShift.hadRecentInput && layoutShift.value !== undefined) {
            clsValue += layoutShift.value
            setVitals(prev => ({ ...prev, cls: clsValue }))
            logVital('CLS', clsValue)
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      observers.push(clsObserver)
    } catch {
      // layout-shift not supported
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          const firstEntry = entries[0] as PerformanceEntry & { processingStart?: number }
          if (firstEntry.processingStart !== undefined) {
            const fid = firstEntry.processingStart - firstEntry.startTime
            setVitals(prev => ({ ...prev, fid }))
            logVital('FID', fid)
          }
        }
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
      observers.push(fidObserver)
    } catch {
      // first-input not supported
    }

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          // Use the last entry as LCP can update
          const lastEntry = entries[entries.length - 1]
          const lcp = lastEntry.startTime
          setVitals(prev => ({ ...prev, lcp }))
          logVital('LCP', lcp)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      observers.push(lcpObserver)
    } catch {
      // largest-contentful-paint not supported
    }

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries()
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            setVitals(prev => ({ ...prev, fcp: entry.startTime }))
            logVital('FCP', entry.startTime)
          }
        }
      })
      fcpObserver.observe({ type: 'paint', buffered: true })
      observers.push(fcpObserver)
    } catch {
      // paint not supported
    }

    // TTFB - Time to First Byte
    try {
      const navEntries = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[]
      if (navEntries.length > 0) {
        const ttfb = navEntries[0].responseStart - navEntries[0].requestStart
        setVitals(prev => ({ ...prev, ttfb }))
        logVital('TTFB', ttfb)
      }
    } catch {
      // navigation timing not supported
    }

    observersRef.current = observers

    return () => {
      for (const observer of observers) {
        observer.disconnect()
      }
    }
  }, [])

  return vitals
}
