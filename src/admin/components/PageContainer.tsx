import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BlurText } from './reactbits'

interface PageContainerProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageContainer({ title, description, actions, children }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <BlurText
            text={title}
            delay={60}
            className="text-2xl font-extrabold text-[var(--admin-text-primary)] tracking-tight"
          />
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm text-[var(--admin-text-secondary)] mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 shrink-0"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {/* Page content */}
      {children}
    </motion.div>
  )
}
