import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { SEOConfig, SEOAuditCheck } from '@/admin/lib/types'

interface SEOAuditProps {
  config: Partial<SEOConfig>
  allConfigs: SEOConfig[]
}

function runAudit(config: Partial<SEOConfig>, allConfigs: SEOConfig[]): SEOAuditCheck[] {
  const checks: SEOAuditCheck[] = []
  const title = config.title ?? ''
  const desc = config.description ?? ''
  const keywords = config.keywords ?? []

  // Title length
  if (!title) {
    checks.push({ name: 'Titre', status: 'fail', message: 'Aucun titre défini', recommendation: 'Ajoutez un titre entre 50 et 60 caractères.' })
  } else if (title.length < 30) {
    checks.push({ name: 'Titre', status: 'warning', message: `Titre trop court (${title.length} car.)`, recommendation: 'Visez entre 50 et 60 caractères pour un titre optimal.' })
  } else if (title.length > 60) {
    checks.push({ name: 'Titre', status: 'warning', message: `Titre trop long (${title.length} car.)`, recommendation: 'Google tronque les titres au-delà de 60 caractères.' })
  } else {
    checks.push({ name: 'Titre', status: 'pass', message: `Titre OK (${title.length} car.)` })
  }

  // Description length
  if (!desc) {
    checks.push({ name: 'Description', status: 'fail', message: 'Aucune description définie', recommendation: 'Ajoutez une meta description entre 120 et 155 caractères.' })
  } else if (desc.length < 70) {
    checks.push({ name: 'Description', status: 'warning', message: `Description trop courte (${desc.length} car.)`, recommendation: 'Visez entre 120 et 155 caractères.' })
  } else if (desc.length > 155) {
    checks.push({ name: 'Description', status: 'warning', message: `Description trop longue (${desc.length} car.)`, recommendation: 'Google tronque au-delà de 155 caractères.' })
  } else {
    checks.push({ name: 'Description', status: 'pass', message: `Description OK (${desc.length} car.)` })
  }

  // Keywords
  if (keywords.length === 0) {
    checks.push({ name: 'Mots-clés', status: 'warning', message: 'Aucun mot-clé défini', recommendation: 'Ajoutez au moins 3 mots-clés pertinents.' })
  } else if (keywords.length < 3) {
    checks.push({ name: 'Mots-clés', status: 'warning', message: `Seulement ${keywords.length} mot(s)-clé(s)`, recommendation: 'Ajoutez au moins 3 mots-clés.' })
  } else {
    checks.push({ name: 'Mots-clés', status: 'pass', message: `${keywords.length} mots-clés définis` })
  }

  // OG Image
  if (config.ogImage) {
    checks.push({ name: 'Image OG', status: 'pass', message: 'Image Open Graph définie' })
  } else {
    checks.push({ name: 'Image OG', status: 'warning', message: 'Pas d\'image Open Graph', recommendation: 'Ajoutez une image 1200×630 pour les partages sociaux.' })
  }

  // Canonical URL
  if (config.canonicalUrl) {
    checks.push({ name: 'Canonical', status: 'pass', message: 'URL canonique définie' })
  } else {
    checks.push({ name: 'Canonical', status: 'warning', message: 'Pas d\'URL canonique', recommendation: 'Définissez une URL canonique pour éviter le contenu dupliqué.' })
  }

  // JSON-LD
  if (config.jsonLd) {
    try {
      JSON.parse(config.jsonLd)
      checks.push({ name: 'JSON-LD', status: 'pass', message: 'JSON-LD valide' })
    } catch {
      checks.push({ name: 'JSON-LD', status: 'fail', message: 'JSON-LD invalide', recommendation: 'Corrigez la syntaxe JSON.' })
    }
  } else {
    checks.push({ name: 'JSON-LD', status: 'warning', message: 'Pas de données structurées', recommendation: 'Ajoutez du JSON-LD pour enrichir les résultats Google.' })
  }

  // Duplicate title check
  if (title && config.pageSlug) {
    const duplicates = allConfigs.filter(c => c.pageSlug !== config.pageSlug && c.title === title)
    if (duplicates.length > 0) {
      checks.push({ name: 'Titre unique', status: 'fail', message: `Titre dupliqué avec "${duplicates[0].pageSlug}"`, recommendation: 'Chaque page doit avoir un titre unique.' })
    } else {
      checks.push({ name: 'Titre unique', status: 'pass', message: 'Titre unique' })
    }
  }

  // noIndex warning
  if (config.noIndex) {
    checks.push({ name: 'Indexation', status: 'warning', message: 'Page non indexable (noindex)', recommendation: 'Cette page ne sera pas visible dans les résultats de recherche.' })
  }

  return checks
}

function computeScore(checks: SEOAuditCheck[]): number {
  if (checks.length === 0) return 0
  const weights = { pass: 1, warning: 0.5, fail: 0 }
  const total = checks.reduce((sum, c) => sum + weights[c.status], 0)
  return Math.round((total / checks.length) * 100)
}

const statusIcons = {
  pass: <CheckCircle2 size={16} className="text-emerald-500" />,
  warning: <AlertTriangle size={16} className="text-amber-500" />,
  fail: <XCircle size={16} className="text-red-500" />,
}

export function SEOAudit({ config, allConfigs }: SEOAuditProps) {
  const checks = runAudit(config, allConfigs)
  const score = computeScore(checks)

  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const scoreBg = score >= 80 ? 'bg-emerald-500/10' : score >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Audit SEO</p>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${scoreColor} ${scoreBg}`}>
          {score}/100
        </div>
      </div>

      <div className="space-y-1.5">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[var(--admin-surface-hover)] transition-colors">
            <div className="mt-0.5 shrink-0">{statusIcons[check.status]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--admin-text-primary)]">{check.name}</p>
              <p className="text-xs text-[var(--admin-text-muted)]">{check.message}</p>
              {check.recommendation && (
                <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5 italic">{check.recommendation}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { computeScore, runAudit }
