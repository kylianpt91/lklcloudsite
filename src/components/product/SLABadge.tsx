import { motion } from 'framer-motion'

interface SLABadgeProps {
  percentage: number
  className?: string
}

export default function SLABadge({ percentage, className = '' }: SLABadgeProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const fillPercentage = (percentage / 100) * circumference
  const offset = circumference - fillPercentage

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="relative w-28 h-28">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-label={`SLA garanti ${percentage}%`}
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="6"
          />
          {/* Filled ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#sla-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            variants={{
              hidden: { strokeDashoffset: circumference },
              visible: { strokeDashoffset: offset },
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          />
          <defs>
            <linearGradient id="sla-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A30" />
              <stop offset="100%" stopColor="#E85A20" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-extrabold text-neutral-dark"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' as const }}
          >
            {percentage.toFixed(2).replace('.', ',')}%
          </motion.span>
        </div>
      </div>

      <motion.span
        className="mt-3 text-xs font-bold text-neutral-medium uppercase tracking-wider"
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, delay: 1.2, ease: 'easeOut' as const }}
      >
        SLA Garanti
      </motion.span>
    </motion.div>
  )
}
