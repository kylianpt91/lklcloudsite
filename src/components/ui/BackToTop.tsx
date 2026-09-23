import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const SHOW_THRESHOLD = 400

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
}

export default function BackToTop() {
  const [scrollY, setScrollY] = useState<number>(0)
  const [docHeight, setDocHeight] = useState<number>(0)

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY)
      setDocHeight(document.documentElement.scrollHeight - window.innerHeight)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const isVisible = scrollY > SHOW_THRESHOLD
  const scrollPercentage = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0

  // SVG circle parameters
  const size = 52
  const strokeWidth = 2.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const strokeDashoffset = useMemo(
    () => circumference - scrollPercentage * circumference,
    [circumference, scrollPercentage],
  )

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-full flex items-center justify-center cursor-pointer group"
          aria-label="Retour en haut"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Glass inner highlight */}
          <div
            className="absolute top-[3px] left-[6px] right-[6px] h-[40%] rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6A30" />
                <stop offset="100%" stopColor="#E85A20" />
              </linearGradient>
            </defs>
          </svg>

          {/* Arrow icon */}
          <ArrowUp className="w-[18px] h-[18px] text-neutral-dark/70 group-hover:text-primary transition-colors duration-200 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
