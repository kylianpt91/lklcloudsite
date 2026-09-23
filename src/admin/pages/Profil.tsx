import { useState } from 'react'
import { supabase, createEphemeralClient } from '@/lib/supabase'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminInput } from '../components/FormFields'
import { AdminButton } from '../components/AdminButton'
import { AdminBadge } from '../components/AdminBadge'
import { AvatarUpload } from '../components/AvatarUpload'
import { SpotlightCard } from '../components/reactbits'
import { uploadAvatar, deleteAvatar } from '../lib/storage'
import { User, ShieldCheck, Lock } from 'lucide-react'
import type { AdminPermissions } from '../lib/types'

// ── Helpers ──────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  view: 'Voir',
  create: 'Créer',
  edit: 'Modifier',
  delete: 'Supprimer',
  manage: 'Gérer',
}

function getReadablePermissions(permissions: AdminPermissions): string[] {
  const result: string[] = []
  for (const [section, perms] of Object.entries(permissions)) {
    const active = Object.entries(perms as Record<string, boolean>)
      .filter(([, v]) => v)
      .map(([k]) => ACTION_LABELS[k] ?? k)
    if (active.length > 0) {
      result.push(`${section}: ${active.join(', ')}`)
    }
  }
  return result
}

// ── Component ────────────────────────────────────────────────────────

export default function Profil() {
  const { currentUser, adminRoles, updateAdminUser, addToast } = useAdmin()

  // Profile form
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '')
  const [saving, setSaving] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [changingPassword, setChangingPassword] = useState(false)

  const role = adminRoles.find(r => r.id === currentUser?.roleId)
  const readablePerms = role ? getReadablePermissions(role.permissions) : []

  const handleSaveProfile = async () => {
    if (!currentUser) return
    if (!displayName.trim()) {
      addToast('warning', 'Le nom ne peut pas être vide')
      return
    }
    setSaving(true)
    try {
      await updateAdminUser(currentUser.id, { displayName: displayName.trim() })
    } catch { /* context toast */ }
    finally { setSaving(false) }
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error('Non connecté')
    const url = await uploadAvatar(file, currentUser.id)
    await updateAdminUser(currentUser.id, { avatar: url })
    return url
  }

  const handleAvatarRemove = async () => {
    if (!currentUser?.avatar) return
    await deleteAvatar(currentUser.avatar)
    await updateAdminUser(currentUser.id, { avatar: undefined })
  }

  const handleChangePassword = async () => {
    const errs: Record<string, string> = {}
    if (!currentPassword) errs.currentPassword = 'Requis'
    if (!newPassword || newPassword.length < 6) errs.newPassword = 'Min. 6 caractères'
    setPasswordErrors(errs)
    if (Object.keys(errs).length > 0) return

    setChangingPassword(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('Non connecté')

      // Verify the current password on a throwaway client so the active
      // admin session is never disturbed.
      const verifier = createEphemeralClient('lkl-pwd-verify')
      if (verifier) {
        const { error: verifyErr } = await verifier.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        })
        await verifier.auth.signOut()
        if (verifyErr) {
          setPasswordErrors({ currentPassword: 'Mot de passe incorrect' })
          return
        }
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      setCurrentPassword('')
      setNewPassword('')
      addToast('success', 'Mot de passe modifié avec succès')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setChangingPassword(false)
    }
  }

  if (!currentUser) {
    return (
      <PageContainer title="Profil" description="Votre profil administrateur">
        <SpotlightCard className="!p-8 text-center">
          <User size={32} className="mx-auto mb-3 text-[var(--admin-text-muted)]" />
          <p className="text-sm text-[var(--admin-text-muted)]">
            Aucun profil trouvé. Demandez à un administrateur de vous créer un compte dans la page Administration.
          </p>
        </SpotlightCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Profil" description="Gérez votre profil et votre mot de passe">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Section 1: Informations */}
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary)]/10 flex items-center justify-center">
                <User size={14} className="text-[var(--admin-primary)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Informations</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <AvatarUpload
                currentUrl={currentUser.avatar}
                onUpload={handleAvatarUpload}
                onRemove={currentUser.avatar ? handleAvatarRemove : undefined}
                size={80}
              />
              <div className="flex-1 space-y-4">
                <AdminInput
                  label="Email"
                  value={currentUser.email}
                  disabled
                  onChange={() => {}}
                />
                <AdminInput
                  label="Nom complet"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Votre nom"
                />
                <div className="flex justify-end">
                  <AdminButton onClick={handleSaveProfile} loading={saving}>Enregistrer</AdminButton>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Section 3: Sécurité */}
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary)]/10 flex items-center justify-center">
                <Lock size={14} className="text-[var(--admin-primary)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Sécurité</h3>
            </div>

            <div className="space-y-4">
              <AdminInput
                label="Mot de passe actuel"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Votre mot de passe actuel"
                error={passwordErrors.currentPassword}
              />
              <AdminInput
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 caractères"
                error={passwordErrors.newPassword}
              />
              <div className="flex justify-end">
                <AdminButton onClick={handleChangePassword} loading={changingPassword} variant="secondary">
                  Changer le mot de passe
                </AdminButton>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Section 2: Rôle & Permissions */}
          <SpotlightCard className="!p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[var(--admin-primary)]/10 flex items-center justify-center">
                <ShieldCheck size={14} className="text-[var(--admin-primary)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Rôle & Permissions</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--admin-text-secondary)]">Rôle :</span>
                <AdminBadge variant="orange">{role?.name ?? 'Non assigné'}</AdminBadge>
              </div>
              {role?.description && (
                <p className="text-sm text-[var(--admin-text-muted)]">{role.description}</p>
              )}
              {readablePerms.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Permissions actives</p>
                  <div className="flex flex-wrap gap-1.5">
                    {readablePerms.map(p => (
                      <span key={p} className="text-[10px] px-2 py-1 rounded-md bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </PageContainer>
  )
}
