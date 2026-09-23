import { useState, useEffect, useRef, useCallback } from 'react'

interface TextScrambleProps {
  text: string
  trigger?: boolean
  speed?: number
  className?: string
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function TextScramble({
  text,
  trigger = true,
  speed = 50,
  className = '',
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(0)
  const resolvedRef = useRef(0)
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)

  const randomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)]
  }, [])

  useEffect(() => {
    if (!trigger) {
      setDisplay(text)
      return
    }

    resolvedRef.current = 0
    frameRef.current = 0
    lastTimeRef.current = 0

    const interval = 1000 / speed

    const step = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const delta = time - lastTimeRef.current

      if (delta >= interval) {
        lastTimeRef.current = time
        frameRef.current++

        const resolved = Math.min(
          Math.floor(frameRef.current / 3),
          text.length
        )
        resolvedRef.current = resolved

        let result = ''
        for (let i = 0; i < text.length; i++) {
          if (i < resolved) {
            result += text[i]
          } else {
            result += randomChar()
          }
        }

        setDisplay(result)

        if (resolved >= text.length) {
          setDisplay(text)
          return
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [text, trigger, speed, randomChar])

  return <span className={className}>{display}</span>
}
