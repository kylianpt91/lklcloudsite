import { useMemo } from 'react'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminBadge } from '../components/AdminBadge'
import { getScheduleStatus } from '../components/ScheduleFields'
import { Calendar, Layers, Package, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ScheduledItem {
  id: string
  type: 'gamme' | 'offre'
  name: string
  action: 'publish' | 'unpublish'
  date: Date
  dateISO: string
  href: string
  status: string
}

export default function Planning() {
  const { gammes, offres } = useAdmin()
  const navigate = useNavigate()

  const scheduledItems = useMemo(() => {
    const items: ScheduledItem[] = []
    const now = new Date()

    for (const g of gammes) {
      if (!g.scheduleConfig) continue
      if (g.scheduleConfig.publishAt && new Date(g.scheduleConfig.publishAt) > now) {
        items.push({
          id: g.id,
          type: 'gamme',
          name: g.nom,
          action: 'publish',
          date: new Date(g.scheduleConfig.publishAt),
          dateISO: g.scheduleConfig.publishAt,
          href: '/apps/management/gammes',
          status: g.actif ? 'Actif' : 'Inactif',
        })
      }
      if (g.scheduleConfig.unpublishAt && new Date(g.scheduleConfig.unpublishAt) > now) {
        items.push({
          id: g.id,
          type: 'gamme',
          name: g.nom,
          action: 'unpublish',
          date: new Date(g.scheduleConfig.unpublishAt),
          dateISO: g.scheduleConfig.unpublishAt,
          href: '/apps/management/gammes',
          status: g.actif ? 'Actif' : 'Inactif',
        })
      }
    }

    for (const o of offres) {
      if (!o.scheduleConfig) continue
      const gammeName = gammes.find(g => g.id === o.gammeId)?.nom
      if (o.scheduleConfig.publishAt && new Date(o.scheduleConfig.publishAt) > now) {
        items.push({
          id: o.id,
          type: 'offre',
          name: gammeName ? `${o.nom} (${gammeName})` : o.nom,
          action: 'publish',
          date: new Date(o.scheduleConfig.publishAt),
          dateISO: o.scheduleConfig.publishAt,
          href: '/apps/management/offres',
          status: o.statut,
        })
      }
      if (o.scheduleConfig.unpublishAt && new Date(o.scheduleConfig.unpublishAt) > now) {
        items.push({
          id: o.id,
          type: 'offre',
          name: gammeName ? `${o.nom} (${gammeName})` : o.nom,
          action: 'unpublish',
          date: new Date(o.scheduleConfig.unpublishAt),
          dateISO: o.scheduleConfig.unpublishAt,
          href: '/apps/management/offres',
          status: o.statut,
        })
      }
    }

    // Sort by date ascending
    items.sort((a, b) => a.date.getTime() - b.date.getTime())
    return items
  }, [gammes, offres])

  // Group by month
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, ScheduledItem[]>()
    for (const item of scheduledItems) {
      const key = item.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [scheduledItems])

  // Count items with active schedules
  const totalScheduled = gammes.filter(g => g.scheduleConfig?.publishAt || g.scheduleConfig?.unpublishAt).length
    + offres.filter(o => o.scheduleConfig?.publishAt || o.scheduleConfig?.unpublishAt).length

  const formatDate = (d: Date) =>
    d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) +
    ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const formatRelative = (d: Date) => {
    const now = new Date()
    const diff = d.getTime() - now.getTime()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return `dans ${days}j ${hours}h`
    if (hours > 0) return `dans ${hours}h`
    return 'imminent'
  }

  return (
    <PageContainer title="Planning" description="Publications et dépublications planifiées">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="admin-card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--admin-primary-surface)] flex items-center justify-center">
              <Calendar size={18} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--admin-text-primary)]">{scheduledItems.length}</p>
              <p className="text-xs text-[var(--admin-text-muted)]">Événements planifiés</p>
            </div>
          </div>
          <div className="admin-card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--admin-success)]/10 flex items-center justify-center">
              <Clock size={18} className="text-[var(--admin-success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--admin-text-primary)]">
                {scheduledItems.filter(i => i.action === 'publish').length}
              </p>
              <p className="text-xs text-[var(--admin-text-muted)]">Publications à venir</p>
            </div>
          </div>
          <div className="admin-card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--admin-warning)]/10 flex items-center justify-center">
              <Clock size={18} className="text-[var(--admin-warning)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--admin-text-primary)]">
                {scheduledItems.filter(i => i.action === 'unpublish').length}
              </p>
              <p className="text-xs text-[var(--admin-text-muted)]">Dépublications à venir</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {scheduledItems.length === 0 ? (
          <div className="admin-card text-center py-16">
            <Calendar size={40} className="mx-auto text-[var(--admin-text-muted)] mb-4" />
            <p className="text-sm font-medium text-[var(--admin-text-secondary)]">Aucune planification</p>
            <p className="text-xs text-[var(--admin-text-muted)] mt-1">
              Configurez des dates de publication/dépublication sur les gammes et offres
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByMonth.map(([month, items]) => (
              <div key={month}>
                <h3 className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-3 px-1">
                  {month}
                </h3>
                <div className="space-y-2">
                  {items.map((item, i) => {
                    const scheduleStatus = item.type === 'gamme'
                      ? getScheduleStatus(gammes.find(g => g.id === item.id)?.scheduleConfig)
                      : getScheduleStatus(offres.find(o => o.id === item.id)?.scheduleConfig)

                    return (
                      <button
                        key={`${item.id}-${item.action}-${i}`}
                        onClick={() => navigate(item.href)}
                        className="w-full admin-card !p-4 flex items-center gap-4 hover:border-[var(--admin-primary)]/30 transition-all text-left"
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.action === 'publish'
                            ? 'bg-[var(--admin-success)]/10'
                            : 'bg-[var(--admin-warning)]/10'
                        }`}>
                          {item.type === 'gamme'
                            ? <Layers size={16} className={item.action === 'publish' ? 'text-[var(--admin-success)]' : 'text-[var(--admin-warning)]'} />
                            : <Package size={16} className={item.action === 'publish' ? 'text-[var(--admin-success)]' : 'text-[var(--admin-warning)]'} />
                          }
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{item.name}</p>
                            <AdminBadge variant={item.action === 'publish' ? 'success' : 'warning'}>
                              {item.action === 'publish' ? 'Publication' : 'Dépublication'}
                            </AdminBadge>
                            {scheduleStatus && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${scheduleStatus.className}`}>
                                {scheduleStatus.label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
                            {formatDate(item.date)} — <span className="font-medium">{formatRelative(item.date)}</span>
                          </p>
                        </div>

                        <ArrowRight size={16} className="text-[var(--admin-text-muted)] shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="admin-card !p-4 flex items-start gap-3">
          <Clock size={16} className="text-[var(--admin-info)] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-[var(--admin-text-secondary)]">
              {totalScheduled} élément{totalScheduled !== 1 ? 's' : ''} avec planification active
            </p>
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
              Le système vérifie les planifications toutes les 60 secondes lorsque le panel est ouvert.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
