import { useState, useMemo } from 'react'
import { createEphemeralClient } from '@/lib/supabase'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { KPICard } from '../components/KPICard'
import { AdminBadge } from '../components/AdminBadge'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { AdminInput, AdminCheckbox } from '../components/FormFields'
import { AdminDropdown } from '../components/AdminDropdown'
import { AdminButton } from '../components/AdminButton'
import { AvatarUpload } from '../components/AvatarUpload'
import { uploadAvatar, deleteAvatar } from '../lib/storage'
import { seedDefaultRoles } from '../lib/seed'
import { SpotlightCard } from '../components/reactbits'
import {
  ShieldCheck,
  Users,
  Crown,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import type { AdminRole, AdminPermissions } from '../lib/types'

// ── Permission matrix definition ─────────────────────────────────────

type PermSection = keyof AdminPermissions
type PermAction = 'view' | 'create' | 'edit' | 'delete' | 'manage'

const PERM_SECTIONS: { key: PermSection; label: string; actions: PermAction[] }[] = [
  { key: 'dashboard', label: 'Dashboard', actions: ['view'] },
  { key: 'gammes', label: 'Gammes', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'offres', label: 'Offres', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'faq', label: 'FAQ', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'navigation', label: 'Navigation', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'annonces', label: 'Annonces', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'equipe', label: 'Équipe', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'hero', label: 'Hero', actions: ['view', 'edit'] },
  { key: 'maintenance', label: 'Maintenance', actions: ['view', 'edit'] },
  { key: 'historique', label: 'Historique', actions: ['view'] },
  { key: 'parametres', label: 'Paramètres', actions: ['view', 'edit'] },
  { key: 'administration', label: 'Administration', actions: ['view', 'manage'] },
]

function defaultPermissions(): AdminPermissions {
  return {
    dashboard: { view: false },
    gammes: { view: false, create: false, edit: false, delete: false },
    offres: { view: false, create: false, edit: false, delete: false },
    faq: { view: false, create: false, edit: false, delete: false },
    navigation: { view: false, create: false, edit: false, delete: false },
    annonces: { view: false, create: false, edit: false, delete: false },
    equipe: { view: false, create: false, edit: false, delete: false },
    hero: { view: false, edit: false },
    maintenance: { view: false, edit: false },
    historique: { view: false },
    parametres: { view: false, edit: false },
    administration: { view: false, manage: false },
  }
}

function countActivePermissions(permissions: AdminPermissions): number {
  let count = 0
  for (const section of Object.values(permissions)) {
    for (const val of Object.values(section)) {
      if (val) count++
    }
  }
  return count
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

// ── Component ────────────────────────────────────────────────────────

type Tab = 'users' | 'roles'

export default function Administration() {
  const {
    adminUsers, adminRoles, currentUser,
    addRole, updateRole, deleteRole,
    addAdminUser, updateAdminUser, deleteAdminUser,
    addToast,
  } = useAdmin()

  const [tab, setTab] = useState<Tab>('users')

  // ── User state ─────────────────────────────────────────────────
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [userForm, setUserForm] = useState({ email: '', password: '', displayName: '', roleId: '', avatar: '' })
  const [userErrors, setUserErrors] = useState<Record<string, string>>({})
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null)
  const [creatingUser, setCreatingUser] = useState(false)

  // ── Role state ─────────────────────────────────────────────────
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: defaultPermissions() })
  const [roleErrors, setRoleErrors] = useState<Record<string, string>>({})
  const [confirmDeleteRole, setConfirmDeleteRole] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  // ── Helpers ────────────────────────────────────────────────────

  const roleOptions = useMemo(() =>
    adminRoles.map(r => ({ value: r.id, label: r.name })),
    [adminRoles]
  )

  const getRoleName = (roleId: string) => adminRoles.find(r => r.id === roleId)?.name ?? '—'

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  // ── User CRUD handlers ────────────────────────────────────────

  const openCreateUser = () => {
    setEditingUserId(null)
    setUserForm({ email: '', password: '', displayName: '', roleId: adminRoles[0]?.id ?? '', avatar: '' })
    setUserErrors({})
    setUserDialogOpen(true)
  }

  const openEditUser = (u: typeof adminUsers[number]) => {
    setEditingUserId(u.id)
    setUserForm({ email: u.email, password: '', displayName: u.displayName, roleId: u.roleId, avatar: u.avatar ?? '' })
    setUserErrors({})
    setUserDialogOpen(true)
  }

  const validateUser = (): boolean => {
    const errs: Record<string, string> = {}
    if (!userForm.displayName.trim()) errs.displayName = 'Le nom est requis'
    if (!editingUserId) {
      if (!userForm.email.trim()) errs.email = "L'email est requis"
      if (!userForm.password || userForm.password.length < 6) errs.password = 'Min. 6 caractères'
    }
    if (!userForm.roleId) errs.roleId = 'Le rôle est requis'
    setUserErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitUser = async () => {
    if (!validateUser()) return
    setCreatingUser(true)
    try {
      if (editingUserId) {
        await updateAdminUser(editingUserId, {
          displayName: userForm.displayName.trim(),
          roleId: userForm.roleId,
          avatar: userForm.avatar || undefined,
        })
      } else {
        // Create the auth user on a throwaway client so the current admin
        // session is untouched. Requires "Confirm email" disabled in the
        // Supabase project (Authentication → Providers → Email).
        const signup = createEphemeralClient('lkl-user-signup')
        if (!signup) throw new Error('Supabase non configuré')
        const { error: signUpErr } = await signup.auth.signUp({
          email: userForm.email.trim(),
          password: userForm.password,
        })
        await signup.auth.signOut()
        // If the auth account already exists (e.g. created straight from the
        // Supabase dashboard), keep going and just link the admin record.
        if (signUpErr && !/already|registered/i.test(signUpErr.message)) {
          throw signUpErr
        }

        // Create the admin user record
        await addAdminUser({
          email: userForm.email.trim(),
          displayName: userForm.displayName.trim(),
          roleId: userForm.roleId,
          avatar: userForm.avatar || undefined,
        })
      }
      setUserDialogOpen(false)
    } catch (err) {
      addToast('error', `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`)
    } finally {
      setCreatingUser(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteAdminUser(id)
      setConfirmDeleteUser(null)
    } catch { /* context toast */ }
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const userId = editingUserId ?? 'new-' + Date.now()
    const url = await uploadAvatar(file, userId)
    setUserForm(prev => ({ ...prev, avatar: url }))
    return url
  }

  const handleAvatarRemove = async () => {
    if (userForm.avatar) {
      await deleteAvatar(userForm.avatar)
      setUserForm(prev => ({ ...prev, avatar: '' }))
    }
  }

  // ── Role CRUD handlers ────────────────────────────────────────

  const openCreateRole = () => {
    setEditingRoleId(null)
    setRoleForm({ name: '', description: '', permissions: defaultPermissions() })
    setRoleErrors({})
    setRoleDialogOpen(true)
  }

  const openEditRole = (r: AdminRole) => {
    setEditingRoleId(r.id)
    setRoleForm({ name: r.name, description: r.description, permissions: structuredClone(r.permissions) })
    setRoleErrors({})
    setRoleDialogOpen(true)
  }

  const validateRole = (): boolean => {
    const errs: Record<string, string> = {}
    if (!roleForm.name.trim()) errs.name = 'Le nom est requis'
    setRoleErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitRole = async () => {
    if (!validateRole()) return
    try {
      if (editingRoleId) {
        await updateRole(editingRoleId, { name: roleForm.name.trim(), description: roleForm.description.trim(), permissions: roleForm.permissions })
      } else {
        await addRole({ name: roleForm.name.trim(), description: roleForm.description.trim(), permissions: roleForm.permissions })
      }
      setRoleDialogOpen(false)
    } catch { /* context toast */ }
  }

  const handleDeleteRole = async (id: string) => {
    const usersWithRole = adminUsers.filter(u => u.roleId === id).length
    if (usersWithRole > 0) {
      addToast('warning', `Impossible : ${usersWithRole} utilisateur(s) utilisent ce rôle`)
      setConfirmDeleteRole(null)
      return
    }
    try {
      await deleteRole(id)
      setConfirmDeleteRole(null)
    } catch { /* context toast */ }
  }

  const togglePerm = (section: PermSection, action: string) => {
    setRoleForm(prev => {
      const perms = structuredClone(prev.permissions)
      const sectionPerms = perms[section] as Record<string, boolean>
      sectionPerms[action] = !sectionPerms[action]
      return { ...prev, permissions: perms }
    })
  }

  const handleSeedRoles = async () => {
    setSeeding(true)
    try {
      const count = await seedDefaultRoles()
      addToast('success', `${count} rôles par défaut créés`)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSeeding(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <PageContainer
      title="Administration"
      description="Gérez les utilisateurs et les rôles d'accès"
      actions={
        tab === 'users'
          ? <AdminButton onClick={openCreateUser} icon={<Plus size={16} />}>Nouvel utilisateur</AdminButton>
          : <AdminButton onClick={openCreateRole} icon={<Plus size={16} />}>Nouveau rôle</AdminButton>
      }
    >
      <div className="space-y-6">
        {/* Tab pills */}
        <div className="flex items-center gap-2">
          <AdminButton
            variant={tab === 'users' ? 'primary' : 'secondary'}
            size="sm"
            icon={<Users size={14} />}
            onClick={() => setTab('users')}
          >
            Utilisateurs
          </AdminButton>
          <AdminButton
            variant={tab === 'roles' ? 'primary' : 'secondary'}
            size="sm"
            icon={<KeyRound size={14} />}
            onClick={() => setTab('roles')}
          >
            Rôles
          </AdminButton>
        </div>

        {/* ────────── USERS TAB ────────── */}
        {tab === 'users' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard label="Utilisateurs" value={adminUsers.length} icon={<Users size={20} />} color="orange" />
              <KPICard label="Rôles" value={adminRoles.length} icon={<ShieldCheck size={20} />} color="cyan" />
              <KPICard label="Super Admins" value={adminUsers.filter(u => { const r = adminRoles.find(role => role.id === u.roleId); return r?.permissions.administration.manage }).length} icon={<Crown size={20} />} color="green" />
            </div>

            <div className="admin-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)]">
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Utilisateur</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Email</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Rôle</th>
                      <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Créé le</th>
                      <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u, i) => (
                      <tr key={u.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.displayName} className="w-8 h-8 rounded-full object-cover border border-[var(--admin-border)]" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--admin-primary)]/20 to-[var(--admin-primary-dark)]/10 border border-[var(--admin-primary)]/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-[var(--admin-primary)]">{getInitials(u.displayName)}</span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-[var(--admin-text-primary)]">{u.displayName}</span>
                            {currentUser?.id === u.id && <AdminBadge variant="info">Vous</AdminBadge>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-[var(--admin-text-secondary)]">{u.email}</span>
                        </td>
                        <td className="px-5 py-4">
                          <AdminBadge variant="orange">{getRoleName(u.roleId)}</AdminBadge>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-[var(--admin-text-muted)]">{formatDate(u.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditUser(u)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier">
                              <Pencil size={15} />
                            </button>
                            {currentUser?.id !== u.id && (
                              <button onClick={() => setConfirmDeleteUser(u.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {adminUsers.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-[var(--admin-text-muted)] text-sm">Aucun utilisateur.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ────────── ROLES TAB ────────── */}
        {tab === 'roles' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KPICard label="Rôles" value={adminRoles.length} icon={<KeyRound size={20} />} color="orange" />
              <KPICard label="Utilisateurs" value={adminUsers.length} icon={<Users size={20} />} color="cyan" />
            </div>

            {adminRoles.length === 0 && (
              <SpotlightCard className="!p-6 text-center">
                <Sparkles size={24} className="mx-auto mb-3 text-[var(--admin-primary)]" />
                <p className="text-sm font-medium text-[var(--admin-text-primary)] mb-1">Aucun rôle configuré</p>
                <p className="text-xs text-[var(--admin-text-muted)] mb-4">Créez les 3 rôles par défaut (Super Admin, Éditeur, Lecteur) pour démarrer.</p>
                <AdminButton onClick={handleSeedRoles} loading={seeding} icon={<Sparkles size={14} />}>Créer rôles par défaut</AdminButton>
              </SpotlightCard>
            )}

            {adminRoles.length > 0 && (
              <div className="admin-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--admin-border)]">
                        <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Nom</th>
                        <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Description</th>
                        <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Permissions</th>
                        <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Utilisateurs</th>
                        <th className="text-right text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminRoles.map((r, i) => (
                        <tr key={r.id} className={`admin-table-row border-b border-[var(--admin-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--admin-surface)]' : ''}`}>
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-[var(--admin-text-primary)]">{r.name}</span>
                          </td>
                          <td className="px-5 py-4 max-w-xs">
                            <span className="text-sm text-[var(--admin-text-secondary)] truncate block">{r.description || '—'}</span>
                          </td>
                          <td className="px-5 py-4">
                            <AdminBadge variant="info">{`${countActivePermissions(r.permissions)} actives`}</AdminBadge>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-[var(--admin-text-secondary)] font-medium">{adminUsers.filter(u => u.roleId === r.id).length}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEditRole(r)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface)] transition-all" title="Modifier">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => setConfirmDeleteRole(r.id)} className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all" title="Supprimer">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ────────── USER DIALOG ────────── */}
        <AdminDialog
          open={userDialogOpen}
          onClose={() => setUserDialogOpen(false)}
          title={editingUserId ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
          description={editingUserId ? "Modifiez les informations de l'utilisateur" : 'Créez un nouveau compte administrateur'}
          size="lg"
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span>
                Compte
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Nom complet"
                    required
                    value={userForm.displayName}
                    onChange={e => setUserForm(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Jean Dupont"
                    error={userErrors.displayName}
                  />
                  <AdminDropdown
                    label="Rôle"
                    required
                    value={userForm.roleId}
                    onChange={val => setUserForm(prev => ({ ...prev, roleId: val }))}
                    options={roleOptions}
                    error={userErrors.roleId}
                  />
                </div>
                {!editingUserId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput
                      label="Email"
                      required
                      type="email"
                      value={userForm.email}
                      onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@lklcloud.fr"
                      error={userErrors.email}
                    />
                    <AdminInput
                      label="Mot de passe"
                      required
                      type="password"
                      value={userForm.password}
                      onChange={e => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Min. 6 caractères"
                      error={userErrors.password}
                    />
                  </div>
                )}
                {editingUserId && (
                  <AdminInput label="Email" value={userForm.email} disabled onChange={() => {}} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span>
                Avatar
              </h3>
              <AvatarUpload
                currentUrl={userForm.avatar || undefined}
                onUpload={handleAvatarUpload}
                onRemove={userForm.avatar ? handleAvatarRemove : undefined}
                size={80}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setUserDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmitUser} loading={creatingUser}>
                {editingUserId ? 'Enregistrer' : 'Créer l\'utilisateur'}
              </AdminButton>
            </div>
          </div>
        </AdminDialog>

        {/* ────────── ROLE DIALOG ────────── */}
        <AdminDialog
          open={roleDialogOpen}
          onClose={() => setRoleDialogOpen(false)}
          title={editingRoleId ? 'Modifier le rôle' : 'Nouveau rôle'}
          description={editingRoleId ? 'Modifiez les permissions du rôle' : 'Créez un nouveau rôle avec ses permissions'}
          size="xl"
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">1</span>
                Informations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="Nom du rôle"
                  required
                  value={roleForm.name}
                  onChange={e => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Super Admin"
                  error={roleErrors.name}
                />
                <AdminInput
                  label="Description"
                  value={roleForm.description}
                  onChange={e => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Accès complet..."
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--admin-primary)] mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] text-xs font-bold flex items-center justify-center">2</span>
                Permissions
                <AdminBadge variant="info">{`${countActivePermissions(roleForm.permissions)} actives`}</AdminBadge>
              </h3>

              <div className="admin-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--admin-border)]">
                        <th className="text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-4 py-2.5">Page</th>
                        <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-2.5">Voir</th>
                        <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-2.5">Créer</th>
                        <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-2.5">Modifier</th>
                        <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-2.5">Supprimer</th>
                        <th className="text-center text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-2.5">Gérer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PERM_SECTIONS.map((section) => {
                        const sectionPerms = roleForm.permissions[section.key] as Record<string, boolean>
                        return (
                          <tr key={section.key} className="border-b border-[var(--admin-border)] last:border-0">
                            <td className="px-4 py-2.5 text-[var(--admin-text-primary)] font-medium">{section.label}</td>
                            {(['view', 'create', 'edit', 'delete', 'manage'] as const).map(action => (
                              <td key={action} className="px-3 py-2.5 text-center">
                                {section.actions.includes(action) ? (
                                  <AdminCheckbox
                                    label=""
                                    checked={sectionPerms[action] ?? false}
                                    onChange={() => togglePerm(section.key, action)}
                                  />
                                ) : (
                                  <span className="text-[var(--admin-text-muted)]">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <AdminButton variant="secondary" onClick={() => setRoleDialogOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSubmitRole}>
                {editingRoleId ? 'Enregistrer' : 'Créer le rôle'}
              </AdminButton>
            </div>
          </div>
        </AdminDialog>

        {/* ────────── CONFIRM DIALOGS ────────── */}
        <ConfirmDialog
          open={confirmDeleteUser !== null}
          onCancel={() => setConfirmDeleteUser(null)}
          onConfirm={() => confirmDeleteUser && handleDeleteUser(confirmDeleteUser)}
          title="Supprimer l'utilisateur ?"
          message="L'utilisateur sera supprimé de l'administration. Son compte Firebase Auth restera actif (supprimez-le manuellement dans la console Firebase si nécessaire)."
        />
        <ConfirmDialog
          open={confirmDeleteRole !== null}
          onCancel={() => setConfirmDeleteRole(null)}
          onConfirm={() => confirmDeleteRole && handleDeleteRole(confirmDeleteRole)}
          title="Supprimer le rôle ?"
          message="Le rôle sera supprimé définitivement. Assurez-vous qu'aucun utilisateur ne l'utilise."
        />
      </div>
    </PageContainer>
  )
}
