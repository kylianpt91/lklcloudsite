import { useState, useEffect } from 'react'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminInput } from '../components/FormFields'
import { seedAllData } from '../lib/seed'
import { SpotlightCard, ClickSpark } from '../components/reactbits'
import { Globe, MessageSquare, Link, Settings, Database, Save, CheckCircle, Download, Upload, Webhook } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import { ExportDialog } from '../components/ExportDialog'
import { ImportDialog } from '../components/ImportDialog'
import type { SiteSettings, DiscordWebhookConfig } from '../lib/types'

const defaultSettings: SiteSettings = {
  contactEmail: '', socialInstagram: '', socialDiscord: '', socialLinkedin: '', whmcsBaseUrl: '', companyTagline: '',
}

const defaultDiscord: DiscordWebhookConfig = {
  url: '',
  enabled: false,
  events: ['create', 'update', 'delete'],
}

export default function Parametres() {
  const { siteSettings, updateSiteSettings, discordConfig, updateDiscordConfig, addToast } = useAdmin()
  const [form, setForm] = useState<SiteSettings>(defaultSettings)
  const [discordForm, setDiscordForm] = useState<DiscordWebhookConfig>(defaultDiscord)
  const [saving, setSaving] = useState(false)
  const [savingDiscord, setSavingDiscord] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  useEffect(() => { if (siteSettings) setForm({ ...siteSettings }) }, [siteSettings])
  useEffect(() => { if (discordConfig) setDiscordForm({ ...discordConfig }) }, [discordConfig])

  const handleSave = async () => {
    setSaving(true)
    try { await updateSiteSettings(form) } catch { /* toast */ } finally { setSaving(false) }
  }

  const handleSaveDiscord = async () => {
    setSavingDiscord(true)
    try { await updateDiscordConfig(discordForm) } catch { /* toast */ } finally { setSavingDiscord(false) }
  }

  const toggleDiscordEvent = (event: 'create' | 'update' | 'delete') => {
    setDiscordForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }))
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const result = await seedAllData()
      if (result) addToast('success', 'Base de données initialisée avec les données par défaut')
      else addToast('info', 'La base est déjà initialisée — les données existent déjà')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      addToast('error', msg)
      console.error('[Seed] Erreur:', err)
    } finally { setSeeding(false) }
  }

  return (
    <PageContainer title="Paramètres" description="Configuration du site et du panneau d'administration">
      <div className="space-y-6">
        {/* Row 1: Contact & Site/WHMCS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact & Réseaux sociaux */}
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--admin-primary)]/10 flex items-center justify-center"><MessageSquare size={18} className="text-[var(--admin-primary)]" /></div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Contact & Réseaux sociaux</h3>
                <p className="text-xs text-[var(--admin-text-muted)]">Coordonnées et liens sociaux</p>
              </div>
            </div>
            <div className="space-y-4">
              <AdminInput label="Email de contact" value={form.contactEmail} onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))} placeholder="support@lklcloud.fr" />
              <AdminInput label="Instagram" value={form.socialInstagram} onChange={e => setForm(prev => ({ ...prev, socialInstagram: e.target.value }))} placeholder="https://instagram.com/lklcloud" />
              <AdminInput label="Discord" value={form.socialDiscord} onChange={e => setForm(prev => ({ ...prev, socialDiscord: e.target.value }))} placeholder="https://discord.gg/lklcloud" />
              <AdminInput label="LinkedIn" value={form.socialLinkedin} onChange={e => setForm(prev => ({ ...prev, socialLinkedin: e.target.value }))} placeholder="https://linkedin.com/company/lklcloud" />
            </div>
          </SpotlightCard>

          {/* Site + WHMCS stacked */}
          <div className="space-y-6">
            <SpotlightCard className="!p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--admin-success)]/10 flex items-center justify-center"><Globe size={18} className="text-[var(--admin-success)]" /></div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Site</h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">Textes généraux du site</p>
                </div>
              </div>
              <div className="space-y-4">
                <AdminInput label="Tagline" value={form.companyTagline} onChange={e => setForm(prev => ({ ...prev, companyTagline: e.target.value }))} placeholder="Hébergeur français premium..." />
              </div>
            </SpotlightCard>

            <SpotlightCard className="!p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#06b6d4]/10 flex items-center justify-center"><Link size={18} className="text-[#06b6d4]" /></div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Espace Client (WHMCS)</h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">URL de base de votre espace client</p>
                </div>
              </div>
              <AdminInput label="URL de base WHMCS" value={form.whmcsBaseUrl} onChange={e => setForm(prev => ({ ...prev, whmcsBaseUrl: e.target.value }))} placeholder="https://client.lklcloud.fr" />
            </SpotlightCard>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <ClickSpark sparkColor="#FF6A30" sparkCount={10} sparkRadius={25}>
            <AdminButton onClick={handleSave} loading={saving} icon={<Save size={16} />}>Enregistrer</AdminButton>
          </ClickSpark>
        </div>

        {/* Row 2: Données & Version */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--admin-warning)]/10 flex items-center justify-center"><Database size={18} className="text-[var(--admin-warning)]" /></div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Données</h3>
                <p className="text-xs text-[var(--admin-text-muted)]">Exporter, importer ou initialiser les données</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <AdminButton onClick={() => setExportOpen(true)} icon={<Download size={16} />}>Exporter</AdminButton>
              <AdminButton variant="secondary" onClick={() => setImportOpen(true)} icon={<Upload size={16} />}>Importer</AdminButton>
              <AdminButton variant="warning" onClick={handleSeed} loading={seeding} icon={<Database size={16} />}>Initialiser la base</AdminButton>
            </div>
          </SpotlightCard>

          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#06b6d4]/10 flex items-center justify-center"><Settings size={18} className="text-[#06b6d4]" /></div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Version</h3>
                <p className="text-xs text-[var(--admin-text-muted)]">Informations système</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[var(--admin-success)]" />
              <span className="text-sm text-[var(--admin-text-secondary)]">LKL CLOUD WEB MANAGEMENT</span>
              <span className="text-sm font-semibold text-[var(--admin-text-primary)]">v1.0.0</span>
            </div>
          </SpotlightCard>
        </div>
        {/* Row 3: Discord webhook */}
        <SpotlightCard className="!p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center"><Webhook size={18} className="text-[#5865F2]" /></div>
            <div>
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Webhook Discord</h3>
              <p className="text-xs text-[var(--admin-text-muted)]">Recevez les notifications d'activité sur votre serveur Discord</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={discordForm.enabled}
                  onChange={e => setDiscordForm(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[var(--admin-surface-strong)] peer-checked:bg-[var(--admin-primary)] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm text-[var(--admin-text-secondary)]">
                {discordForm.enabled ? 'Actif' : 'Désactivé'}
              </span>
            </div>
            <AdminInput
              label="URL du webhook"
              value={discordForm.url}
              onChange={e => setDiscordForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://discord.com/api/webhooks/..."
            />
            <div>
              <p className="text-xs font-semibold text-[var(--admin-text-secondary)] mb-2">Événements à notifier</p>
              <div className="flex flex-wrap gap-2">
                {([['create', 'Création'], ['update', 'Modification'], ['delete', 'Suppression']] as const).map(([event, label]) => (
                  <button
                    key={event}
                    onClick={() => toggleDiscordEvent(event)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      discordForm.events.includes(event)
                        ? 'bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] border border-[var(--admin-primary)]/20'
                        : 'bg-[var(--admin-surface)] text-[var(--admin-text-muted)] border border-[var(--admin-border)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <AdminButton onClick={handleSaveDiscord} loading={savingDiscord} icon={<Save size={16} />}>Enregistrer Discord</AdminButton>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </PageContainer>
  )
}
