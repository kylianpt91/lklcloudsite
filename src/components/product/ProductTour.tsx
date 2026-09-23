import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, Zap, Globe, Server, Database, Clock, Cpu, HardDrive } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'

interface TourFeature {
  title: string
  description: string
  icon: string
}

interface ProductTourProps {
  features: TourFeature[]
  autoAdvance?: boolean
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Zap,
  Globe,
  Server,
  Database,
  Clock,
  Cpu,
  HardDrive,
}

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Zap
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

export default function ProductTour({ features, autoAdvance = false }: ProductTourProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % features.length)
  }, [features.length])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + features.length) % features.length)
  }, [features.length])

  useEffect(() => {
    if (autoAdvance && features.length > 1) {
      intervalRef.current = setInterval(goNext, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoAdvance, goNext, features.length])

  // Reset timer on manual navigation
  const handleNav = useCallback((fn: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    fn()
    if (autoAdvance && features.length > 1) {
      intervalRef.current = setInterval(goNext, 5000)
    }
  }, [autoAdvance, goNext, features.length])

  if (features.length === 0) return null

  const feature = features[current]
  const Icon = getIcon(feature.icon)

  return (
    <Card variant="glass" className="p-8 overflow-hidden">
      <div className="min-h-[240px] flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* Animated icon area */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
            >
              <Icon className="w-8 h-8 text-primary" />
            </motion.div>

            <h3 className="text-lg font-bold text-neutral-dark mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-medium max-w-md leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => handleNav(goPrev)}
          className="p-2 rounded-full hover:bg-neutral-light transition-colors cursor-pointer"
          aria-label="Precedent"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-medium" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNav(() => goTo(index))}
              className="cursor-pointer p-0.5"
              aria-label={`Etape ${index + 1}`}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: index === current ? 20 : 8,
                  height: 8,
                  backgroundColor: index === current ? '#FF6A30' : '#e5e5e5',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => handleNav(goNext)}
          className="p-2 rounded-full hover:bg-neutral-light transition-colors cursor-pointer"
          aria-label="Suivant"
        >
          <ChevronRight className="w-5 h-5 text-neutral-medium" />
        </button>
      </div>
    </Card>
  )
}
