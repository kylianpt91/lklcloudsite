import { useState, useCallback } from 'react'
import { useAdmin } from '../lib/context'
import { useSelection } from '../hooks/useSelection'
import { PageContainer } from '../components/PageContainer'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FloatingActionBar } from '../components/FloatingActionBar'
import { VersionHistory } from '../components/VersionHistory'
import { AdminInput, AdminTextarea, AdminCheckbox, AdminTagInput, AdminTableCheckbox } from '../components/FormFields'
import { AdminDropdown } from '../components/AdminDropdown'
import { Layers, Activity, Plus, Pencil, Trash2, HelpCircle, Copy, History } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import { useNavigate } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SortableTableRow } from '../components/SortableTableRow'
import type { DragEndEvent } from '@dnd-kit/core'
import { ScheduleFields, getScheduleStatus } from '../components/ScheduleFields'
import type { Gamme, ScheduleConfig } from '../lib/types'

const iconOptions = [
  { value: 'Globe', label: 'Globe' },
  { value: 'Server', label: 'Server' },
  { value: 'Gamepad2', label: 'Gamepad2' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'Code', label: 'Code' },
  { value: 'Cpu', label: 'Cpu' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Car', label: 'Car' },
  { value: 'Pickaxe', label: 'Pickaxe' },
  { value: 'Wrench', label: 'Wrench' },
  { value: 'Skull', label: 'Skull' },
  { value: 'Flame', label: 'Flame' },
  { value: 'Swords', label: 'Swords' },
  { value: 'Braces', label: 'Braces' },
  { value: 'Package', label: 'Package' },
]

const emptyForm = {
  nom: '',
  shortName: '',
  slug: '',
  description: '',
  icon: 'Globe',
  category: '',
  heroTitle: '',
  heroDescription: '',
  useCases: [] as string[],
  comingSoon: false,
  actif: true,
  ordre: 1,
  scheduleConfig: {} as ScheduleConfig,
}

export default function Gammes() {
  const { gammes, offres, navGroups, addGamme, updateGamme, deleteGamme, cloneGamme, reorderGammes, bulkDeleteGammes } = useAdmin()
  const categoryOptions = navGroups
    .slice()
    .sort((a, b) => a.ordre - b.ordre)
    .map(g => ({ value: g.id, label: g.label }))
  const navigate = useNavigate()
  const { toggleOne, toggleAll, isSelected, clearSelection, selectedCount, allSelected, selected } = useSelection(gammes)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [versionHistoryId, setVersionHistoryId] = useState<string | null>(null)

  const versionHistoryGamme = versionHistoryId ? gammes.find(g => g.id === versionHistoryId) : null

  const handleRestoreGamme = useCallback(async (data: Record<string, unknown>) => {
    if (!versionHistoryId) return
    const { createdAt: _c, updatedAt: _u, ...restoreData } = data
    await updateGamme(versionHistoryId, restoreData as Partial<Gamme>)
  }, [versionHistoryId, updateGamme])

  const gammesActives = gammes.filter(g => g.actif).length

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, ordre: gammes.length + 1 })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (g: Gamme) => {
    setEditingId(g.id)
    setForm({
      nom: g.nom,
      shortName: g.shortName,
      slug: g.slug,
      description: g.description,
      icon: g.icon,
      category: g.category,
      heroTitle: g.heroTitle,
      heroDescription: g.heroDescription,
      useCases: [...g.useCases],
      comingSoon: g.comingSoon,
      actif: g.actif,
      ordre: g.ordre,
      scheduleConfig: g.scheduleConfig ?? {},
    })
    setErrors({})
    setDialogOpen(true)
  }

  const generateSlug = (nom: string) =>
    nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.nom.trim()) errs.nom = 'Le nom est requis'
    if (!form.shortName.trim()) errs.shortName = 'Le nom court est requis'
    if (!form.slug.trim()) errs.slug = 'Le slug est requis'
    const slugExists = gammes.some(g => g.slug === form.slug && g.id !== editingId)
    if (slugExists) errs.slug = 'Ce slug existe déjà'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (editingId) {
        await updateGamme(editingId, form)
      } else {
        await addGamme(form)
      }
      setDialogOpen(false)
    } catch {
      // error handled by context toast
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGamme(id)
      setConfirmDelete(null)
    } catch {
      // error handled by context toast
    }
  }

  const handleBulkDelete = async () => {
    await bulkDeleteGammes([...selected])
    clearSelection()
    setConfirmBulkDelete(false)
  }

  const sortedGammes = [...gammes].sort((a, b) => a.ordre - b.ordre)
  const sortedIds = sortedGammes.map(g => g.id)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sortedIds.indexOf(String(active.id))
    const newIndex = sortedIds.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(sortedIds, oldIndex, newIndex)
    reorderGammes(reordered)
  }, [sortedIds, reorderGammes])

  return (
    <PageContainer
      title="Gammes d'hébergement"
      description="Gérez les catégories de produits"
      actions={
        <AdminButton onClick={openCreate} icon={<Plus size={16} />}>Nouvelle gamme</AdminButton>
      }
    >
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard label="Total gammes" value={gammes.length} icon={<Layers size={20} />} color="orange" />
          <KPICard label="Gammes actives" value={gammesActives} icon={<Activity size={20} />} color="green" />
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
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Nom</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Slug</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Catégorie</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Statut</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Offres liées</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">MAJ</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {sortedGammes.map((g, i) => {
                      const offreCount = offres.filter(o => o.gammeId === g.id).length
                      return (
                        <SortableTableRow key={g.id} id={g.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''} ${isSelected(g.id) ? 'bg-[var(--admin-primary-surface)]' : ''}`}>
                          <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                            <AdminTableCheckbox checked={isSelected(g.id)} onChange={() => toggleOne(g.id)} />
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{g.nom}</p>
                          </td>
                          <td className="px-5 py-4">
                            <code className="text-xs text-[var(--admin-text-secondary)] bg-[var(--admin-surface)] px-2 py-1 rounded-md font-mono">/{g.slug}</code>
                          </td>
                          <td className="px-5 py-4">
                            <AdminBadge variant="neutral">{navGroups.find(gr => gr.id === g.category)?.label ?? 'Sans catégorie'}</AdminBadge>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <AdminBadge variant={g.actif ? 'success' : 'neutral'}>
                                {g.actif ? 'Actif' : 'Inactif'}
                              </AdminBadge>
                              {g.comingSoon && <AdminBadge variant="warning">Bientôt</AdminBadge>}
                              {(() => { const s = getScheduleStatus(g.scheduleConfig); return s ? <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${s.className}`}>{s.label}</span> : null })()}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-[var(--admin-text-secondary)] font-medium">{offreCount}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-[var(--admin-text-muted)]">{formatDate(g.updatedAt)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEdit(g)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier"><Pencil size={15} /></button>
                              <button onClick={() => cloneGamme(g.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Dupliquer"><Copy size={15} /></button>
                              <button onClick={() => setVersionHistoryId(g.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-info)] hover:bg-[var(--admin-info-surface)] transition-all" title="Historique"><History size={15} /></button>
                              <button onClick={() => navigate(`/apps/management/faq?gamme=${g.id}`)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="FAQ"><HelpCircle size={15} /></button>
                              <button onClick={() => setConfirmDelete(g.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </SortableTableRow>
                      )
                    })}
                    {gammes.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-[var(--admin-text-muted)] text-sm">
                          Aucune gamme. Cliquez sur "Nouvelle gamme" pour commencer.
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
          onClose={() => setDialogOpen(false)}
          title={editingId ? 'Modifier la gamme' : 'Nouvelle gamme'}
          description={editingId ? 'Modifiez les informations de la gamme' : 'Créez une nouvelle gamme d\'hébergement'}
          size="xl"
        >
          <div className="space-y-8">
            {/* Section 1: Informations générales */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span>
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Hébergement Web"
                  error={errors.nom}
                />
                <AdminInput
                  label="Nom court"
                  required
                  value={form.shortName}
                  onChange={e => setForm(prev => ({ ...prev, shortName: e.target.value }))}
                  placeholder="Web"
                  error={errors.shortName}
                />
                <AdminInput
                  label="Slug"
                  required
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="web-hosting"
                  error={errors.slug}
                />
                <AdminDropdown
                  label="Icône"
                  value={form.icon}
                  onChange={val => setForm(prev => ({ ...prev, icon: val }))}
                  options={iconOptions}
                  searchable
                />
                <AdminDropdown
                  label="Catégorie"
                  value={form.category}
                  onChange={val => setForm(prev => ({ ...prev, category: val }))}
                  options={categoryOptions}
                />
                <AdminInput
                  label="Ordre d'affichage"
                  type="number"
                  min={1}
                  value={form.ordre}
                  onChange={e => setForm(prev => ({ ...prev, ordre: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="mt-4 space-y-4">
                <AdminTextarea
                  label="Description"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la gamme..."
                  rows={3}
                />
                <div className="flex items-center gap-6">
                  <AdminCheckbox
                    label="Gamme active (visible sur le site)"
                    checked={form.actif}
                    onChange={actif => setForm(prev => ({ ...prev, actif }))}
                  />
                  <AdminCheckbox
                    label="Prochainement (coming soon)"
                    checked={form.comingSoon}
                    onChange={comingSoon => setForm(prev => ({ ...prev, comingSoon }))}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Page produit */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span>
                Page produit
              </h3>
              <div className="space-y-4">
                <AdminInput
                  label="Titre Hero"
                  value={form.heroTitle}
                  onChange={e => setForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Hébergement Web — Performance & Fiabilité"
                />
                <AdminTextarea
                  label="Description Hero"
                  value={form.heroDescription}
                  onChange={e => setForm(prev => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="Description affichée en haut de la page produit..."
                  rows={3}
                />

                {/* Use cases via AdminTagInput */}
                <AdminTagInput
                  label="Exemples d'utilisation"
                  tags={form.useCases}
                  onChange={useCases => setForm(prev => ({ ...prev, useCases }))}
                  placeholder="Ex: Sites vitrines, blogs, portfolios..."
                />
              </div>
            </div>

            {/* Section 3: Planification */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">3</span>
                Planification
              </h3>
              <ScheduleFields
                value={form.scheduleConfig}
                onChange={scheduleConfig => setForm(prev => ({ ...prev, scheduleConfig }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmit}>{editingId ? 'Enregistrer' : 'Créer la gamme'}</AdminButton>
            </div>
          </div>
        </AdminDialog>

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmDelete !== null}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
          title="Supprimer la gamme ?"
          message="Cette action supprimera également toutes les offres et FAQ associées. Cette action est irréversible."
        />

        {/* Bulk delete confirm */}
        <ConfirmDialog
          open={confirmBulkDelete}
          onCancel={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
          title={`Supprimer ${selectedCount} gamme${selectedCount > 1 ? 's' : ''} ?`}
          message="Cette action supprimera également toutes les offres et FAQ associées. Cette action est irréversible."
        />

        {/* Floating action bar */}
        <FloatingActionBar selectedCount={selectedCount} onClearSelection={clearSelection}>
          <button
            onClick={() => setConfirmBulkDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-colors"
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </FloatingActionBar>

        {/* Version history */}
        {versionHistoryGamme && (
          <VersionHistory
            open={versionHistoryId !== null}
            onClose={() => setVersionHistoryId(null)}
            entityId={versionHistoryGamme.id}
            entityType="gamme"
            entityName={versionHistoryGamme.nom}
            currentData={versionHistoryGamme as unknown as Record<string, unknown>}
            onRestore={handleRestoreGamme}
          />
        )}
      </div>
    </PageContainer>
  )
}
