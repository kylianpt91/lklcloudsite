import { useState } from 'react'
import { useAdmin } from '../lib/context'
import { AdminDialog } from './AdminDialog'
import { AdminButton } from './AdminButton'
import { AdminCheckbox } from './FormFields'
import { Download } from 'lucide-react'
import { exportToJSON, exportToCSV, exportAll, downloadFile } from '../lib/export'

const COLLECTIONS = [
  { key: 'gammes', label: 'Gammes' },
  { key: 'offres', label: 'Offres' },
  { key: 'faq', label: 'FAQ' },
  { key: 'navGroups', label: 'Groupes de navigation' },
  { key: 'navItems', label: 'Liens de navigation' },
  { key: 'annonces', label: 'Annonces' },
  { key: 'team', label: 'Équipe' },
] as const

interface ExportDialogProps {
  open: boolean
  onClose: () => void
}

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const { gammes, offres, faq, navGroups, navItems, annonces, team, heroConfig, siteSettings, maintenanceMode, currentUser } = useAdmin()
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set(COLLECTIONS.map(c => c.key)))
  const [format, setFormat] = useState<'json' | 'csv'>('json')

  const dataMap: Record<string, unknown[]> = {
    gammes, offres, faq, navGroups, navItems, annonces, team,
  }

  const toggleCollection = (key: string) => {
    setSelectedCollections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectAll = () => {
    if (selectedCollections.size === COLLECTIONS.length) setSelectedCollections(new Set())
    else setSelectedCollections(new Set(COLLECTIONS.map(c => c.key)))
  }

  const handleExportAll = () => {
    const content = exportAll({
      gammes, offres, faq, navGroups, navItems, annonces, team,
      heroConfig, siteSettings, maintenanceMode,
    }, currentUser?.displayName)
    const date = new Date().toISOString().slice(0, 10)
    downloadFile(content, `lklcloud-backup-${date}.json`, 'application/json')
    onClose()
  }

  const handleExportSelected = () => {
    const userName = currentUser?.displayName
    const date = new Date().toISOString().slice(0, 10)

    if (selectedCollections.size === 0) return

    if (format === 'json') {
      // If only one collection selected, export just that one
      if (selectedCollections.size === 1) {
        const key = [...selectedCollections][0]
        const data = dataMap[key] ?? []
        const content = exportToJSON(key, data as Record<string, unknown>[], userName)
        downloadFile(content, `lklcloud-${key}-${date}.json`, 'application/json')
      } else {
        // Multiple collections → full backup style
        const payload: Record<string, unknown> = {}
        for (const key of selectedCollections) {
          payload[key] = dataMap[key] ?? []
        }
        const content = exportAll(payload as Parameters<typeof exportAll>[0], userName)
        downloadFile(content, `lklcloud-export-${date}.json`, 'application/json')
      }
    } else {
      // CSV: export each collection as a separate file download
      for (const key of selectedCollections) {
        const data = dataMap[key] ?? []
        if (data.length === 0) continue
        const content = exportToCSV(data as Record<string, unknown>[])
        downloadFile(content, `lklcloud-${key}-${date}.csv`, 'text/csv')
      }
    }

    onClose()
  }

  const totalItems = [...selectedCollections].reduce((sum, key) => sum + (dataMap[key]?.length ?? 0), 0)

  return (
    <AdminDialog open={open} onClose={onClose} title="Exporter les données" description="Téléchargez vos données au format JSON ou CSV" size="md">
      <div className="space-y-5">
        {/* Format selector */}
        <div>
          <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">Format</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                format === 'json'
                  ? 'bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] border border-[var(--admin-primary)]/30'
                  : 'text-[var(--admin-text-muted)] border border-[var(--admin-border)] hover:bg-[var(--admin-surface)]'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                format === 'csv'
                  ? 'bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] border border-[var(--admin-primary)]/30'
                  : 'text-[var(--admin-text-muted)] border border-[var(--admin-border)] hover:bg-[var(--admin-surface)]'
              }`}
            >
              CSV
            </button>
          </div>
        </div>

        {/* Collections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Collections</p>
            <button onClick={selectAll} className="text-xs text-[var(--admin-primary)] hover:underline">
              {selectedCollections.size === COLLECTIONS.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
          <div className="space-y-2">
            {COLLECTIONS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
                <AdminCheckbox
                  label={label}
                  checked={selectedCollections.has(key)}
                  onChange={() => toggleCollection(key)}
                />
                <span className="text-xs text-[var(--admin-text-muted)] font-mono">{dataMap[key]?.length ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-[var(--admin-text-muted)]">
          {totalItems} élément{totalItems > 1 ? 's' : ''} dans {selectedCollections.size} collection{selectedCollections.size > 1 ? 's' : ''}
        </p>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-[var(--admin-border)]">
          <AdminButton variant="secondary" onClick={handleExportAll} icon={<Download size={14} />}>
            Backup complet
          </AdminButton>
          <div className="flex gap-3">
            <AdminButton variant="secondary" onClick={onClose}>Annuler</AdminButton>
            <AdminButton onClick={handleExportSelected} disabled={selectedCollections.size === 0} icon={<Download size={14} />}>
              Exporter ({format.toUpperCase()})
            </AdminButton>
          </div>
        </div>
      </div>
    </AdminDialog>
  )
}
