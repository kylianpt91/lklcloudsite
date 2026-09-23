import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { useAdmin } from '../../lib/context'
import { SpotlightCard } from '../reactbits'

interface FreshnessItem {
  label: string
  lastUpdated: string | null
  count: number
}

function getFreshnessColor(date: string | null): string {
  if (!date) return 'var(--admin-text-muted)'
  const diffDays = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
  if (diffDays <= 7) return 'var(--admin-success, #22c55e)'
  if (diffDays <= 30) return 'var(--admin-warning, #f59e0b)'
  return 'var(--admin-danger, #ef4444)'
}

function formatAge(date: string | null): string {
  if (!date) return '\u2014'
  const diffDays = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays}j`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`
  return `Il y a ${Math.floor(diffDays / 30)} mois`
}

export function ContentFreshness() {
  const { gammes, offres, faq, team, annonces } = useAdmin()

  const items = useMemo((): FreshnessItem[] => {
    const latest = (dates: string[]) => dates.length ? dates.sort().reverse()[0] : null
    return [
      { label: 'Gammes', lastUpdated: latest(gammes.map(g => g.updatedAt)), count: gammes.length },
      { label: 'Offres', lastUpdated: latest(offres.map(o => o.updatedAt)), count: offres.length },
      { label: 'FAQ', lastUpdated: latest(faq.map(f => f.updatedAt)), count: faq.length },
      { label: 'Equipe', lastUpdated: latest(team.map(m => m.updatedAt)), count: team.length },
      { label: 'Annonces', lastUpdated: latest(annonces.map(a => a.updatedAt)), count: annonces.length },
    ]
  }, [gammes, offres, faq, team, annonces])

  return (
    <SpotlightCard className="!p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Fraicheur du contenu</h3>
        <Clock size={16} className="text-[var(--admin-text-muted)]" />
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: getFreshnessColor(item.lastUpdated) }} />
              <span className="text-xs text-[var(--admin-text-secondary)]">{item.label}</span>
              <span className="text-[10px] text-[var(--admin-text-muted)]">({item.count})</span>
            </div>
            <span className="text-xs font-medium" style={{ color: getFreshnessColor(item.lastUpdated) }}>
              {formatAge(item.lastUpdated)}
            </span>
          </div>
        ))}
      </div>
    </SpotlightCard>
  )
}
