import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminTextarea, AdminInput } from '../components/FormFields'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { SpotlightCard } from '../components/reactbits'
import { ShieldAlert, Save, Clock, MessageSquareText, Eye, Power, PowerOff } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import type { MaintenanceMode } from '../lib/types'

const defaultMaintenance: MaintenanceMode = { enabled: false, message: '' }

/* ── Status badge ─────────────────────────────────────────────────── */
function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-500 ${
        enabled
          ? 'bg-[var(--admin-danger)]/10 text-[var(--admin-danger)] border border-[var(--admin-danger)]/20'
          : 'bg-[var(--admin-success)]/10 text-[var(--admin-success)] border border-[var(--admin-success)]/20'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${enabled ? 'bg-[var(--admin-danger)]' : 'bg-[var(--admin-success)]'}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${enabled ? 'bg-[var(--admin-danger)]' : 'bg-[var(--admin-success)]'}`} />
      </span>
      {enabled ? 'Mode maintenance actif' : 'Site en ligne'}
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────────────────── */
export default function Maintenance() {
  const { maintenanceMode, updateMaintenanceMode } = useAdmin()
  const [form, setForm] = useState<MaintenanceMode>(defaultMaintenance)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { if (maintenanceMode) setForm({ ...maintenanceMode }) }, [maintenanceMode])

  const handleToggle = () => {
    if (!form.enabled) setConfirmOpen(true)
    else saveMaintenance({ ...form, enabled: false })
  }

  const handleConfirmEnable = () => { setConfirmOpen(false); saveMaintenance({ ...form, enabled: true }) }

  const saveMaintenance = async (data: MaintenanceMode) => {
    setSaving(true)
    try { await updateMaintenanceMode(data); setForm(data) } catch (err) { console.error('[Maintenance] Save error:', err) } finally { setSaving(false) }
  }

  return (
    <PageContainer title="Mode maintenance" description="Activez ou désactivez le mode maintenance du site">
      <div className="space-y-8">

        {/* ── Hero section with illustration ──────────────────────── */}
        <SpotlightCard className={`!p-0 overflow-hidden transition-all duration-700 ${form.enabled ? '!border-[var(--admin-danger)]/30' : '!border-[var(--admin-success)]/20'}`}>
          <div className="relative">
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${
              form.enabled
                ? 'bg-gradient-to-b from-[var(--admin-danger)]/5 via-transparent to-transparent'
                : 'bg-gradient-to-b from-[var(--admin-success)]/5 via-transparent to-transparent'
            }`} />

            <div className="relative px-6 pt-8 pb-6">
              {/* Status badge + toggle */}
              <div className="flex items-center justify-between mb-6">
                <StatusBadge enabled={form.enabled} />
                <AdminButton
                  variant={form.enabled ? 'danger' : 'primary'}
                  onClick={handleToggle}
                  icon={form.enabled ? <PowerOff size={16} /> : <Power size={16} />}
                >
                  {form.enabled ? 'Désactiver' : 'Activer'}
                </AdminButton>
              </div>

              {/* Headline */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={form.enabled ? 'on' : 'off'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-bold text-[var(--admin-text-primary)]"
                  >
                    {form.enabled ? 'Le site est en maintenance' : 'Le site est opérationnel'}
                  </motion.h2>
                </AnimatePresence>
                <p className="text-sm text-[var(--admin-text-muted)] mt-1.5">
                  {form.enabled
                    ? 'Tous les visiteurs voient la page de maintenance au lieu du site.'
                    : 'Le site est accessible normalement par tous les visiteurs.'
                  }
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* ── Configuration section ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message */}
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--admin-primary)]/10 flex items-center justify-center border border-[var(--admin-primary)]/15">
                <MessageSquareText size={18} className="text-[var(--admin-primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Message</h3>
                <p className="text-xs text-[var(--admin-text-muted)]">Texte affiché aux visiteurs</p>
              </div>
            </div>
            <AdminTextarea
              label=""
              value={form.message}
              onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Notre site est en cours de maintenance. Nous serons de retour bientôt."
              rows={5}
            />
          </SpotlightCard>

          {/* Date + Preview */}
          <div className="space-y-6">
            <SpotlightCard className="!p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--admin-info)]/10 flex items-center justify-center border border-[var(--admin-info)]/15">
                  <Clock size={18} className="text-[var(--admin-info)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Date de retour</h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">Estimation affichée aux visiteurs</p>
                </div>
              </div>
              <AdminInput
                label=""
                type="datetime-local"
                value={form.estimatedReturn ?? ''}
                onChange={e => setForm(prev => ({ ...prev, estimatedReturn: e.target.value || undefined }))}
              />
            </SpotlightCard>

            {/* Live preview mini-card */}
            <SpotlightCard className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--admin-warning)]/10 flex items-center justify-center border border-[var(--admin-warning)]/15">
                  <Eye size={18} className="text-[var(--admin-warning)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Aperçu visiteur</h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">Ce que verront les visiteurs</p>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} className="text-[var(--admin-warning)]" />
                  <span className="text-xs font-semibold text-[var(--admin-text-primary)]">Page de maintenance</span>
                </div>
                <p className="text-xs text-[var(--admin-text-secondary)] leading-relaxed">
                  {form.message || 'Aucun message configuré — le message par défaut sera affiché.'}
                </p>
                {form.estimatedReturn && (
                  <p className="text-[10px] text-[var(--admin-text-muted)] flex items-center gap-1.5">
                    <Clock size={10} />
                    Retour prévu : {new Date(form.estimatedReturn).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* ── Save button ─────────────────────────────────────────── */}
        <div className="flex justify-end">
          <AdminButton onClick={() => saveMaintenance(form)} loading={saving} icon={<Save size={16} />}>
            Enregistrer les modifications
          </AdminButton>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleConfirmEnable}
        onCancel={() => setConfirmOpen(false)}
        title="Activer le mode maintenance ?"
        message="Êtes-vous sûr ? Tous les visiteurs verront une page de maintenance au lieu du site."
        confirmLabel="Activer"
        confirmColor="orange"
      />
    </PageContainer>
  )
}
