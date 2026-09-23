import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAdmin } from '../../lib/context'
import { SpotlightCard } from '../reactbits'

const tooltipStyle = {
  background: 'var(--admin-bg-elevated, #111)',
  border: '1px solid var(--admin-border, rgba(255,255,255,0.08))',
  borderRadius: '12px',
  boxShadow: 'var(--admin-shadow, 0 4px 24px rgba(0,0,0,0.3))',
  fontSize: '12px',
  color: 'var(--admin-text-primary, #FAFAFA)',
}

export function CatalogSummary() {
  const { offres, gammes } = useAdmin()

  const statusData = useMemo(() =>
    [
      { name: 'Actives', value: offres.filter(o => o.statut === 'actif').length, color: '#22c55e' },
      { name: 'Brouillons', value: offres.filter(o => o.statut === 'brouillon').length, color: '#f59e0b' },
      { name: 'Archivees', value: offres.filter(o => o.statut === 'archive').length, color: '#6b7280' },
    ].filter(d => d.value > 0),
    [offres],
  )

  const gammeData = useMemo(() =>
    [
      { name: 'Actives', value: gammes.filter(g => g.actif).length, color: '#22c55e' },
      { name: 'Inactives', value: gammes.filter(g => !g.actif).length, color: '#6b7280' },
    ].filter(d => d.value > 0),
    [gammes],
  )

  return (
    <SpotlightCard className="!p-5">
      <h3 className="text-sm font-bold text-[var(--admin-text-primary)] mb-4">Statut du catalogue</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Offres */}
        <div>
          <p className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Offres</p>
          {statusData.length > 0 ? (
            <>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={3} dataKey="value" stroke="none">
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[10px] text-[var(--admin-text-muted)] flex-1">{d.name}</span>
                    <span className="text-[10px] font-bold text-[var(--admin-text-primary)]">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-[var(--admin-text-muted)] py-6 text-center">Aucune offre</p>
          )}
        </div>

        {/* Gammes */}
        <div>
          <p className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Gammes</p>
          {gammeData.length > 0 ? (
            <>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gammeData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={3} dataKey="value" stroke="none">
                      {gammeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                {gammeData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[10px] text-[var(--admin-text-muted)] flex-1">{d.name}</span>
                    <span className="text-[10px] font-bold text-[var(--admin-text-primary)]">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-[var(--admin-text-muted)] py-6 text-center">Aucune gamme</p>
          )}
        </div>
      </div>
    </SpotlightCard>
  )
}
