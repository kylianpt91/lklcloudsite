import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BlurTransitionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function BlurTransition({
  children,
  delay = 0,
  className = '',
}: BlurTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{
        filter: 'blur(10px)',
        opacity: 0,
        scale: 0.98,
      }}
      whileInView={{
        filter: 'blur(0px)',
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  )
}
