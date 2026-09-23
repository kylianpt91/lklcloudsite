// ── Import utilities ─────────────────────────────────────────────

export interface ImportResult {
  success: boolean
  collection?: string
  data?: Record<string, unknown>[]
  error?: string
  count?: number
}

const KNOWN_COLLECTIONS = ['gammes', 'offres', 'faq', 'navGroups', 'navItems', 'annonces', 'team'] as const

const REQUIRED_FIELDS: Record<string, string[]> = {
  gammes: ['nom', 'slug', 'actif', 'ordre'],
  offres: ['nom', 'gammeId', 'statut', 'ordre'],
  faq: ['question', 'reponse', 'gammeId', 'position'],
  navGroups: ['label', 'color', 'icon', 'ordre'],
  navItems: ['label', 'href', 'groupId', 'ordre'],
  annonces: ['message', 'actif'],
  team: ['name', 'role', 'ordre'],
}

export function parseJSONImport(content: string): ImportResult {
  try {
    const parsed = JSON.parse(content)

    // Full backup format
    if (parsed._meta && !parsed.data) {
      // It's a full backup — validate it has known collection keys
      const collections = KNOWN_COLLECTIONS.filter(c => Array.isArray(parsed[c]))
      if (collections.length === 0) {
        return { success: false, error: 'Format de backup invalide : aucune collection reconnue.' }
      }
      return {
        success: true,
        collection: '_backup',
        data: parsed,
        count: collections.reduce((sum, c) => sum + (parsed[c]?.length ?? 0), 0),
      }
    }

    // Single collection format
    if (parsed._meta && Array.isArray(parsed.data)) {
      const collection = parsed._meta.collection
      return {
        success: true,
        collection: collection ?? 'unknown',
        data: parsed.data,
        count: parsed.data.length,
      }
    }

    // Raw array
    if (Array.isArray(parsed)) {
      return { success: true, data: parsed, count: parsed.length }
    }

    return { success: false, error: 'Format JSON non reconnu. Utilisez un export LKLCloud.' }
  } catch {
    return { success: false, error: 'JSON invalide. Vérifiez la syntaxe du fichier.' }
  }
}

export function parseCSVImport(content: string): ImportResult {
  try {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return { success: false, error: 'CSV vide ou avec seulement un en-tête.' }

    const headers = parseCSVLine(lines[0])
    const data: Record<string, unknown>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row: Record<string, unknown> = {}
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j]
        let value: unknown = values[j] ?? ''

        // Auto-convert numbers and booleans
        if (value === 'true') value = true
        else if (value === 'false') value = false
        else if (!isNaN(Number(value)) && (value as string).trim() !== '') value = Number(value)

        // Reconstruct nested objects from dot notation
        if (key.includes('.')) {
          const parts = key.split('.')
          let current = row
          for (let k = 0; k < parts.length - 1; k++) {
            if (!current[parts[k]]) current[parts[k]] = {}
            current = current[parts[k]] as Record<string, unknown>
          }
          current[parts[parts.length - 1]] = value
        } else {
          row[key] = value
        }
      }
      data.push(row)
    }

    return { success: true, data, count: data.length }
  } catch {
    return { success: false, error: 'Erreur lors du parsing CSV.' }
  }
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

export function validateImportData(data: Record<string, unknown>[], collectionName: string): string[] {
  const errors: string[] = []
  const required = REQUIRED_FIELDS[collectionName]

  if (!required) {
    errors.push(`Collection "${collectionName}" non reconnue.`)
    return errors
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    for (const field of required) {
      if (field.includes('.')) {
        // Check nested fields
        const parts = field.split('.')
        let current: unknown = row
        for (const part of parts) {
          current = (current as Record<string, unknown>)?.[part]
        }
        if (current === undefined || current === null || current === '') {
          errors.push(`Ligne ${i + 1}: champ "${field}" manquant`)
        }
      } else if (row[field] === undefined || row[field] === null || row[field] === '') {
        errors.push(`Ligne ${i + 1}: champ "${field}" manquant`)
      }
    }
  }

  if (errors.length > 10) {
    const totalErrors = errors.length
    errors.length = 10
    errors.push(`... et ${totalErrors - 10} autres erreurs`)
  }

  return errors
}
