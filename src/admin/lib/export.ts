// ── Export utilities ──────────────────────────────────────────────

interface ExportMetadata {
  exportedAt: string
  exportedBy?: string
  version: string
  collection?: string
  count: number
}

function createMetadata(collection: string | undefined, count: number, userName?: string): ExportMetadata {
  return {
    exportedAt: new Date().toISOString(),
    exportedBy: userName,
    version: '1.0.0',
    collection,
    count,
  }
}

export function exportToJSON<T>(collectionName: string, data: T[], userName?: string): string {
  const payload = {
    _meta: createMetadata(collectionName, data.length, userName),
    data,
  }
  return JSON.stringify(payload, null, 2)
}

export function exportToCSV<T extends Record<string, unknown>>(data: T[]): string {
  if (data.length === 0) return ''

  // Flatten nested objects into dot-separated keys
  function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value as Record<string, unknown>, fullKey))
      } else if (Array.isArray(value)) {
        result[fullKey] = value.join('; ')
      } else {
        result[fullKey] = value === null || value === undefined ? '' : String(value)
      }
    }
    return result
  }

  const flattened = data.map(item => flatten(item as Record<string, unknown>))
  const headers = [...new Set(flattened.flatMap(row => Object.keys(row)))]

  const csvRows = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...flattened.map(row =>
      headers.map(h => {
        const val = row[h] ?? ''
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    ),
  ]

  return csvRows.join('\n')
}

export interface FullBackup {
  _meta: ExportMetadata
  gammes: unknown[]
  offres: unknown[]
  faq: unknown[]
  navGroups: unknown[]
  navItems: unknown[]
  annonces: unknown[]
  team: unknown[]
  heroConfig: unknown
  siteSettings: unknown
  maintenanceMode: unknown
}

export function exportAll(allData: Omit<FullBackup, '_meta'>, userName?: string): string {
  const totalCount = (allData.gammes?.length ?? 0) +
    (allData.offres?.length ?? 0) +
    (allData.faq?.length ?? 0) +
    (allData.navGroups?.length ?? 0) +
    (allData.navItems?.length ?? 0) +
    (allData.annonces?.length ?? 0) +
    (allData.team?.length ?? 0)

  const payload: FullBackup = {
    _meta: createMetadata(undefined, totalCount, userName),
    ...allData,
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
