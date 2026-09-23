import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SpotlightCard, CountUp } from './reactbits'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: 'orange' | 'green' | 'cyan' | 'blue' | 'yellow'
  index?: number
  trend?: { value: number; label?: string }
  suffix?: string
  prefix?: string
}

const colorMap = {
  orange: { bg: 'rgba(255,106,48,0.1)', text: 'var(--admin-primary)', border: 'rgba(255,106,48,0.2)', spotlight: 'rgba(255,106,48,0.12)' },
  green: { bg: 'var(--admin-success-surface)', text: 'var(--admin-success)', border: 'rgba(34,197,94,0.2)', spotlight: 'rgba(34,197,94,0.12)' },
  cyan: { bg: 'var(--admin-info-surface)', text: 'var(--admin-info)', border: 'rgba(6,182,212,0.2)', spotlight: 'rgba(6,182,212,0.12)' },
  blue: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)', spotlight: 'rgba(59,130,246,0.12)' },
  yellow: { bg: 'var(--admin-warning-surface)', text: 'var(--admin-warning)', border: 'rgba(245,158,11,0.2)', spotlight: 'rgba(245,158,11,0.12)' },
}

export function KPICard({ label, value, icon, color = 'orange', index = 0, trend, suffix, prefix }: KPICardProps) {
  const c = colorMap[color]
  const numericValue = typeof value === 'number' ? value : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard spotlightColor={c.spotlight} className="!p-5">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: index * 0.08 + 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <div style={{ color: c.text }}>{icon}</div>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-extrabold text-[var(--admin-text-primary)] tracking-tight tabular-nums">
              {prefix}
              {numericValue !== null ? (
                <CountUp to={numericValue} duration={1200} suffix={suffix} />
              ) : (
                value
              )}
              {numericValue === null && suffix}
            </p>
            <p className="text-sm text-[var(--admin-text-secondary)] font-medium">{label}</p>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              trend.value >= 0
                ? 'text-[var(--admin-success)] bg-[var(--admin-success-surface)]'
                : 'text-[var(--admin-danger)] bg-[var(--admin-danger-surface)]'
            }`}>
              {trend.value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
