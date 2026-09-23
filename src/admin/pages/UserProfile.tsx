import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminBadge } from '../components/AdminBadge'
import { SpotlightCard } from '../components/reactbits'
import { User, ShieldCheck, Mail, Clock, ArrowLeft } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import type { HistoryEntry } from '../lib/types'

const entityTypeLabels: Record<HistoryEntry['entityType'], string> = {
  gamme: 'Gamme', offre: 'Offre', faq: 'FAQ', navigation: 'Navigation', annonce: 'Annonce', equipe: 'Equipe', hero: 'Hero', settings: 'Settings', maintenance: 'Maintenance', seo: 'SEO',
}
const entityTypeBadgeVariant: Record<HistoryEntry['entityType'], 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange'> = {
  gamme: 'orange', offre: 'info', faq: 'neutral', navigation: 'warning', annonce: 'success', equipe: 'info', hero: 'orange', settings: 'neutral', maintenance: 'danger', seo: 'info',
}
const actionLabels: Record<HistoryEntry['action'], string> = { create: 'Création', update: 'Modification', delete: 'Suppression' }
const actionBadgeVariant: Record<HistoryEntry['action'], 'success' | 'warning' | 'danger'> = { create: 'success', update: 'warning', delete: 'danger' }

function formatTimestamp(iso: string): string {
  try { return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return iso }
}

function formatDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) } catch { return iso }
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const { adminUsers, adminRoles, history } = useAdmin()

  const user = adminUsers.find(u => u.id === id)
  const role = adminRoles.find(r => r.id === user?.roleId)

  const userHistory = useMemo(() => {
    if (!id) return []
    return history
      .filter(h => h.userId === id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)
  }, [history, id])

  if (!user) {
    return (
      <PageContainer title="Utilisateur" description="Profil administrateur">
        <SpotlightCard className="!p-8 text-center">
          <User size={32} className="mx-auto mb-3 text-[var(--admin-text-muted)]" />
          <p className="text-sm text-[var(--admin-text-muted)]">Utilisateur introuvable.</p>
          <Link to="/apps/management/historique" className="mt-4 inline-block text-sm text-[var(--admin-primary)] hover:underline">
            Retour à l'historique
          </Link>
        </SpotlightCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={user.displayName}
      description="Profil administrateur"
      actions={
        <Link to="/apps/management/historique">
          <AdminButton variant="secondary" icon={<ArrowLeft size={14} />}>Retour</AdminButton>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-6">
          <SpotlightCard className="!p-6">
            <div className="flex flex-col items-center text-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--admin-border)] mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[var(--admin-primary-surface)] flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[var(--admin-primary)]">
                    {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-bold text-[var(--admin-text-primary)]">{user.displayName}</h2>
              {role && (
                <AdminBadge variant="orange">{role.name}</AdminBadge>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={14} className="text-[var(--admin-text-muted)] shrink-0" />
                <span className="text-[var(--admin-text-secondary)] truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck size={14} className="text-[var(--admin-text-muted)] shrink-0" />
                <span className="text-[var(--admin-text-secondary)]">{role?.name ?? 'Non assigné'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={14} className="text-[var(--admin-text-muted)] shrink-0" />
                <span className="text-[var(--admin-text-secondary)]">Inscrit le {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right: Activity */}
        <div className="lg:col-span-2">
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary)]/10 flex items-center justify-center">
                <Clock size={14} className="text-[var(--admin-primary)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Activité récente</h3>
              <span className="text-xs text-[var(--admin-text-muted)]">({userHistory.length} actions)</span>
            </div>

            {userHistory.length === 0 ? (
              <div className="py-12 text-center">
                <Clock size={24} className="mx-auto text-[var(--admin-text-muted)] mb-2" />
                <p className="text-sm text-[var(--admin-text-muted)]">Aucune activité enregistrée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)]">
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-4 py-2.5">Date</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-4 py-2.5">Type</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-4 py-2.5">Action</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-4 py-2.5">Élément</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userHistory.map(entry => (
                      <tr key={entry.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface)] transition-colors">
                        <td className="px-4 py-2.5 text-[var(--admin-text-secondary)] whitespace-nowrap font-mono text-xs">{formatTimestamp(entry.timestamp)}</td>
                        <td className="px-4 py-2.5"><AdminBadge variant={entityTypeBadgeVariant[entry.entityType]}>{entityTypeLabels[entry.entityType]}</AdminBadge></td>
                        <td className="px-4 py-2.5"><AdminBadge variant={actionBadgeVariant[entry.action]}>{actionLabels[entry.action]}</AdminBadge></td>
                        <td className="px-4 py-2.5 text-[var(--admin-text-primary)] font-medium max-w-xs truncate">{entry.entityName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </PageContainer>
  )
}
