import { AdminInput, AdminTextarea, AdminSelect, AdminTagInput, AdminSwitch } from '../FormFields'
import { SERPPreview } from './SERPPreview'
import { SEOAudit } from './SEOAudit'
import type { SEOConfig } from '@/admin/lib/types'

interface SEOFormProps {
  form: Partial<SEOConfig>
  onChange: (updates: Partial<SEOConfig>) => void
  allConfigs: SEOConfig[]
  isNew?: boolean
}

const pageTypeOptions = [
  { value: 'home', label: 'Accueil' },
  { value: 'product', label: 'Page produit' },
  { value: 'legal', label: 'Page légale' },
  { value: 'case-study', label: 'Étude de cas' },
  { value: 'other', label: 'Autre' },
]

export function SEOForm({ form, onChange, allConfigs, isNew }: SEOFormProps) {
  const titleLen = form.title?.length ?? 0
  const descLen = form.description?.length ?? 0
  const canonicalUrl = form.canonicalUrl || `https://lklcloud.fr/${form.pageSlug === 'home' ? '' : form.pageSlug ?? ''}`

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left column: form fields */}
      <div className="space-y-5">
        {/* Basic info */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Informations de base</h3>

          <AdminInput
            label="Slug de page"
            value={form.pageSlug ?? ''}
            onChange={e => onChange({ pageSlug: e.target.value })}
            placeholder="home, produits/plesk, mentions-legales"
            required
            disabled={!isNew}
          />

          <AdminSelect
            label="Type de page"
            value={form.pageType ?? 'other'}
            onChange={e => onChange({ pageType: e.target.value as SEOConfig['pageType'] })}
            options={pageTypeOptions}
          />

          <div className="space-y-1.5">
            <AdminInput
              label="Titre SEO"
              value={form.title ?? ''}
              onChange={e => onChange({ title: e.target.value })}
              placeholder="Titre qui apparaît dans Google"
              required
            />
            <div className="flex justify-end">
              <span className={`text-xs font-medium ${
                titleLen >= 50 && titleLen <= 60 ? 'text-emerald-500' :
                titleLen > 60 ? 'text-red-500' : 'text-[var(--admin-text-muted)]'
              }`}>
                {titleLen}/60
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <AdminTextarea
              label="Meta description"
              value={form.description ?? ''}
              onChange={e => onChange({ description: e.target.value })}
              placeholder="Description qui apparaît sous le titre dans Google"
              required
              rows={3}
            />
            <div className="flex justify-end">
              <span className={`text-xs font-medium ${
                descLen >= 120 && descLen <= 155 ? 'text-emerald-500' :
                descLen > 155 ? 'text-red-500' : 'text-[var(--admin-text-muted)]'
              }`}>
                {descLen}/155
              </span>
            </div>
          </div>

          <AdminTagInput
            label="Mots-clés"
            tags={form.keywords ?? []}
            onChange={keywords => onChange({ keywords })}
            placeholder="Appuyez Entrée pour ajouter un mot-clé..."
          />
        </div>

        {/* Open Graph */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Open Graph (réseaux sociaux)</h3>

          <AdminInput
            label="OG Title"
            value={form.ogTitle ?? ''}
            onChange={e => onChange({ ogTitle: e.target.value })}
            placeholder="Laissez vide pour utiliser le titre SEO"
          />

          <AdminTextarea
            label="OG Description"
            value={form.ogDescription ?? ''}
            onChange={e => onChange({ ogDescription: e.target.value })}
            placeholder="Laissez vide pour utiliser la meta description"
            rows={2}
          />

          <AdminInput
            label="OG Image URL"
            value={form.ogImage ?? ''}
            onChange={e => onChange({ ogImage: e.target.value })}
            placeholder="https://lklcloud.fr/images/og.png"
          />
        </div>

        {/* Advanced */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Avancé</h3>

          <AdminInput
            label="URL canonique"
            value={form.canonicalUrl ?? ''}
            onChange={e => onChange({ canonicalUrl: e.target.value })}
            placeholder={canonicalUrl}
          />

          <div className="space-y-3">
            <AdminSwitch
              label="noindex"
              description="Empêche l'indexation par les moteurs de recherche"
              checked={form.noIndex ?? false}
              onChange={noIndex => onChange({ noIndex })}
            />
            <AdminSwitch
              label="nofollow"
              description="Empêche les robots de suivre les liens de la page"
              checked={form.noFollow ?? false}
              onChange={noFollow => onChange({ noFollow })}
            />
          </div>

          <AdminTextarea
            label="JSON-LD (données structurées)"
            value={form.jsonLd ?? ''}
            onChange={e => onChange({ jsonLd: e.target.value })}
            placeholder='{"@context": "https://schema.org", ...}'
            rows={5}
            className="font-mono text-xs"
          />
        </div>
      </div>

      {/* Right column: preview + audit */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 sticky top-4">
          <SERPPreview
            title={form.title ?? ''}
            description={form.description ?? ''}
            url={canonicalUrl}
          />

          <div className="mt-6 pt-5 border-t border-[var(--admin-border)]">
            <SEOAudit config={form} allConfigs={allConfigs} />
          </div>
        </div>
      </div>
    </div>
  )
}
