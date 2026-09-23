import { useState, useCallback } from 'react'
import { useAdmin } from '../lib/context'
import { useSelection } from '../hooks/useSelection'
import { PageContainer } from '../components/PageContainer'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FloatingActionBar } from '../components/FloatingActionBar'
import { AdminInput, AdminTextarea, AdminTableCheckbox } from '../components/FormFields'
import { SpotlightCard } from '../components/reactbits'
import { AvatarUpload } from '../components/AvatarUpload'
import { uploadAvatar, deleteAvatar } from '../lib/storage'
import { Users, Share2, Plus, Pencil, Trash2, Copy } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SortableCard } from '../components/SortableCard'
import type { DragEndEvent } from '@dnd-kit/core'
import type { TeamMemberAdmin } from '../lib/types'

const emptyForm = { name: '', role: '', bio: '', avatar: '', socials: { twitter: '', linkedin: '', github: '' }, ordre: 1 }

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export default function Equipe() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, cloneTeamMember, reorderTeam, bulkDeleteTeam } = useAdmin()
  const { toggleOne, isSelected, clearSelection, selectedCount, selected } = useSelection(team)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [uploadId, setUploadId] = useState<string>('')

  const handleBulkDelete = async () => {
    await bulkDeleteTeam([...selected])
    clearSelection()
    setConfirmBulkDelete(false)
  }

  const membresAvecSociaux = team.filter(m => m.socials.twitter || m.socials.linkedin || m.socials.github).length

  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm, ordre: team.length + 1 }); setErrors({}); setUploadId(crypto.randomUUID()); setDialogOpen(true) }
  const openEdit = (m: TeamMemberAdmin) => {
    setEditingId(m.id)
    setForm({ name: m.name, role: m.role, bio: m.bio, avatar: m.avatar, socials: { twitter: m.socials.twitter ?? '', linkedin: m.socials.linkedin ?? '', github: m.socials.github ?? '' }, ordre: m.ordre })
    setErrors({}); setUploadId(m.id); setDialogOpen(true)
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const url = await uploadAvatar(file, uploadId)
    setForm(prev => ({ ...prev, avatar: url }))
    return url
  }

  const handleAvatarRemove = async () => {
    if (!form.avatar) return
    await deleteAvatar(form.avatar)
    setForm(prev => ({ ...prev, avatar: '' }))
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Le nom est requis'
    if (!form.role.trim()) errs.role = 'Le rôle est requis'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    try {
      const payload = { name: form.name.trim(), role: form.role.trim(), bio: form.bio.trim(), avatar: form.avatar.trim(), socials: { twitter: form.socials.twitter.trim() || undefined, linkedin: form.socials.linkedin.trim() || undefined, github: form.socials.github.trim() || undefined }, ordre: form.ordre }
      if (editingId) await updateTeamMember(editingId, payload)
      else await addTeamMember(payload)
      setDialogOpen(false)
    } catch { /* context toast */ }
  }

  const handleDelete = async (id: string) => { try { await deleteTeamMember(id); setConfirmDelete(null) } catch { /* toast */ } }
  const sortedTeam = [...team].sort((a, b) => a.ordre - b.ordre)
  const sortedIds = sortedTeam.map(m => m.id)

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
    reorderTeam(reordered)
  }, [sortedIds, reorderTeam])

  return (
    <PageContainer title="Équipe" description="Gérez les membres de l'équipe affichés sur le site" actions={
      <AdminButton onClick={openCreate} icon={<Plus size={16} />}>Nouveau membre</AdminButton>
    }>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard label="Total membres" value={team.length} icon={<Users size={20} />} color="orange" />
          <KPICard label="Avec réseaux sociaux" value={membresAvecSociaux} icon={<Share2 size={20} />} color="cyan" />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTeam.map(m => (
                <SortableCard key={m.id} id={m.id} className="cursor-grab active:cursor-grabbing">
                  <SpotlightCard className={`!p-5 group relative ${isSelected(m.id) ? 'ring-2 ring-[var(--admin-primary)] ring-offset-1' : ''}`}>
                    {/* Selection checkbox */}
                    <div className="absolute top-3 left-3 z-10" onClick={e => e.stopPropagation()}>
                      <AdminTableCheckbox checked={isSelected(m.id)} onChange={() => toggleOne(m.id)} />
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier"><Pencil size={15} /></button>
                      <button onClick={() => cloneTeamMember(m.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Dupliquer"><Copy size={15} /></button>
                      <button onClick={() => setConfirmDelete(m.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer"><Trash2 size={15} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-[var(--admin-border)]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--admin-primary)]/20 to-[var(--admin-primary-dark)]/10 border border-[var(--admin-primary)]/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-[var(--admin-primary)]">{getInitials(m.name)}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--admin-text-primary)] truncate">{m.name}</p>
                        <p className="text-xs text-[var(--admin-text-secondary)] truncate">{m.role}</p>
                      </div>
                      <AdminBadge variant="neutral">{`#${m.ordre}`}</AdminBadge>
                    </div>
                  </SpotlightCard>
                </SortableCard>
              ))}
              {team.length === 0 && <div className="col-span-full admin-card rounded-2xl p-12 text-center"><p className="text-sm text-[var(--admin-text-muted)]">Aucun membre.</p></div>}
            </div>
          </SortableContext>
        </DndContext>

        <AdminDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editingId ? 'Modifier le membre' : 'Nouveau membre'} description={editingId ? 'Modifiez les informations' : "Ajoutez un nouveau membre"} size="lg">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span> Identité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput label="Nom" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Jean Dupont" error={errors.name} />
                <AdminInput label="Rôle" required value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))} placeholder="Président" error={errors.role} />
              </div>
              <div className="mt-4 space-y-4">
                <AdminTextarea label="Bio" value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="Courte biographie..." rows={3} />
                <div>
                  <p className="mb-2 text-sm font-medium text-[var(--admin-text-secondary)]">Photo</p>
                  <AvatarUpload currentUrl={form.avatar || undefined} onUpload={handleAvatarUpload} onRemove={form.avatar ? handleAvatarRemove : undefined} size={88} />
                </div>
                <AdminInput label="Ou coller une URL d'image" value={form.avatar} onChange={e => setForm(prev => ({ ...prev, avatar: e.target.value }))} placeholder="https://example.com/avatar.jpg" />
                <AdminInput label="Ordre" type="number" min={1} value={form.ordre} onChange={e => setForm(prev => ({ ...prev, ordre: parseInt(e.target.value) || 1 }))} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span> Réseaux sociaux</h3>
              <div className="space-y-4">
                <AdminInput label="Twitter" value={form.socials.twitter} onChange={e => setForm(prev => ({ ...prev, socials: { ...prev.socials, twitter: e.target.value } }))} placeholder="https://twitter.com/..." />
                <AdminInput label="LinkedIn" value={form.socials.linkedin} onChange={e => setForm(prev => ({ ...prev, socials: { ...prev.socials, linkedin: e.target.value } }))} placeholder="https://linkedin.com/in/..." />
                <AdminInput label="GitHub" value={form.socials.github} onChange={e => setForm(prev => ({ ...prev, socials: { ...prev.socials, github: e.target.value } }))} placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmit}>{editingId ? 'Enregistrer' : 'Ajouter'}</AdminButton>
            </div>
          </div>
        </AdminDialog>

        <ConfirmDialog open={confirmDelete !== null} onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} title="Supprimer le membre ?" message="Le membre sera retiré du site. Action irréversible." />

        {/* Bulk delete confirm */}
        <ConfirmDialog
          open={confirmBulkDelete}
          onCancel={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
          title={`Supprimer ${selectedCount} membre${selectedCount > 1 ? 's' : ''} ?`}
          message="Les membres sélectionnés seront définitivement supprimés du site."
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
      </div>
    </PageContainer>
  )
}
