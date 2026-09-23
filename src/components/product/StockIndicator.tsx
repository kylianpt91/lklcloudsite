import { motion } from 'framer-motion'
import { Server } from 'lucide-react'

interface StockIndicatorProps {
  available: number
  total: number
  className?: string
}

export default function StockIndicator({ available, total, className = '' }: StockIndicatorProps) {
  const percentage = (available / total) * 100
  const isLow = percentage < 20
  const isMedium = percentage >= 20 && percentage <= 50

  const barColor = isLow
    ? 'bg-red-500'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-green-500'

  const dotColor = isLow
    ? 'bg-red-500'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-green-500'

  const textColor = isLow
    ? 'text-red-600'
    : isMedium
      ? 'text-amber-600'
      : 'text-green-600'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Pulsing dot */}
        {available > 0 && (
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Server className="w-3.5 h-3.5 text-neutral-medium shrink-0" />
            <span className={`text-xs font-semibold ${textColor}`}>
              {available} serveur{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-light rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
          </div>

          {/* Low stock warning */}
          {isLow && available > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-semibold text-red-500 mt-1"
            >
              Derniers emplacements !
            </motion.p>
          )}

          {available === 0 && (
            <p className="text-[10px] font-semibold text-red-500 mt-1">
              Rupture de stock
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
