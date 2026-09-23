import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface RevealSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fadeUp' | 'fadeScale' | 'slideLeft' | 'slideRight' | 'blur'
  delay?: number
  once?: boolean
}

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeScale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(12px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
}

export default function RevealSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  once = true,
}: RevealSectionProps) {
  return (
    <motion.div
      className={className}
      variants={variants[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
