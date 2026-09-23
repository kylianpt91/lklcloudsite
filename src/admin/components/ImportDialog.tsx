import { useState, useRef } from 'react'
import { useAdmin } from '../lib/context'
import { AdminDialog } from './AdminDialog'
import { AdminButton } from './AdminButton'
import { AdminDropdown } from './AdminDropdown'
import { Upload, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import { parseJSONImport, parseCSVImport, validateImportData } from '../lib/import'
import type { ImportResult } from '../lib/import'

const COLLECTION_OPTIONS = [
  { value: 'gammes', label: 'Gammes' },
  { value: 'offres', label: 'Offres' },
  { value: 'faq', label: 'FAQ' },
  { value: 'navGroups', label: 'Groupes de navigation' },
  { value: 'navItems', label: 'Liens de navigation' },
  { value: 'annonces', label: 'Annonces' },
  { value: 'team', label: 'Équipe' },
]

interface ImportDialogProps {
  open: boolean
  onClose: () => void
}

export function ImportDialog({ open, onClose }: ImportDialogProps) {
  const { addGamme, addOffre, addFAQ, addNavGroup, addNavItem, addAnnonce, addTeamMember, addToast } = useAdmin()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<ImportResult | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [targetCollection, setTargetCollection] = useState('gammes')
  const [importing, setImporting] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setValidationErrors([])

    const content = await f.text()
    const isCSV = f.name.endsWith('.csv')
    const result = isCSV ? parseCSVImport(content) : parseJSONImport(content)
    setParseResult(result)

    // Auto-detect collection from JSON metadata
    if (result.success && result.collection && result.collection !== '_backup' && result.collection !== 'unknown') {
      setTargetCollection(result.collection)
    }
  }

  const handleValidate = () => {
    if (!parseResult?.success || !parseResult.data) return
    const data = Array.isArray(parseResult.data) ? parseResult.data : []
    if (data.length === 0) {
      setValidationErrors(['Aucune donnée à importer.'])
      return
    }
    const errors = validateImportData(data as Record<string, unknown>[], targetCollection)
    setValidationErrors(errors)
  }

  const handleImport = async () => {
    if (!parseResult?.success || !parseResult.data) return
    const data = Array.isArray(parseResult.data) ? parseResult.data : []
    if (data.length === 0) return

    setImporting(true)
    try {
      let imported = 0
      for (const item of data) {
        const record = item as Record<string, unknown>
        // Strip id, createdAt, updatedAt — they'll be regenerated
        const { id: _id, createdAt: _c, updatedAt: _u, ...cleanData } = record

        switch (targetCollection) {
          case 'gammes':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addGamme(cleanData as any)
            break
          case 'offres':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addOffre(cleanData as any)
            break
          case 'faq':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addFAQ(cleanData as any)
            break
          case 'navGroups':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addNavGroup(cleanData as any)
            break
          case 'navItems':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addNavItem(cleanData as any)
            break
          case 'annonces':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addAnnonce(cleanData as any)
            break
          case 'team':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addTeamMember(cleanData as any)
            break
        }
        imported++
      }
      addToast('success', `${imported} élément${imported > 1 ? 's' : ''} importé${imported > 1 ? 's' : ''} dans ${targetCollection}`)
      handleReset()
      onClose()
    } catch (err) {
      addToast('error', `Erreur import: ${err instanceof Error ? err.message : 'Inconnue'}`)
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParseResult(null)
    setValidationErrors([])
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <AdminDialog open={open} onClose={onClose} title="Importer des données" description="Importez un fichier JSON ou CSV dans une collection" size="md">
      <div className="space-y-5">
        {/* Dropzone */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[var(--admin-border)] rounded-2xl p-8 text-center cursor-pointer hover:border-[var(--admin-primary)]/40 hover:bg-[var(--admin-primary-surface)] transition-all"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={20} className="text-[var(--admin-primary)]" />
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--admin-text-primary)]">{file.name}</p>
                <p className="text-xs text-[var(--admin-text-muted)]">{(file.size / 1024).toFixed(1)} Ko</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleReset() }} className="text-xs text-[var(--admin-danger)] hover:underline ml-2">Retirer</button>
            </div>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-[var(--admin-text-muted)] mb-2" />
              <p className="text-sm text-[var(--admin-text-secondary)]">Cliquez pour sélectionner un fichier</p>
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">JSON ou CSV</p>
            </>
          )}
        </div>

        {/* Parse result status */}
        {parseResult && (
          <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
            parseResult.success
              ? 'bg-[var(--admin-success)]/10 text-[var(--admin-success)]'
              : 'bg-[var(--admin-danger)]/10 text-[var(--admin-danger)]'
          }`}>
            {parseResult.success ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
            <span>{parseResult.success ? `${parseResult.count} élément${(parseResult.count ?? 0) > 1 ? 's' : ''} détecté${(parseResult.count ?? 0) > 1 ? 's' : ''}` : parseResult.error}</span>
          </div>
        )}

        {/* Target collection */}
        {parseResult?.success && parseResult.collection !== '_backup' && (
          <AdminDropdown
            label="Collection cible"
            value={targetCollection}
            onChange={setTargetCollection}
            options={COLLECTION_OPTIONS}
          />
        )}

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] text-xs space-y-1">
            <p className="font-semibold flex items-center gap-1"><AlertTriangle size={12} /> Problèmes détectés :</p>
            {validationErrors.map((err, i) => <p key={i}>- {err}</p>)}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
          <AdminButton variant="secondary" onClick={onClose}>Annuler</AdminButton>
          {parseResult?.success && parseResult.collection !== '_backup' && (
            <AdminButton variant="warning" onClick={handleValidate}>Valider</AdminButton>
          )}
          {parseResult?.success && parseResult.collection !== '_backup' && (
            <AdminButton onClick={handleImport} loading={importing} icon={<Upload size={14} />}>
              Importer
            </AdminButton>
          )}
        </div>
      </div>
    </AdminDialog>
  )
}
