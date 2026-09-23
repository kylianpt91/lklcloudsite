import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SpotlightCard } from '../reactbits'

interface ActivityChartProps {
  data: { label: string; value: number }[]
  title?: string
  color?: string
  bare?: boolean
}

export function ActivityChart({ data, title = 'Activité', color = 'var(--admin-primary, #FF6A30)', bare }: ActivityChartProps) {
  const chart = (
    <>
      {title && <h3 className="text-sm font-bold text-[var(--admin-text-primary)] mb-4">{title}</h3>}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border, rgba(255,255,255,0.08))" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--admin-text-muted, #525252)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--admin-border, rgba(255,255,255,0.08))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--admin-text-muted, #525252)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#activityGradient)"
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: 'var(--admin-bg, #0A0A0A)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  )

  if (bare) return chart
  return <SpotlightCard className="!p-5">{chart}</SpotlightCard>
}
