import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminInput, AdminTextarea, AdminTagInput } from '../components/FormFields'
import { SpotlightCard, ClickSpark } from '../components/reactbits'
import { VersionHistory } from '../components/VersionHistory'
import { LivePreview } from '../components/LivePreview'
import { HeroPreview } from '../components/preview/HeroPreview'
import { Save, History } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import type { HeroConfig } from '../lib/types'

const defaultConfig: HeroConfig = {
  titleLine1: '', titleLine2: '', typedWords: [], subtitle: '', ctaPrimaryText: '', ctaSecondaryText: '',
}

export default function HeroConfigPage() {
  const { heroConfig, updateHeroConfig, addToast } = useAdmin()
  const [form, setForm] = useState<HeroConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)

  const handleRestoreHero = useCallback(async (data: Record<string, unknown>) => {
    await updateHeroConfig(data as unknown as HeroConfig)
  }, [updateHeroConfig])

  useEffect(() => {
    if (heroConfig) setForm({ titleLine1: heroConfig.titleLine1, titleLine2: heroConfig.titleLine2, typedWords: [...heroConfig.typedWords], subtitle: heroConfig.subtitle, ctaPrimaryText: heroConfig.ctaPrimaryText, ctaSecondaryText: heroConfig.ctaSecondaryText })
  }, [heroConfig])

  const handleSave = async () => {
    setSaving(true)
    try { await updateHeroConfig(form); addToast('success', 'Configuration du Hero enregistrée') } catch { /* toast */ } finally { setSaving(false) }
  }

  return (
    <PageContainer title="Configuration du Hero" description="Personnalisez le contenu de la section principale du site">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <SpotlightCard className="!p-6">
            <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span> Titre</h3>
            <div className="space-y-4">
              <AdminInput label="Ligne 1" value={form.titleLine1} onChange={e => setForm(prev => ({ ...prev, titleLine1: e.target.value }))} placeholder="Votre nouvel hébergeur" />
              <AdminInput label="Ligne 2 / TypedText" value={form.titleLine2} onChange={e => setForm(prev => ({ ...prev, titleLine2: e.target.value }))} placeholder="Haute Performance" />
              <AdminTagInput label="Mots animés" tags={form.typedWords} onChange={typedWords => setForm(prev => ({ ...prev, typedWords }))} placeholder="Ex: Haute Performance, 100% Français..." />
            </div>
          </SpotlightCard>

          <SpotlightCard className="!p-6">
            <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span> Contenu</h3>
            <AdminTextarea label="Sous-titre" value={form.subtitle} onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))} placeholder="Description affichée sous le titre principal..." rows={3} />
          </SpotlightCard>

          <SpotlightCard className="!p-6">
            <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">3</span> Boutons CTA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Texte bouton principal" value={form.ctaPrimaryText} onChange={e => setForm(prev => ({ ...prev, ctaPrimaryText: e.target.value }))} placeholder="Découvrir nos offres" />
              <AdminInput label="Texte bouton secondaire" value={form.ctaSecondaryText} onChange={e => setForm(prev => ({ ...prev, ctaSecondaryText: e.target.value }))} placeholder="En savoir plus" />
            </div>
          </SpotlightCard>

          <div className="flex justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setVersionOpen(true)} icon={<History size={16} />}>Historique</AdminButton>
            <ClickSpark sparkColor="#FF6A30" sparkCount={10} sparkRadius={25}>
              <AdminButton onClick={handleSave} loading={saving} icon={<Save size={16} />}>Enregistrer</AdminButton>
            </ClickSpark>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <LivePreview>
            <HeroPreview data={form} />
          </LivePreview>
        </div>
      </div>

      {heroConfig && (
        <VersionHistory
          open={versionOpen}
          onClose={() => setVersionOpen(false)}
          entityId="hero"
          entityType="hero"
          entityName="Configuration Hero"
          currentData={heroConfig as unknown as Record<string, unknown>}
          onRestore={handleRestoreHero}
        />
      )}
    </PageContainer>
  )
}
