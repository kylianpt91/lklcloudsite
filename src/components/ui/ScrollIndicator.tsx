import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  text?: string
  className?: string
}

export default function ScrollIndicator({
  text = 'Découvrir',
  className = '',
}: ScrollIndicatorProps) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const fadeStart = 50
      const fadeEnd = 200
      if (scrollY <= fadeStart) {
        setOpacity(1)
      } else if (scrollY >= fadeEnd) {
        setOpacity(0)
      } else {
        setOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
      >
        <ChevronDown className="w-6 h-6 text-neutral-dark/50" />
      </motion.div>
      <span className="text-xs text-neutral-dark/40 font-medium tracking-wider uppercase">
        {text}
      </span>
    </motion.div>
  )
}
