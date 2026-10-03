import { useState } from 'react'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { AdminInput, AdminTextarea, AdminCheckbox, AdminSwitch, AdminNumberInput } from '../components/FormFields'
import { AdminDropdown } from '../components/AdminDropdown'
import { Megaphone, Activity, Link2, Plus, Pencil, Trash2, Power, Copy, Percent } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import type { Annonce } from '../lib/types'

const linkActionOptions = [
  { value: '', label: 'Aucun lien' },
  { value: 'deploy-modal', label: 'Ouvrir le modal deploy' },
  { value: 'custom', label: 'URL personnalisée' },
]

const emptyForm = {
  message: '',
  linkText: '',
  linkAction: '' as string,
  customUrl: '',
  actif: false,
  dateDebut: '',
  dateFin: '',
  isPromo: false,
  promoReduction: '' as string | number,
  promoGammeIds: [] as string[],
}

export default function Annonces() {
  const { annonces, gammes, addAnnonce, updateAnnonce, deleteAnnonce, cloneAnnonce } = useAdmin()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmActivate, setConfirmActivate] = useState(false)
  const [, setPendingSubmit] = useState(false)
  const [pendingToggle, setPendingToggle] = useState<{ id: string; actif: boolean } | null>(null)

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  const truncate = (str: string, max: number) => str.length > max ? str.slice(0, max) + '...' : str

  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm }); setErrors({}); setDialogOpen(true) }

  const openEdit = (a: Annonce) => {
    setEditingId(a.id)
    const isCustomUrl = a.linkAction && a.linkAction !== 'deploy-modal'
    setForm({ message: a.message, linkText: a.linkText ?? '', linkAction: isCustomUrl ? 'custom' : (a.linkAction ?? ''), customUrl: isCustomUrl ? (a.linkAction ?? '') : '', actif: a.actif, dateDebut: a.dateDebut ?? '', dateFin: a.dateFin ?? '', isPromo: a.isPromo ?? false, promoReduction: a.promoReduction ?? '', promoGammeIds: a.promoGammeIds ?? [] })
    setErrors({}); setDialogOpen(true)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.message.trim()) errs.message = 'Le message est requis'
    if (form.linkAction === 'custom' && !form.customUrl.trim()) errs.customUrl = "L'URL est requise"
    if (form.isPromo) {
      const pct = Number(form.promoReduction)
      if (!form.promoReduction || isNaN(pct) || pct < 1 || pct > 99) errs.promoReduction = 'Le pourcentage doit être entre 1 et 99'
      if (form.promoGammeIds.length === 0) errs.promoGammeIds = 'Sélectionnez au moins une gamme'
    }
    setErrors(errs); return Object.keys(errs).length === 0
  }

  const resolvedLinkAction = (): string | undefined => {
    if (!form.linkAction) return undefined
    if (form.linkAction === 'custom') return form.customUrl.trim() || undefined
    return form.linkAction
  }

  const buildPayload = () => ({ message: form.message.trim(), linkText: form.linkText.trim() || undefined, linkAction: resolvedLinkAction(), actif: form.actif, dateDebut: form.dateDebut || undefined, dateFin: form.dateFin || undefined, isPromo: form.isPromo, promoReduction: form.isPromo ? Number(form.promoReduction) : undefined, promoGammeIds: form.isPromo ? form.promoGammeIds : undefined })

  const doSubmit = async () => {
    try {
      const payload = buildPayload()
      if (editingId) await updateAnnonce(editingId, payload)
      else await addAnnonce(payload as Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>)
      setDialogOpen(false)
    } catch { /* context toast */ }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (form.actif && annonces.some(a => a.actif && a.id !== editingId)) { setPendingSubmit(true); setConfirmActivate(true); return }
    await doSubmit()
  }

  const handleConfirmActivate = async () => {
    setConfirmActivate(false); setPendingSubmit(false)
    if (pendingToggle) { try { await updateAnnonce(pendingToggle.id, { actif: pendingToggle.actif }) } catch { /* toast */ } setPendingToggle(null); return }
    await doSubmit()
  }

  const handleCancelActivate = () => { setConfirmActivate(false); setPendingSubmit(false); setPendingToggle(null) }
  const handleDelete = async (id: string) => { try { await deleteAnnonce(id); setConfirmDelete(null) } catch { /* toast */ } }

  const handleToggleActive = async (a: Annonce) => {
    const newState = !a.actif
    if (newState && annonces.some(other => other.actif && other.id !== a.id)) {
      setEditingId(a.id); setForm(prev => ({ ...prev, actif: true })); setPendingSubmit(true); setPendingToggle({ id: a.id, actif: true }); setConfirmActivate(true); return
    }
    try { await updateAnnonce(a.id, { actif: newState }) } catch { /* toast */ }
  }

  const sortedAnnonces = [...annonces].sort((a, b) => { if (a.actif !== b.actif) return a.actif ? -1 : 1; return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() })

  return (
    <PageContainer title="Annonces" description="Gérez les annonces affichées dans la barre d'annonce" actions={
      <AdminButton onClick={openCreate} icon={<Plus size={16} />}>Nouvelle annonce</AdminButton>
    }>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total annonces" value={annonces.length} icon={<Megaphone size={20} />} color="orange" />
          <KPICard label="Annonce active" value={annonces.filter(a => a.actif).length} icon={<Activity size={20} />} color="green" />
          <KPICard label="Avec lien" value={annonces.filter(a => a.linkText && a.linkAction).length} icon={<Link2 size={20} />} color="cyan" />
          <KPICard label="Promotions" value={annonces.filter(a => a.isPromo).length} icon={<Percent size={20} />} color="yellow" />
        </div>

        <div className="admin-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--admin-border)]">
                  <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Message</th>
                  <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Lien</th>
                  <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Statut</th>
                  <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Dates</th>
                  <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAnnonces.map((a, i) => (
                  <tr key={a.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''}`}>
                    <td className="px-5 py-4 max-w-xs"><p className="text-sm font-medium text-[var(--admin-text-primary)] truncate" title={a.message}>{truncate(a.message, 60)}</p></td>
                    <td className="px-5 py-4">{a.linkText ? (<div className="flex flex-col gap-0.5"><span className="text-sm text-[var(--admin-text-secondary)]">{a.linkText}</span>{a.linkAction && <code className="text-xs text-[var(--admin-text-muted)] bg-[var(--admin-surface)] px-1.5 py-0.5 rounded font-mono w-fit">{a.linkAction === 'deploy-modal' ? 'deploy-modal' : truncate(a.linkAction, 30)}</code>}</div>) : <span className="text-xs text-[var(--admin-text-muted)]">—</span>}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-1.5"><AdminBadge variant={a.actif ? 'success' : 'neutral'}>{a.actif ? 'Actif' : 'Inactif'}</AdminBadge>{a.isPromo && <AdminBadge variant="warning">Promo</AdminBadge>}</div></td>
                    <td className="px-5 py-4"><div className="flex flex-col gap-0.5 text-sm text-[var(--admin-text-muted)]">{a.dateDebut || a.dateFin ? (<>{a.dateDebut && <span>Du {formatDate(a.dateDebut)}</span>}{a.dateFin && <span>Au {formatDate(a.dateFin)}</span>}</>) : <span>—</span>}</div></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(a)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier"><Pencil size={15} /></button>
                        <button onClick={() => cloneAnnonce(a.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Dupliquer"><Copy size={15} /></button>
                        <button onClick={() => handleToggleActive(a)} className={`p-2 rounded-xl transition-all ${a.actif ? 'text-[var(--admin-success)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)]' : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-success)] hover:bg-[var(--admin-success)]/10'}`} title={a.actif ? 'Désactiver' : 'Activer'}><Power size={15} /></button>
                        <button onClick={() => setConfirmDelete(a.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {annonces.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-[var(--admin-text-muted)] text-sm">Aucune annonce.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <AdminDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editingId ? "Modifier l'annonce" : 'Nouvelle annonce'} description={editingId ? "Modifiez l'annonce" : "Créez une nouvelle annonce"} size="lg">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span> Message</h3>
              <div className="space-y-4">
                <AdminTextarea label="Message" required value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Découvrez nos nouvelles offres VPS..." rows={3} error={errors.message} />
                <AdminInput label="Lien : texte" value={form.linkText} onChange={e => setForm(prev => ({ ...prev, linkText: e.target.value }))} placeholder="En savoir plus" />
                <AdminDropdown label="Lien : action" value={form.linkAction} onChange={val => setForm(prev => ({ ...prev, linkAction: val, customUrl: val !== 'custom' ? '' : prev.customUrl }))} options={linkActionOptions} />
                {form.linkAction === 'custom' && <AdminInput label="URL personnalisée" required value={form.customUrl} onChange={e => setForm(prev => ({ ...prev, customUrl: e.target.value }))} placeholder="https://clients.lklcloud.fr/commander/vps-linux" error={errors.customUrl} />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span> Promotion</h3>
              <div className="space-y-4">
                <AdminSwitch label="Annonce promotionnelle" description="Activez pour appliquer une réduction sur les offres des gammes ciblées" checked={form.isPromo} onChange={isPromo => setForm(prev => ({ ...prev, isPromo, promoReduction: isPromo ? prev.promoReduction : '', promoGammeIds: isPromo ? prev.promoGammeIds : [] }))} />
                {form.isPromo && (
                  <>
                    <AdminNumberInput label="Réduction" value={form.promoReduction !== '' ? Number(form.promoReduction) : undefined} onChange={val => setForm(prev => ({ ...prev, promoReduction: val ?? '' }))} suffix="%" min={1} max={99} step={1} required placeholder="20" error={errors.promoReduction} />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[var(--admin-text-secondary)]">
                        Gammes ciblées <span className="text-[var(--admin-primary)] ml-0.5">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {gammes.filter(g => g.actif && !g.comingSoon).sort((a, b) => a.ordre - b.ordre).map(g => (
                          <button
                            type="button"
                            key={g.id}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-left ${
                              form.promoGammeIds.includes(g.id)
                                ? 'border-[var(--admin-primary)]/40 bg-[var(--admin-primary-surface)]'
                                : 'border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] hover:border-[var(--admin-border-strong)]'
                            }`}
                            onClick={() => setForm(prev => ({
                              ...prev,
                              promoGammeIds: prev.promoGammeIds.includes(g.id)
                                ? prev.promoGammeIds.filter(id => id !== g.id)
                                : [...prev.promoGammeIds, g.id],
                            }))}
                          >
                            <div className={`w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center transition-all shrink-0 ${
                              form.promoGammeIds.includes(g.id)
                                ? 'bg-[var(--admin-primary)] border-[var(--admin-primary)]'
                                : 'border-[var(--admin-border-strong)] bg-[var(--admin-input-bg)]'
                            }`}>
                              {form.promoGammeIds.includes(g.id) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-medium text-[var(--admin-text-secondary)]">{g.nom}</span>
                          </button>
                        ))}
                      </div>
                      {errors.promoGammeIds && <p className="text-xs text-[var(--admin-danger)] font-medium">{errors.promoGammeIds}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">3</span> Planification</h3>
              <div className="space-y-4">
                <AdminCheckbox label="Annonce active" checked={form.actif} onChange={actif => setForm(prev => ({ ...prev, actif }))} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput label="Date de début" type="date" value={form.dateDebut} onChange={e => setForm(prev => ({ ...prev, dateDebut: e.target.value }))} />
                  <AdminInput label="Date de fin" type="date" value={form.dateFin} onChange={e => setForm(prev => ({ ...prev, dateFin: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmit}>{editingId ? 'Enregistrer' : "Créer l'annonce"}</AdminButton>
            </div>
          </div>
        </AdminDialog>

        <ConfirmDialog open={confirmDelete !== null} onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} title="Supprimer l'annonce ?" message="Cette annonce sera définitivement supprimée." />
        <ConfirmDialog open={confirmActivate} onCancel={handleCancelActivate} onConfirm={handleConfirmActivate} title="Activer cette annonce ?" message="Une autre annonce est déjà active. Voulez-vous quand même activer celle-ci ?" />
      </div>
    </PageContainer>
  )
}
