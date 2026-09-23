import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminDropdown } from '../components/AdminDropdown'
import { AdminBadge } from '../components/AdminBadge'
import { SpotlightCard } from '../components/reactbits'
import { RefreshCw, Clock, Filter, User } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import type { HistoryEntry } from '../lib/types'

const entityTypeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'gamme', label: 'Gamme' },
  { value: 'offre', label: 'Offre' },
  { value: 'faq', label: 'FAQ' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'annonce', label: 'Annonce' },
  { value: 'equipe', label: 'Equipe' },
  { value: 'hero', label: 'Hero' },
  { value: 'settings', label: 'Settings' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'seo', label: 'SEO' },
]

const actionOptions = [
  { value: '', label: 'Toutes les actions' },
  { value: 'create', label: 'Création' },
  { value: 'update', label: 'Modification' },
  { value: 'delete', label: 'Suppression' },
]

const entityTypeLabels: Record<HistoryEntry['entityType'], string> = {
  gamme: 'Gamme', offre: 'Offre', faq: 'FAQ', navigation: 'Navigation', annonce: 'Annonce', equipe: 'Equipe', hero: 'Hero', settings: 'Settings', maintenance: 'Maintenance', seo: 'SEO',
}

const entityTypeBadgeVariant: Record<HistoryEntry['entityType'], 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange'> = {
  gamme: 'orange', offre: 'info', faq: 'neutral', navigation: 'warning', annonce: 'success', equipe: 'info', hero: 'orange', settings: 'neutral', maintenance: 'danger', seo: 'info',
}

const actionLabels: Record<HistoryEntry['action'], string> = { create: 'Création', update: 'Modification', delete: 'Suppression' }
const actionBadgeVariant: Record<HistoryEntry['action'], 'success' | 'warning' | 'danger'> = { create: 'success', update: 'warning', delete: 'danger' }

function formatTimestamp(iso: string): string {
  try { return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) } catch { return iso }
}

export default function Historique() {
  const { history, refreshHistory } = useAdmin()
  const [filterType, setFilterType] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    let items = [...history]
    if (filterType) items = items.filter(h => h.entityType === filterType)
    if (filterAction) items = items.filter(h => h.action === filterAction)
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return items.slice(0, 500)
  }, [history, filterType, filterAction])

  const handleRefresh = async () => { setRefreshing(true); try { await refreshHistory() } catch { /* toast */ } finally { setRefreshing(false) } }

  return (
    <PageContainer title="Historique" description="Journal de toutes les modifications effectuées dans l'administration">
      <div className="space-y-6">
        {/* Filters */}
        <SpotlightCard className="!p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary)]/10 flex items-center justify-center"><Filter size={14} className="text-[var(--admin-primary)]" /></div>
            <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Filtres</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminDropdown label="Type d'entité" value={filterType} onChange={setFilterType} options={entityTypeOptions} searchable />
            <AdminDropdown label="Action" value={filterAction} onChange={setFilterAction} options={actionOptions} />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-[var(--admin-text-muted)]">{filtered.length} entrée{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}</p>
            <AdminButton variant="secondary" size="sm" onClick={handleRefresh} loading={refreshing} icon={<RefreshCw size={14} />}>Rafraîchir</AdminButton>
          </div>
        </SpotlightCard>

        {/* Table */}
        <div className="admin-card rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--admin-surface)] flex items-center justify-center mb-3"><Clock size={20} className="text-[var(--admin-text-muted)]" /></div>
              <p className="text-sm text-[var(--admin-text-muted)] font-medium">Aucune entrée trouvée</p>
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">Modifiez les filtres ou attendez de nouvelles actions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">Date/heure</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">Utilisateur</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">Action</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">Élément</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entry => (
                    <tr key={entry.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface)] transition-colors duration-200">
                      <td className="px-5 py-3 text-[var(--admin-text-secondary)] whitespace-nowrap font-mono text-xs">{formatTimestamp(entry.timestamp)}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {entry.userId ? (
                          <Link to={`/apps/management/utilisateur/${entry.userId}`} className="flex items-center gap-2 group">
                            {entry.userAvatar ? (
                              <img src={entry.userAvatar} alt={entry.userName ?? ''} className="w-6 h-6 rounded-full object-cover border border-[var(--admin-border)] shrink-0" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[var(--admin-primary-surface)] flex items-center justify-center shrink-0">
                                <User size={10} className="text-[var(--admin-primary)]" />
                              </div>
                            )}
                            <span className="text-xs text-[var(--admin-text-secondary)] group-hover:text-[var(--admin-primary)] transition-colors">{entry.userName ?? '—'}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-[var(--admin-text-muted)]">{entry.userName ?? 'Système'}</span>
                        )}
                      </td>
                      <td className="px-5 py-3"><AdminBadge variant={entityTypeBadgeVariant[entry.entityType]}>{entityTypeLabels[entry.entityType]}</AdminBadge></td>
                      <td className="px-5 py-3"><AdminBadge variant={actionBadgeVariant[entry.action]}>{actionLabels[entry.action]}</AdminBadge></td>
                      <td className="px-5 py-3 text-[var(--admin-text-primary)] font-medium max-w-xs truncate">{entry.entityName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
