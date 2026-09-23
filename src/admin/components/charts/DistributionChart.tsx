import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { SpotlightCard } from '../reactbits'

interface DistributionChartProps {
  data: { name: string; value: number; color: string }[]
  title?: string
}

export function DistributionChart({ data, title = 'Répartition' }: DistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <SpotlightCard className="!p-5">
      <h3 className="text-sm font-bold text-[var(--admin-text-primary)] mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--admin-bg-elevated, #111)',
                  border: '1px solid var(--admin-border, rgba(255,255,255,0.08))',
                  borderRadius: '12px',
                  boxShadow: 'var(--admin-shadow, 0 4px 24px rgba(0,0,0,0.3))',
                  fontSize: '12px',
                  color: 'var(--admin-text-primary, #FAFAFA)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
              <span className="text-xs text-[var(--admin-text-secondary)] flex-1 truncate">{entry.name}</span>
              <span className="text-xs font-bold text-[var(--admin-text-primary)] tabular-nums">
                {entry.value}
              </span>
              <span className="text-[10px] text-[var(--admin-text-muted)] tabular-nums w-10 text-right">
                {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  )
}
