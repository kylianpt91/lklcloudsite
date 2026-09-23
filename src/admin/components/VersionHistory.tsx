import { useState, useEffect } from 'react'
import { AdminDialog } from './AdminDialog'
import { AdminButton } from './AdminButton'
import { DiffView, computeDiff } from './DiffView'
import { ConfirmDialog } from './ConfirmDialog'
import { fetchVersionsFS } from '../lib/db'
import { History, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import type { ContentVersion, HistoryEntry } from '../lib/types'

interface VersionHistoryProps {
  open: boolean
  onClose: () => void
  entityId: string
  entityType: HistoryEntry['entityType']
  entityName: string
  currentData: Record<string, unknown>
  onRestore: (data: Record<string, unknown>) => Promise<void>
}

export function VersionHistory({
  open,
  onClose,
  entityId,
  entityType,
  entityName,
  currentData,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState<ContentVersion | null>(null)

  useEffect(() => {
    if (!open || !entityId) return
    setLoading(true)
    fetchVersionsFS(entityId, entityType)
      .then(data => setVersions(data))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false))
  }, [open, entityId, entityType])

  const handleRestore = async (version: ContentVersion) => {
    setRestoring(true)
    try {
      await onRestore(version.data)
      setConfirmRestore(null)
      onClose()
    } catch {
      // error handled by parent
    } finally {
      setRestoring(false)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <AdminDialog
        open={open}
        onClose={onClose}
        title={`Historique — ${entityName}`}
        description="Versions précédentes avec diff et restauration"
        size="lg"
      >
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[var(--admin-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <History size={32} className="mx-auto text-[var(--admin-text-muted)] mb-3" />
              <p className="text-sm text-[var(--admin-text-muted)]">
                Aucune version enregistrée
              </p>
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                Les versions sont créées automatiquement lors des modifications
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {versions.map((v, i) => {
                const isExpanded = expandedId === v.id
                // Diff: compare this version's data with the next (older) version, or with current if it's the latest
                const compareWith = i === 0 ? currentData : versions[i - 1].data
                const diff = computeDiff(v.data, compareWith)
                const changedCount = diff.length

                return (
                  <div
                    key={v.id}
                    className="rounded-xl border border-[var(--admin-border)] overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--admin-surface)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--admin-primary-surface)] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[var(--admin-primary)]">v{v.version}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                            Version {v.version}
                          </p>
                          {changedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] font-semibold">
                              {changedCount} champ{changedCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--admin-text-muted)]">
                          {formatDate(v.createdAt)}
                          {v.createdByName && ` — ${v.createdByName}`}
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-[var(--admin-text-muted)]" /> : <ChevronDown size={16} className="text-[var(--admin-text-muted)]" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[var(--admin-border)] px-4 py-3 space-y-3">
                        <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
                          {i === 0 ? 'Différences avec la version actuelle' : `Différences avec v${versions[i - 1].version}`}
                        </p>
                        <DiffView diff={diff} />
                        <div className="flex justify-end pt-2">
                          <AdminButton
                            variant="warning"
                            onClick={() => setConfirmRestore(v)}
                            icon={<RotateCcw size={14} />}
                          >
                            Restaurer v{v.version}
                          </AdminButton>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AdminDialog>

      <ConfirmDialog
        open={confirmRestore !== null}
        onCancel={() => setConfirmRestore(null)}
        onConfirm={() => confirmRestore && handleRestore(confirmRestore)}
        title={`Restaurer la version ${confirmRestore?.version} ?`}
        message="Les données actuelles seront remplacées par celles de cette version. Une nouvelle version sera créée automatiquement."
        loading={restoring}
      />
    </>
  )
}
