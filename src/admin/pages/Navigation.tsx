import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { AdminInput } from '../components/FormFields'
import { AdminDropdown } from '../components/AdminDropdown'
import { AdminButton } from '../components/AdminButton'
import { SortableTableRow } from '../components/SortableTableRow'
import { Plus, Pencil, Trash2, Folder, Layers } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import type { NavGroup } from '../lib/types'

const colorOptions = [
  { value: 'bg-primary', label: 'Orange' },
  { value: 'bg-emerald-500', label: 'Vert' },
  { value: 'bg-blue-500', label: 'Bleu' },
  { value: 'bg-purple-500', label: 'Violet' },
  { value: 'bg-amber-500', label: 'Jaune' },
  { value: 'bg-rose-500', label: 'Rose' },
]

const iconOptions = [
  { value: 'Gamepad2', label: 'Gamepad2' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Server', label: 'Server' },
  { value: 'Package', label: 'Package' },
]

const emptyGroupForm = { label: '', color: 'bg-primary', icon: 'Package', ordre: 1 }

export default function Navigation() {
  const { navGroups, gammes, addNavGroup, updateNavGroup, deleteNavGroup, reorderNavGroups } = useAdmin()
  const navigate = useNavigate()

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [groupForm, setGroupForm] = useState(emptyGroupForm)
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<string | null>(null)

  const sortedGroups = [...navGroups].sort((a, b) => a.ordre - b.ordre)
  const groupIds = sortedGroups.map(g => g.id)

  const openCreateGroup = () => {
    setEditingGroupId(null)
    setGroupForm({ ...emptyGroupForm, ordre: navGroups.length + 1 })
    setGroupDialogOpen(true)
  }
  const openEditGroup = (g: NavGroup) => {
    setEditingGroupId(g.id)
    setGroupForm({ label: g.label, color: g.color, icon: g.icon, ordre: g.ordre })
    setGroupDialogOpen(true)
  }
  const handleSubmitGroup = async () => {
    if (!groupForm.label.trim()) return
    try {
      if (editingGroupId) await updateNavGroup(editingGroupId, groupForm)
      else await addNavGroup(groupForm)
      setGroupDialogOpen(false)
    } catch { /* error handled by context toast */ }
  }
  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteNavGroup(id)
      if (selectedGroupId === id) setSelectedGroupId(null)
      setConfirmDeleteGroup(null)
    } catch { /* error handled by context toast */ }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleGroupDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = groupIds.indexOf(String(active.id))
    const newIndex = groupIds.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    reorderNavGroups(arrayMove(groupIds, oldIndex, newIndex))
  }, [groupIds, reorderNavGroups])

  return (
    <PageContainer
      title="Navigation"
      description="Créez vos catégories (titre, couleur, icône). Pour qu'une catégorie apparaisse sur le site, allez ensuite dans Gammes et assignez-lui des produits."
      actions={<AdminButton onClick={openCreateGroup} icon={<Plus size={16} />}>Nouveau groupe</AdminButton>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
          <div className="admin-card rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--admin-border)] text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
              Groupes
            </div>
            <SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
              <div>
                {sortedGroups.map((g, i) => {
                  const gammeCount = gammes.filter(gm => gm.category === g.id).length
                  return (
                    <SortableTableRow
                      key={g.id}
                      id={g.id}
                      className={`flex items-center gap-3 px-5 py-3.5 border-b border-[var(--admin-border)] last:border-0 cursor-pointer ${
                        i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''
                      } ${selectedGroupId === g.id ? 'bg-[var(--admin-primary-surface)]' : ''}`}
                    >
                      <button className="flex-1 flex items-center gap-3 text-left" onClick={() => setSelectedGroupId(g.id)}>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${g.color}`} />
                        <span className="text-sm font-medium text-[var(--admin-text-primary)]">{g.label}</span>
                        <AdminBadge variant={gammeCount > 0 ? 'success' : 'warning'}>
                          {gammeCount > 0 ? `${gammeCount} gamme${gammeCount > 1 ? 's' : ''}` : 'Vide — invisible sur le site'}
                        </AdminBadge>
                      </button>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditGroup(g)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier"><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDeleteGroup(g.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer"><Trash2 size={15} /></button>
                      </div>
                    </SortableTableRow>
                  )
                })}
                {navGroups.length === 0 && (
                  <div className="text-center py-12 text-[var(--admin-text-muted)] text-sm">
                    Aucun groupe. Cliquez sur "Nouveau groupe" pour commencer.
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </DndContext>

        {/* Gammes assigned to selected group (read-only — set from the Gammes page) */}
        <div className="admin-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--admin-border)]">
            <span className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">
              {selectedGroupId ? `Gammes — ${navGroups.find(g => g.id === selectedGroupId)?.label ?? ''}` : 'Gammes du groupe'}
            </span>
            <AdminButton variant="secondary" onClick={() => navigate('/apps/management/gammes')} icon={<Layers size={14} />}>
              Aller dans Gammes
            </AdminButton>
          </div>
          {!selectedGroupId && (
            <div className="flex flex-col items-center gap-2 text-center py-12 text-[var(--admin-text-muted)] text-sm">
              <Folder size={24} />
              Sélectionnez un groupe à gauche.
            </div>
          )}
          {selectedGroupId && (
            <div>
              {gammes.filter(g => g.category === selectedGroupId).map((g, i) => (
                <div
                  key={g.id}
                  className={`flex items-center gap-3 px-5 py-3.5 border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate">{g.nom}</p>
                    <code className="text-xs text-[var(--admin-text-secondary)]">/produits/{g.slug}</code>
                  </div>
                  <AdminBadge variant={g.actif ? 'success' : 'neutral'}>{g.actif ? 'Actif' : 'Inactif'}</AdminBadge>
                </div>
              ))}
              {gammes.filter(g => g.category === selectedGroupId).length === 0 && (
                <div className="flex flex-col items-center gap-2 text-center py-12 px-6 text-[var(--admin-text-muted)] text-sm">
                  Aucune gamme dans ce groupe, donc invisible sur le site.
                  <span>Ouvrez une gamme dans <strong>Gammes</strong> et choisissez cette catégorie dans le menu déroulant.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Group dialog */}
      <AdminDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        title={editingGroupId ? 'Modifier le groupe' : 'Nouveau groupe'}
        description="Le titre, la couleur et l'icône affichés sur le site. Les gammes se choisissent dans la page Gammes."
      >
        <div className="space-y-4">
          <AdminInput label="Nom du groupe" required value={groupForm.label} onChange={e => setGroupForm(prev => ({ ...prev, label: e.target.value }))} placeholder="Serveurs Games" />
          <div className="grid grid-cols-2 gap-4">
            <AdminDropdown label="Couleur" value={groupForm.color} onChange={val => setGroupForm(prev => ({ ...prev, color: val }))} options={colorOptions} />
            <AdminDropdown label="Icône" value={groupForm.icon} onChange={val => setGroupForm(prev => ({ ...prev, icon: val }))} options={iconOptions} searchable />
          </div>
          <AdminInput label="Ordre d'affichage" type="number" min={1} value={groupForm.ordre} onChange={e => setGroupForm(prev => ({ ...prev, ordre: parseInt(e.target.value) || 1 }))} />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
            <AdminButton variant="secondary" onClick={() => setGroupDialogOpen(false)}>Annuler</AdminButton>
            <AdminButton onClick={handleSubmitGroup}>{editingGroupId ? 'Enregistrer' : 'Créer'}</AdminButton>
          </div>
        </div>
      </AdminDialog>

      <ConfirmDialog
        open={confirmDeleteGroup !== null}
        onCancel={() => setConfirmDeleteGroup(null)}
        onConfirm={() => confirmDeleteGroup && handleDeleteGroup(confirmDeleteGroup)}
        title="Supprimer le groupe ?"
        message="Les gammes de ce groupe n'auront plus de catégorie. Cette action est irréversible."
      />
    </PageContainer>
  )
}
