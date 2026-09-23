import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../lib/context'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { PageContainer } from '../components/PageContainer'
import { SpotlightCard } from '../components/reactbits'
import { ActivityChart, DistributionChart } from '../components/charts'
import { HealthChecks } from '../components/dashboard/HealthChecks'
import { ContentFreshness } from '../components/dashboard/ContentFreshness'
import { CatalogSummary } from '../components/dashboard/CatalogSummary'
import { Layers, Package, Activity, TrendingUp, History, Star, Users, Megaphone } from 'lucide-react'

const actionLabels: Record<string, string> = {
  create: 'Creation',
  update: 'Modification',
  delete: 'Suppression',
}

const actionVariants: Record<string, 'success' | 'warning' | 'danger'> = {
  create: 'success',
  update: 'warning',
  delete: 'danger',
}

const periodOptions = [
  { value: 7, label: '7j' },
  { value: 14, label: '14j' },
  { value: 30, label: '30j' },
] as const

function formatRelativeTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "A l'instant"
  if (diffMins < 60) return `Il y a ${diffMins}min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Il y a ${diffHours}h`
  return `Il y a ${Math.floor(diffHours / 24)}j`
}

export default function Dashboard() {
  const { gammes, offres, history, team, annonces } = useAdmin()
  const [activityPeriod, setActivityPeriod] = useState(7)
  const [activityUser, setActivityUser] = useState<string>('all')

  const gammesActives = gammes.filter(g => g.actif).length
  const offresActives = offres.filter(o => o.statut === 'actif').length
  const recentHistory = history.slice(0, 8)

  // Unique users from history
  const historyUsers = useMemo(() => {
    const users = new Set<string>()
    for (const e of history) {
      if (e.userName) users.add(e.userName)
    }
    return Array.from(users).sort()
  }, [history])

  // Chart data: offres per gamme
  const distributionData = useMemo(() => {
    const colors = ['#FF6A30', '#3b82f6', '#22c55e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6']
    return gammes
      .filter(g => g.actif)
      .map((g, i) => ({
        name: g.shortName || g.nom,
        value: offres.filter(o => o.gammeId === g.id && o.statut === 'actif').length,
        color: colors[i % colors.length],
      }))
      .filter(d => d.value > 0)
  }, [gammes, offres])

  // Chart data: activity with selectable period & user filter
  const activityData = useMemo(() => {
    const days = Array.from({ length: activityPeriod }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (activityPeriod - 1 - i))
      return {
        label: activityPeriod <= 7
          ? d.toLocaleDateString('fr-FR', { weekday: 'short' })
          : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        date: d.toISOString().split('T')[0],
        value: 0,
      }
    })
    const filtered = activityUser === 'all' ? history : history.filter(e => e.userName === activityUser)
    for (const entry of filtered) {
      const entryDate = entry.timestamp.split('T')[0]
      const day = days.find(d => d.date === entryDate)
      if (day) day.value++
    }
    return days.map(d => ({ label: d.label, value: d.value }))
  }, [history, activityPeriod, activityUser])

  return (
    <PageContainer
      title="Dashboard"
      description="Vue d'ensemble de votre catalogue LKL Cloud"
    >
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard label="Gammes" value={gammes.length} icon={<Layers size={20} />} color="orange" index={0} />
          <KPICard label="Gammes actives" value={gammesActives} icon={<Activity size={20} />} color="green" index={1} />
          <KPICard label="Total offres" value={offres.length} icon={<Package size={20} />} color="cyan" index={2} />
          <KPICard label="Offres actives" value={offresActives} icon={<TrendingUp size={20} />} color="blue" index={3} />
          <KPICard label="Membres" value={team.length} icon={<Users size={20} />} color="yellow" index={4} />
          <KPICard label="Annonces" value={annonces.length} icon={<Megaphone size={20} />} color="orange" index={5} />
        </div>

        {/* Health Checks */}
        <HealthChecks />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Activity chart with period selector & user filter */}
            <SpotlightCard className="!p-5">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">
                  Activite des {activityPeriod} derniers jours
                </h3>
                <div className="flex items-center gap-2">
                  {historyUsers.length > 1 && (
                    <select
                      value={activityUser}
                      onChange={e => setActivityUser(e.target.value)}
                      className="text-xs rounded-lg border border-[var(--admin-border)] bg-[var(--admin-input-bg)] px-2 py-1.5 text-[var(--admin-text-secondary)] outline-none"
                    >
                      <option value="all">Tous</option>
                      {historyUsers.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  )}
                  <div className="flex rounded-lg border border-[var(--admin-border)] overflow-hidden">
                    {periodOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setActivityPeriod(opt.value)}
                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                          activityPeriod === opt.value
                            ? 'bg-[var(--admin-primary)] text-white'
                            : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <ActivityChart data={activityData} title="" bare />
            </SpotlightCard>
          </div>
          <DistributionChart data={distributionData} title="Offres par gamme" />
        </div>

        {/* Catalog + Freshness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CatalogSummary />
          <ContentFreshness />
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent gammes */}
          <SpotlightCard className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Gammes recentes</h3>
              <Layers size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <div className="space-y-1">
              {gammes.slice(0, 5).map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between py-2.5 border-b border-[var(--admin-border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary-surface)] flex items-center justify-center">
                      <Layers size={14} className="text-[var(--admin-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--admin-text-primary)]">{g.nom}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">/{g.slug}</p>
                    </div>
                  </div>
                  <AdminBadge variant={g.actif ? 'success' : 'neutral'}>{g.actif ? 'Actif' : 'Inactif'}</AdminBadge>
                </motion.div>
              ))}
              {gammes.length === 0 && (
                <p className="text-sm text-[var(--admin-text-muted)] text-center py-6">Aucune gamme</p>
              )}
            </div>
          </SpotlightCard>

          {/* Recent activity + Popular offres */}
          <SpotlightCard className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Activite recente</h3>
              <History size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <div className="space-y-1">
              {recentHistory.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between py-2.5 border-b border-[var(--admin-border)] last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AdminBadge variant={actionVariants[entry.action] ?? 'neutral'} size="sm">
                      {actionLabels[entry.action] ?? entry.action}
                    </AdminBadge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate">{entry.entityName}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">
                        {entry.entityType}
                        {entry.userName && <span className="ml-1 opacity-60">par {entry.userName}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--admin-text-muted)] whitespace-nowrap ml-2">{formatRelativeTime(entry.timestamp)}</span>
                </motion.div>
              ))}
              {recentHistory.length === 0 && (
                <p className="text-sm text-[var(--admin-text-muted)] text-center py-6">Aucune activite recente</p>
              )}

              {/* Popular offres */}
              {offres.filter(o => o.misEnAvant).length > 0 && (
                <div className="pt-3 mt-2 border-t border-[var(--admin-border)]">
                  <p className="text-[10px] font-bold text-[var(--admin-text-muted)] mb-3 uppercase tracking-wider">Offres populaires</p>
                  {offres.filter(o => o.misEnAvant).slice(0, 3).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-[var(--admin-border)] last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-[var(--admin-text-primary)]">
                          {o.nom}
                          <Star size={12} className="inline ml-1.5 text-[var(--admin-warning)] fill-[var(--admin-warning)]" />
                        </p>
                        <p className="text-xs text-[var(--admin-text-muted)]">{o.prix.mensuel?.toFixed(2)}&euro;/mois</p>
                      </div>
                      <AdminBadge variant="orange" size="sm">Mis en avant</AdminBadge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </PageContainer>
  )
}
