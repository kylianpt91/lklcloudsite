import type { DiffField } from '../lib/types'

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.length === 0 ? '(vide)' : value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

export function computeDiff(
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>,
): DiffField[] {
  const fields: DiffField[] = []
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)])

  // Skip metadata fields
  const skip = new Set(['id', 'createdAt', 'updatedAt'])

  for (const key of allKeys) {
    if (skip.has(key)) continue
    const oldVal = oldData[key]
    const newVal = newData[key]

    if (!(key in oldData)) {
      fields.push({ field: key, oldValue: undefined, newValue: newVal, type: 'added' })
    } else if (!(key in newData)) {
      fields.push({ field: key, oldValue: oldVal, newValue: undefined, type: 'removed' })
    } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      fields.push({ field: key, oldValue: oldVal, newValue: newVal, type: 'changed' })
    }
  }

  return fields
}

interface DiffViewProps {
  diff: DiffField[]
}

export function DiffView({ diff }: DiffViewProps) {
  if (diff.length === 0) {
    return (
      <p className="text-sm text-[var(--admin-text-muted)] text-center py-4">
        Aucune différence détectée
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {diff.map((d, i) => (
        <div key={i} className="rounded-xl border border-[var(--admin-border)] overflow-hidden">
          <div className="px-3 py-1.5 bg-[var(--admin-surface)] border-b border-[var(--admin-border)]">
            <span className="text-xs font-semibold text-[var(--admin-text-secondary)]">{d.field}</span>
            <span className={`ml-2 text-[10px] font-bold uppercase ${
              d.type === 'added' ? 'text-[var(--admin-success)]'
                : d.type === 'removed' ? 'text-[var(--admin-danger)]'
                : 'text-[var(--admin-warning)]'
            }`}>
              {d.type === 'added' ? 'Ajouté' : d.type === 'removed' ? 'Supprimé' : 'Modifié'}
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[var(--admin-border)]">
            {d.type !== 'added' && (
              <div className="px-3 py-2 bg-[var(--admin-danger)]/5">
                <p className="text-[10px] font-bold text-[var(--admin-danger)] mb-1">Avant</p>
                <pre className="text-xs text-[var(--admin-text-secondary)] whitespace-pre-wrap break-words font-mono">
                  {formatValue(d.oldValue)}
                </pre>
              </div>
            )}
            {d.type !== 'removed' && (
              <div className={`px-3 py-2 bg-[var(--admin-success)]/5 ${d.type === 'added' ? 'col-span-2' : ''}`}>
                <p className="text-[10px] font-bold text-[var(--admin-success)] mb-1">Après</p>
                <pre className="text-xs text-[var(--admin-text-secondary)] whitespace-pre-wrap break-words font-mono">
                  {formatValue(d.newValue)}
                </pre>
              </div>
            )}
            {d.type === 'removed' && (
              <div className="px-3 py-2 bg-[var(--admin-surface)]">
                <p className="text-[10px] font-bold text-[var(--admin-text-muted)] mb-1">Après</p>
                <p className="text-xs text-[var(--admin-text-muted)] italic">Supprimé</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
