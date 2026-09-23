import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  StaggerContainer                                                   */
/* ------------------------------------------------------------------ */

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
})

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  StaggerItem                                                        */
/* ------------------------------------------------------------------ */

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
