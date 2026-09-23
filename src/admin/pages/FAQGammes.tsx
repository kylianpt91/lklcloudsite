import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAdmin } from '../lib/context'
import { useSelection } from '../hooks/useSelection'
import { PageContainer } from '../components/PageContainer'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FloatingActionBar } from '../components/FloatingActionBar'
import { AdminInput, AdminTextarea, AdminTableCheckbox } from '../components/FormFields'
import { HelpCircle, Plus, Pencil, Trash2, MessageSquare, Globe, Copy, Eye, ChevronDown } from 'lucide-react'
import { AdminButton } from '../components/AdminButton'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SortableTableRow } from '../components/SortableTableRow'
import { LivePreview } from '../components/LivePreview'
import { FAQPreview } from '../components/preview/FAQPreview'
import { motion, AnimatePresence } from 'framer-motion'
import type { DragEndEvent } from '@dnd-kit/core'

const emptyForm = {
  gammeId: '',
  question: '',
  reponse: '',
  position: 1,
}

export default function FAQGammes() {
  const { gammes, faq, addFAQ, updateFAQ, deleteFAQ, cloneFAQ, reorderFAQ, bulkDeleteFAQ } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()

  // Default to 'global' if no gamme is selected
  const selectedGammeId = searchParams.get('gamme') || 'global'

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const filteredFAQ = useMemo(
    () => faq.filter(f => f.gammeId === selectedGammeId).sort((a, b) => a.position - b.position),
    [faq, selectedGammeId],
  )

  const { toggleOne, toggleAll, isSelected, clearSelection, selectedCount, allSelected, selected } = useSelection(filteredFAQ)

  const handleBulkDelete = async () => {
    await bulkDeleteFAQ([...selected])
    clearSelection()
    setConfirmBulkDelete(false)
  }

  const selectedGamme = gammes.find(g => g.id === selectedGammeId)
  const isGlobal = selectedGammeId === 'global'

  const openCreate = () => {
    const maxPos = filteredFAQ.reduce((max, f) => Math.max(max, f.position), 0)
    setEditingId(null)
    setForm({ gammeId: selectedGammeId, question: '', reponse: '', position: maxPos + 1 })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (item: typeof faq[0]) => {
    setEditingId(item.id)
    setForm({ gammeId: item.gammeId, question: item.question, reponse: item.reponse, position: item.position })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.question.trim()) errs.question = 'La question est requise'
    if (!form.reponse.trim()) errs.reponse = 'La réponse est requise'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (editingId) {
        await updateFAQ(editingId, form)
      } else {
        await addFAQ(form)
      }
      setDialogOpen(false)
    } catch {
      // error handled by context toast
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id)
      setConfirmDelete(null)
    } catch {
      // error handled by context toast
    }
  }

  const filteredIds = filteredFAQ.map(f => f.id)

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
    reorderFAQ(reordered)
  }, [filteredIds, reorderFAQ])

  return (
    <PageContainer
      title="FAQ Gammes"
      description="Gérez les questions fréquentes par gamme"
      actions={
        <AdminButton onClick={openCreate} icon={<Plus size={16} />}>Nouvelle question</AdminButton>
      }
    >
      <div className="space-y-6">
        {/* Gamme selector tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {/* FAQ Globales tab */}
          <button
            onClick={() => setSearchParams({ gamme: 'global' })}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              isGlobal
                ? 'bg-[var(--admin-info-surface)] text-[var(--admin-info)] border border-[var(--admin-info)]/30'
                : 'text-[var(--admin-text-muted)] border border-[var(--admin-border)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface)]'
            }`}
          >
            <Globe size={14} />
            FAQ Globales
            <span className="text-xs opacity-60">
              ({faq.filter(f => f.gammeId === 'global').length})
            </span>
          </button>

          {/* Gamme tabs */}
          {gammes.map(g => (
            <button
              key={g.id}
              onClick={() => setSearchParams({ gamme: g.id })}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedGammeId === g.id
                  ? 'bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] border border-[var(--admin-primary)]/30'
                  : 'text-[var(--admin-text-muted)] border border-[var(--admin-border)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface)]'
              }`}
            >
              {g.nom}
              <span className="ml-2 text-xs opacity-60">
                ({faq.filter(f => f.gammeId === g.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* FAQ info */}
        <div className="flex items-center gap-3 p-4 admin-card">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGlobal ? 'bg-[var(--admin-info-surface)]' : 'bg-[var(--admin-primary-surface)]'}`}>
            {isGlobal ? (
              <Globe size={18} className="text-[var(--admin-info)]" />
            ) : (
              <HelpCircle size={18} className="text-[var(--admin-primary)]" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">
              {isGlobal ? 'FAQ Globales' : `FAQ — ${selectedGamme?.nom ?? ''}`}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">
              {filteredFAQ.length} question{filteredFAQ.length !== 1 ? 's' : ''}
              {isGlobal && ' — Affichées sur la page d\'accueil'}
            </p>
          </div>
        </div>

        {/* Table */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="admin-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    <th className="px-5 py-3.5 w-10">
                      <AdminTableCheckbox checked={allSelected} onChange={toggleAll} />
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 w-8" />
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Question</th>
                    <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Réponse (aperçu)</th>
                    <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5 w-20">Position</th>
                    <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <SortableContext items={filteredIds} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {filteredFAQ.map((item, i) => (
                      <SortableTableRow key={item.id} id={item.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''} ${isSelected(item.id) ? 'bg-[var(--admin-primary-surface)]' : ''}`}>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <AdminTableCheckbox checked={isSelected(item.id)} onChange={() => toggleOne(item.id)} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2.5">
                            <MessageSquare size={14} className="text-[var(--admin-primary)] mt-0.5 shrink-0" />
                            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{item.question}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-sm text-[var(--admin-text-muted)] truncate max-w-xs">{item.reponse}</p>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--admin-surface)] text-xs font-semibold text-[var(--admin-text-secondary)]">{item.position}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary-surface)] transition-colors" title="Modifier"><Pencil size={15} /></button>
                            <button onClick={() => cloneFAQ(item.id)} className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary-surface)] transition-colors" title="Dupliquer"><Copy size={15} /></button>
                            <button onClick={() => setConfirmDelete(item.id)} className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </SortableTableRow>
                    ))}
                    {filteredFAQ.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-[var(--admin-text-muted)] text-sm">
                          {isGlobal
                            ? 'Aucune FAQ globale. Cliquez sur "Nouvelle question" pour commencer.'
                            : 'Aucune question pour cette gamme. Cliquez sur "Nouvelle question" pour commencer.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </SortableContext>
              </table>
            </div>
          </div>
        </DndContext>

        {/* Preview toggle */}
        <button
          onClick={() => setPreviewOpen(prev => !prev)}
          className="w-full admin-card !p-4 flex items-center gap-3 hover:border-[var(--admin-primary)]/30 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-primary-surface)] flex items-center justify-center shrink-0">
            <Eye size={16} className="text-[var(--admin-primary)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">Aperçu public</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Visualisez le rendu de la FAQ telle qu'elle apparaîtra sur le site</p>
          </div>
          <motion.div animate={{ rotate: previewOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-[var(--admin-text-muted)]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {previewOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <LivePreview>
                <FAQPreview
                  items={filteredFAQ.map(f => ({ question: f.question, answer: f.reponse }))}
                />
              </LivePreview>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create/Edit Dialog */}
        <AdminDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingId ? 'Modifier la question' : 'Nouvelle question'}
          description={isGlobal ? 'FAQ globale du site' : (selectedGamme ? `FAQ pour ${selectedGamme.nom}` : '')}
          size="md"
        >
          <div className="space-y-5">
            <AdminInput
              label="Question"
              required
              value={form.question}
              onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Quels moyens de paiement acceptez-vous ?"
              error={errors.question}
            />
            <AdminTextarea
              label="Réponse"
              required
              value={form.reponse}
              onChange={e => setForm(prev => ({ ...prev, reponse: e.target.value }))}
              placeholder="Nous acceptons les cartes bancaires..."
              rows={4}
              error={errors.reponse}
            />
            <AdminInput
              label="Position"
              type="number"
              min={1}
              value={form.position}
              onChange={e => setForm(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmit}>{editingId ? 'Enregistrer' : 'Ajouter'}</AdminButton>
            </div>
          </div>
        </AdminDialog>

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmDelete !== null}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
          title="Supprimer la question ?"
          message="Cette question sera définitivement supprimée."
        />

        {/* Bulk delete confirm */}
        <ConfirmDialog
          open={confirmBulkDelete}
          onCancel={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
          title={`Supprimer ${selectedCount} question${selectedCount > 1 ? 's' : ''} ?`}
          message="Les questions sélectionnées seront définitivement supprimées."
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
