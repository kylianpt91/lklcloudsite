import type { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MorphingIconProps {
  icon1: LucideIcon
  icon2: LucideIcon
  active: boolean
  className?: string
}

const iconVariants = {
  initial: {
    opacity: 0,
    scale: 0.6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
}

export default function MorphingIcon({
  icon1: Icon1,
  icon2: Icon2,
  active,
  className = '',
}: MorphingIconProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <AnimatePresence mode="wait">
        {active ? (
          <motion.span
            key="icon2"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex"
          >
            <Icon2 />
          </motion.span>
        ) : (
          <motion.span
            key="icon1"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex"
          >
            <Icon1 />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
