import { Calendar, Clock } from 'lucide-react'
import type { ScheduleConfig } from '../lib/types'

interface ScheduleFieldsProps {
  value: ScheduleConfig
  onChange: (config: ScheduleConfig) => void
}

export function ScheduleFields({ value, onChange }: ScheduleFieldsProps) {
  const toDatetimeLocal = (iso?: string) => {
    if (!iso) return ''
    return iso.slice(0, 16) // "YYYY-MM-DDTHH:mm"
  }

  const fromDatetimeLocal = (val: string) => {
    if (!val) return undefined
    return new Date(val).toISOString()
  }

  const publishStatus = getScheduleStatus(value)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={14} className="text-[var(--admin-primary)]" />
        <span className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
          Planification
        </span>
        {publishStatus && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${publishStatus.className}`}>
            {publishStatus.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--admin-text-secondary)] mb-1.5">
            <Calendar size={12} className="inline mr-1" />
            Publication automatique
          </label>
          <input
            type="datetime-local"
            value={toDatetimeLocal(value.publishAt)}
            onChange={e => onChange({ ...value, publishAt: fromDatetimeLocal(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-sm text-[var(--admin-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/30 focus:border-[var(--admin-primary)]/50 transition-all"
          />
          {value.publishAt && (
            <button
              onClick={() => onChange({ ...value, publishAt: undefined })}
              className="text-[10px] text-[var(--admin-danger)] hover:underline mt-1"
            >
              Retirer
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--admin-text-secondary)] mb-1.5">
            <Calendar size={12} className="inline mr-1" />
            Dépublication automatique
          </label>
          <input
            type="datetime-local"
            value={toDatetimeLocal(value.unpublishAt)}
            onChange={e => onChange({ ...value, unpublishAt: fromDatetimeLocal(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-sm text-[var(--admin-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/30 focus:border-[var(--admin-primary)]/50 transition-all"
          />
          {value.unpublishAt && (
            <button
              onClick={() => onChange({ ...value, unpublishAt: undefined })}
              className="text-[10px] text-[var(--admin-danger)] hover:underline mt-1"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      {value.publishAt && value.unpublishAt && new Date(value.publishAt) >= new Date(value.unpublishAt) && (
        <p className="text-xs text-[var(--admin-danger)]">
          La date de dépublication doit être après la date de publication.
        </p>
      )}
    </div>
  )
}

export function getScheduleStatus(config?: ScheduleConfig): { label: string; className: string } | null {
  if (!config) return null
  const now = new Date()

  if (config.publishAt && new Date(config.publishAt) > now) {
    return {
      label: `Planifié ${new Date(config.publishAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`,
      className: 'bg-[var(--admin-info-surface)] text-[var(--admin-info)]',
    }
  }

  if (config.unpublishAt && new Date(config.unpublishAt) > now) {
    return {
      label: `Expire ${new Date(config.unpublishAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`,
      className: 'bg-[var(--admin-warning)]/10 text-[var(--admin-warning)]',
    }
  }

  if (config.unpublishAt && new Date(config.unpublishAt) <= now) {
    return {
      label: 'Expiré',
      className: 'bg-[var(--admin-danger)]/10 text-[var(--admin-danger)]',
    }
  }

  return null
}
