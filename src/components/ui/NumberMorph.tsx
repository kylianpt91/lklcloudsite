import { useState, useEffect, useMemo, useRef } from 'react'

interface NumberMorphProps {
  value: number
  format?: 'currency' | 'percent' | 'number'
  locale?: string
  className?: string
  duration?: number
}

function formatValue(
  value: number,
  format: NumberMorphProps['format'],
  locale: string
): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      }).format(value)
    case 'percent':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
      }).format(value / 100)
    default:
      return new Intl.NumberFormat(locale).format(value)
  }
}

function DigitColumn({
  digit,
  duration,
}: {
  digit: string
  duration: number
}) {
  const isNum = /\d/.test(digit)
  const [prevDigit, setPrevDigit] = useState(digit)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef(0)

  useEffect(() => {
    if (digit !== prevDigit) {
      setAnimating(true)

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setPrevDigit(digit)
        setAnimating(false)
      }, duration)
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [digit, prevDigit, duration])

  if (!isNum) {
    return <span>{digit}</span>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        height: '1em',
        overflow: 'hidden',
        position: 'relative',
        verticalAlign: 'bottom',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          transition: animating
            ? `transform ${duration}ms ease-out`
            : 'none',
          transform: animating ? 'translateY(-1em)' : 'translateY(0)',
        }}
      >
        <span style={{ height: '1em', lineHeight: '1em' }}>
          {animating ? prevDigit : digit}
        </span>
        <span style={{ height: '1em', lineHeight: '1em' }}>{digit}</span>
      </span>
    </span>
  )
}

export default function NumberMorph({
  value,
  format = 'number',
  locale = 'fr-FR',
  className = '',
  duration = 500,
}: NumberMorphProps) {
  const formatted = useMemo(
    () => formatValue(value, format, locale),
    [value, format, locale]
  )

  const chars = formatted.split('')

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', whiteSpace: 'pre' }}
      aria-label={formatted}
    >
      {chars.map((char, i) => (
        <DigitColumn key={`${i}-${chars.length}`} digit={char} duration={duration} />
      ))}
    </span>
  )
}
