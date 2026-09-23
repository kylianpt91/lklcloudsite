import { useState, useMemo, useCallback } from 'react'
import { useAdmin } from '../lib/context'
import { useSelection } from '../hooks/useSelection'
import { PageContainer } from '../components/PageContainer'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FloatingActionBar } from '../components/FloatingActionBar'
import { VersionHistory } from '../components/VersionHistory'
import { AdminInput, AdminTextarea, AdminCheckbox, AdminTagInput, AdminSwitch, AdminTableCheckbox } from '../components/FormFields'
import { AdminDropdown } from '../components/AdminDropdown'
import { Package, Star, TrendingUp, Plus, Pencil, Trash2, Search, Copy, CheckCircle, Archive, FileText, History, Eye } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SortableTableRow } from '../components/SortableTableRow'
import type { DragEndEvent } from '@dnd-kit/core'
import { ScheduleFields, getScheduleStatus } from '../components/ScheduleFields'
import { LivePreview } from '../components/LivePreview'
import { OffrePreview } from '../components/preview/OffrePreview'
import type { Offre, Prix, ScheduleConfig } from '../lib/types'

const emptyPrix: Prix = {
  mensuel: 0,
  trimestriel: 0,
  annuel: 0,
  afficherMensuel: true,
  afficherTrimestriel: true,
  afficherAnnuel: true,
}

const emptySpecs = {
  ram: '',
  cpu: '',
  storage: '',
  bandwidth: '',
}

const emptyForm = {
  gammeId: '',
  nom: '',
  slug: '',
  tagline: '',
  description: '',
  features: [] as string[],
  prix: { ...emptyPrix },
  specs: { ...emptySpecs },
  badge: '',
  orderUrl: '',
  statut: 'actif' as Offre['statut'],
  misEnAvant: false,
  ordre: 1,
  scheduleConfig: {} as ScheduleConfig,
}

export default function Offres() {
  const { gammes, offres, addOffre, updateOffre, deleteOffre, cloneOffre, reorderOffres, bulkDeleteOffres, bulkUpdateOffreStatus, bulkToggleMisEnAvant } = useAdmin()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [versionHistoryId, setVersionHistoryId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [filterGamme, setFilterGamme] = useState<string>('all')
  const [search, setSearch] = useState('')

  const versionHistoryOffre = versionHistoryId ? offres.find(o => o.id === versionHistoryId) : null

  const handleRestoreOffre = useCallback(async (data: Record<string, unknown>) => {
    if (!versionHistoryId) return
    const { createdAt: _c, updatedAt: _u, ...restoreData } = data
    await updateOffre(versionHistoryId, restoreData as Partial<Offre>)
  }, [versionHistoryId, updateOffre])

  const offresActives = offres.filter(o => o.statut === 'actif').length
  const offresEnAvant = offres.filter(o => o.misEnAvant).length

  const filteredOffres = useMemo(() => {
    let result = [...offres]
    if (filterGamme !== 'all') result = result.filter(o => o.gammeId === filterGamme)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o => o.nom.toLowerCase().includes(q) || o.tagline.toLowerCase().includes(q))
    }
    return result.sort((a, b) => a.ordre - b.ordre)
  }, [offres, filterGamme, search])

  const { toggleOne, toggleAll, isSelected, clearSelection, selectedCount, allSelected, selected } = useSelection(filteredOffres)

  const handleBulkDelete = async () => {
    await bulkDeleteOffres([...selected])
    clearSelection()
    setConfirmBulkDelete(false)
  }

  const handleBulkStatus = async (statut: Offre['statut']) => {
    await bulkUpdateOffreStatus([...selected], statut)
    clearSelection()
  }

  const handleBulkMisEnAvant = async (value: boolean) => {
    await bulkToggleMisEnAvant([...selected], value)
    clearSelection()
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  const getGammeName = (gammeId: string) =>
    gammes.find(g => g.id === gammeId)?.nom ?? '—'

  const generateSlug = (nom: string) =>
    nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...emptyForm,
      gammeId: gammes[0]?.id ?? '',
      ordre: offres.length + 1,
      prix: { ...emptyPrix },
      specs: { ...emptySpecs },
    })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (o: Offre) => {
    setEditingId(o.id)
    setForm({
      gammeId: o.gammeId,
      nom: o.nom,
      slug: o.slug,
      tagline: o.tagline,
      description: o.description,
      features: [...o.features],
      prix: { ...o.prix },
      specs: o.specs ? { ...o.specs } : { ...emptySpecs },
      badge: o.badge ?? '',
      orderUrl: o.orderUrl ?? '',
      statut: o.statut,
      misEnAvant: o.misEnAvant,
      ordre: o.ordre,
      scheduleConfig: o.scheduleConfig ?? {},
    })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.nom.trim()) errs.nom = 'Le nom est requis'
    if (!form.gammeId) errs.gammeId = 'La gamme est requise'
    if (form.prix.mensuel !== undefined && form.prix.mensuel < 0) errs.prixMensuel = 'Le prix doit être positif'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const slug = form.slug.trim() || generateSlug(form.nom)
    const data = {
      ...form,
      slug,
      badge: form.badge.trim() || undefined,
      orderUrl: form.orderUrl.trim() || undefined,
    }
    try {
      if (editingId) {
        await updateOffre(editingId, data)
      } else {
        await addOffre(data)
      }
      setDialogOpen(false)
    } catch {
      // error handled by context toast
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteOffre(id)
      setConfirmDelete(null)
    } catch {
      // error handled by context toast
    }
  }

  const statutBadge = (statut: Offre['statut']) => {
    switch (statut) {
      case 'actif': return <AdminBadge variant="success">Actif</AdminBadge>
      case 'brouillon': return <AdminBadge variant="warning">Brouillon</AdminBadge>
      case 'archive': return <AdminBadge variant="neutral">Archivé</AdminBadge>
    }
  }

  const gammeOptions = [
    { value: 'all', label: 'Toutes les gammes' },
    ...gammes.map(g => ({ value: g.id, label: g.nom })),
  ]

  const gammeFormOptions = gammes.map(g => ({ value: g.id, label: g.nom }))
  const statutOptions = [
    { value: 'actif', label: 'Actif' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'archive', label: 'Archivé' },
  ]

  const filteredIds = filteredOffres.map(o => o.id)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = filteredIds.indexOf(String(active.id))
    const newIndex = filteredIds.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(filteredIds, oldIndex, newIndex)
    reorderOffres(reordered)
  }, [filteredIds, reorderOffres])

  return (
    <PageContainer
      title="Offres d'hébergement"
      description="Gérez les offres et le pricing de vos hébergements"
      actions={
        <AdminButton onClick={openCreate} icon={<Plus size={16} />}>Nouvelle offre</AdminButton>
      }
    >
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard label="Total offres" value={offres.length} icon={<Package size={20} />} color="orange" />
          <KPICard label="Offres actives" value={offresActives} icon={<TrendingUp size={20} />} color="green" />
          <KPICard label="Mises en avant" value={offresEnAvant} icon={<Star size={20} />} color="yellow" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-64">
            <AdminDropdown label="" value={filterGamme} onChange={setFilterGamme} options={gammeOptions} searchable placeholder="Toutes les gammes" />
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une offre..."
              className="w-full rounded-xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] pl-10 pr-4 py-2.5 text-sm text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none focus:border-[var(--admin-primary)]/50"
            />
          </div>
        </div>

        {/* Table */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="admin-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    <th className="px-5 py-3.5 w-10">
                      <AdminTableCheckbox checked={allSelected} onChange={toggleAll} />
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 w-8" />
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Offre</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Gamme</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Mensuel</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Trim.</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Annuel</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Statut</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">MAJ</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <SortableContext items={filteredIds} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {filteredOffres.map((o, i) => (
                      <SortableTableRow key={o.id} id={o.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''} ${isSelected(o.id) ? 'bg-[var(--admin-primary-surface)]' : ''}`}>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <AdminTableCheckbox checked={isSelected(o.id)} onChange={() => toggleOne(o.id)} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                                {o.nom}
                                {o.misEnAvant && <Star size={12} className="inline ml-1.5 text-[#f59e0b] fill-[#f59e0b]" />}
                              </p>
                              <p className="text-xs text-[var(--admin-text-muted)]">{o.tagline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-[var(--admin-text-secondary)]">{getGammeName(o.gammeId)}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-semibold text-[var(--admin-text-primary)]">{o.prix.mensuel?.toFixed(2)}&euro;</span>
                        </td>
                        <td className="px-5 py-4 text-right hidden md:table-cell">
                          <span className="text-sm text-[var(--admin-text-secondary)]">{o.prix.trimestriel?.toFixed(2)}&euro;</span>
                        </td>
                        <td className="px-5 py-4 text-right hidden md:table-cell">
                          <span className="text-sm text-[var(--admin-text-secondary)]">{o.prix.annuel?.toFixed(2)}&euro;</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {statutBadge(o.statut)}
                            {(() => { const s = getScheduleStatus(o.scheduleConfig); return s ? <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${s.className}`}>{s.label}</span> : null })()}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="text-sm text-[var(--admin-text-muted)]">{formatDate(o.updatedAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(o)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier"><Pencil size={15} /></button>
                            <button onClick={() => cloneOffre(o.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Dupliquer"><Copy size={15} /></button>
                            <button onClick={() => setVersionHistoryId(o.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-info)] hover:bg-[var(--admin-info-surface)] transition-all" title="Historique"><History size={15} /></button>
                            <button onClick={() => setConfirmDelete(o.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </SortableTableRow>
                    ))}
                    {filteredOffres.length === 0 && (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-[var(--admin-text-muted)] text-sm">
                          {offres.length === 0 ? 'Aucune offre. Cliquez sur "Nouvelle offre" pour commencer.' : 'Aucun résultat pour cette recherche.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </SortableContext>
              </table>
            </div>
          </div>
        </DndContext>

        {/* Create/Edit Dialog */}
        <AdminDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setPreviewOpen(false) }}
          title={editingId ? "Modifier l'offre" : 'Nouvelle offre'}
          description={editingId ? "Modifiez les informations de l'offre" : 'Créez une nouvelle offre d\'hébergement'}
          size={previewOpen ? 'full' : 'xl'}
        >
          <div className={previewOpen ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : ''}>
          <div className="space-y-8">
            {/* Section 1: Infos générales */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span>
                Infos générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminDropdown
                  label="Gamme"
                  required
                  value={form.gammeId}
                  onChange={val => setForm(prev => ({ ...prev, gammeId: val }))}
                  options={gammeFormOptions}
                  error={errors.gammeId}
                  searchable
                />
                <AdminInput
                  label="Nom"
                  required
                  value={form.nom}
                  onChange={e => {
                    const nom = e.target.value
                    setForm(prev => ({
                      ...prev,
                      nom,
                      slug: !editingId ? generateSlug(nom) : prev.slug,
                    }))
                  }}
                  placeholder="Premium"
                  error={errors.nom}
                />
                <AdminInput
                  label="Slug"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="premium"
                />
                <AdminDropdown
                  label="Statut"
                  required
                  value={form.statut}
                  onChange={val => setForm(prev => ({ ...prev, statut: val as Offre['statut'] }))}
                  options={statutOptions}
                />
                <AdminInput
                  label="Badge"
                  value={form.badge}
                  onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Populaire, Meilleur rapport..."
                />
                <AdminInput
                  label="URL de commande"
                  value={form.orderUrl}
                  onChange={e => setForm(prev => ({ ...prev, orderUrl: e.target.value }))}
                  placeholder="https://client.lklcloud.fr/index.php?rp=/store/..."
                />
              </div>
              <div className="mt-4">
                <AdminCheckbox
                  label="Mettre en avant (recommandé)"
                  checked={form.misEnAvant}
                  onChange={misEnAvant => setForm(prev => ({ ...prev, misEnAvant }))}
                />
              </div>
            </div>

            {/* Section 2: Contenu */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span>
                Contenu
              </h3>
              <div className="space-y-4">
                <AdminInput
                  label="Tagline"
                  value={form.tagline}
                  onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Performances optimales"
                />
                <AdminTextarea
                  label="Description"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée de l'offre..."
                  rows={3}
                />
              </div>
            </div>

            {/* Section 3: Features */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">3</span>
                Caractéristiques
              </h3>
              <AdminTagInput
                label="Features"
                tags={form.features}
                onChange={features => setForm(prev => ({ ...prev, features }))}
                placeholder="Ex: 8 vCores, 16 Go RAM..."
              />
            </div>

            {/* Section 4: Spécifications techniques */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">4</span>
                Spécifications techniques
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="RAM"
                  value={form.specs.ram}
                  onChange={e => setForm(prev => ({ ...prev, specs: { ...prev.specs, ram: e.target.value } }))}
                  placeholder="4 Go RAM"
                />
                <AdminInput
                  label="CPU"
                  value={form.specs.cpu}
                  onChange={e => setForm(prev => ({ ...prev, specs: { ...prev.specs, cpu: e.target.value } }))}
                  placeholder="2 vCPU"
                />
                <AdminInput
                  label="Stockage"
                  value={form.specs.storage}
                  onChange={e => setForm(prev => ({ ...prev, specs: { ...prev.specs, storage: e.target.value } }))}
                  placeholder="50 Go NVMe"
                />
                <AdminInput
                  label="Bande passante"
                  value={form.specs.bandwidth}
                  onChange={e => setForm(prev => ({ ...prev, specs: { ...prev.specs, bandwidth: e.target.value } }))}
                  placeholder="10 Gbps"
                />
              </div>
            </div>

            {/* Section 5: Prix par cycle */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">5</span>
                Prix par cycle
              </h3>
              <div className="space-y-3">
                {/* Mensuel */}
                <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[var(--admin-text-primary)]">Mensuel</span>
                    <AdminSwitch
                      label="Afficher"
                      checked={form.prix.afficherMensuel}
                      onChange={v => setForm(prev => ({ ...prev, prix: { ...prev.prix, afficherMensuel: v } }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={form.prix.mensuel}
                      onChange={e => setForm(prev => ({ ...prev, prix: { ...prev.prix, mensuel: parseFloat(e.target.value) || 0 } }))}
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none transition-all duration-300 focus:border-[var(--admin-primary)]/50 focus:ring-1 focus:ring-[var(--admin-input-focus)]"
                    />
                    <span className="text-sm text-[var(--admin-text-muted)] font-medium whitespace-nowrap">€/mois</span>
                  </div>
                </div>

                {/* Trimestriel */}
                <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--admin-text-primary)]">Trimestriel</span>
                      {(form.prix.mensuel ?? 0) > 0 && (form.prix.trimestriel ?? 0) > 0 && (
                        <span className="text-xs text-[var(--admin-success)] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--admin-success)]/10">
                          -{Math.round((1 - (form.prix.trimestriel ?? 0) / (form.prix.mensuel ?? 1)) * 100)}%
                        </span>
                      )}
                    </div>
                    <AdminSwitch
                      label="Afficher"
                      checked={form.prix.afficherTrimestriel}
                      onChange={v => setForm(prev => ({ ...prev, prix: { ...prev.prix, afficherTrimestriel: v } }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={form.prix.trimestriel}
                      onChange={e => setForm(prev => ({ ...prev, prix: { ...prev.prix, trimestriel: parseFloat(e.target.value) || 0 } }))}
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none transition-all duration-300 focus:border-[var(--admin-primary)]/50 focus:ring-1 focus:ring-[var(--admin-input-focus)]"
                    />
                    <span className="text-sm text-[var(--admin-text-muted)] font-medium whitespace-nowrap">€/mois</span>
                  </div>
                </div>

                {/* Annuel */}
                <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--admin-text-primary)]">Annuel</span>
                      {(form.prix.mensuel ?? 0) > 0 && (form.prix.annuel ?? 0) > 0 && (
                        <span className="text-xs text-[var(--admin-success)] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--admin-success)]/10">
                          -{Math.round((1 - (form.prix.annuel ?? 0) / (form.prix.mensuel ?? 1)) * 100)}%
                        </span>
                      )}
                    </div>
                    <AdminSwitch
                      label="Afficher"
                      checked={form.prix.afficherAnnuel}
                      onChange={v => setForm(prev => ({ ...prev, prix: { ...prev.prix, afficherAnnuel: v } }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={form.prix.annuel}
                      onChange={e => setForm(prev => ({ ...prev, prix: { ...prev.prix, annuel: parseFloat(e.target.value) || 0 } }))}
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none transition-all duration-300 focus:border-[var(--admin-primary)]/50 focus:ring-1 focus:ring-[var(--admin-input-focus)]"
                    />
                    <span className="text-sm text-[var(--admin-text-muted)] font-medium whitespace-nowrap">€/mois</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Planification */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">5</span>
                Planification
              </h3>
              <ScheduleFields
                value={form.scheduleConfig}
                onChange={scheduleConfig => setForm(prev => ({ ...prev, scheduleConfig }))}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setPreviewOpen(prev => !prev)} icon={<Eye size={16} />}>
                {previewOpen ? 'Masquer l\'aperçu' : 'Aperçu'}
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => { setDialogOpen(false); setPreviewOpen(false) }}>Annuler</AdminButton>
              <AdminButton variant="warning" onClick={async () => { setForm(prev => ({ ...prev, statut: 'brouillon' })); await handleSubmit() }}>Brouillon</AdminButton>
              <AdminButton onClick={handleSubmit}>{editingId ? 'Enregistrer' : 'Publier'}</AdminButton>
            </div>
          </div>

          {/* Preview panel */}
          {previewOpen && (
            <div className="xl:sticky xl:top-0 xl:self-start">
              <LivePreview>
                <OffrePreview
                  nom={form.nom}
                  prix={form.prix}
                  features={form.features}
                  specs={form.specs}
                  badge={form.badge}
                  misEnAvant={form.misEnAvant}
                />
              </LivePreview>
            </div>
          )}
          </div>
        </AdminDialog>

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmDelete !== null}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
          title="Supprimer l'offre ?"
          message="Cette offre sera définitivement supprimée. Cette action est irréversible."
        />

        {/* Bulk delete confirm */}
        <ConfirmDialog
          open={confirmBulkDelete}
          onCancel={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
          title={`Supprimer ${selectedCount} offre${selectedCount > 1 ? 's' : ''} ?`}
          message="Les offres sélectionnées seront définitivement supprimées. Cette action est irréversible."
        />

        {/* Floating action bar */}
        <FloatingActionBar selectedCount={selectedCount} onClearSelection={clearSelection}>
          <button
            onClick={() => handleBulkStatus('actif')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--admin-success)] hover:bg-[var(--admin-success)]/10 transition-colors"
          >
            <CheckCircle size={14} />
            Activer
          </button>
          <button
            onClick={() => handleBulkStatus('brouillon')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--admin-warning)] hover:bg-[var(--admin-warning)]/10 transition-colors"
          >
            <FileText size={14} />
            Brouillon
          </button>
          <button
            onClick={() => handleBulkStatus('archive')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface)] transition-colors"
          >
            <Archive size={14} />
            Archiver
          </button>
          <button
            onClick={() => handleBulkMisEnAvant(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors"
          >
            <Star size={14} />
            Mettre en avant
          </button>
          <div className="w-px h-5 bg-[var(--admin-border)]" />
          <button
            onClick={() => setConfirmBulkDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-colors"
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </FloatingActionBar>

        {/* Version history */}
        {versionHistoryOffre && (
          <VersionHistory
            open={versionHistoryId !== null}
            onClose={() => setVersionHistoryId(null)}
            entityId={versionHistoryOffre.id}
            entityType="offre"
            entityName={versionHistoryOffre.nom}
            currentData={versionHistoryOffre as unknown as Record<string, unknown>}
            onRestore={handleRestoreOffre}
          />
        )}
      </div>
    </PageContainer>
  )
}
