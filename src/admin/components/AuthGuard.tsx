import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthChange, type User } from '@/admin/lib/auth'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined) // undefined = loading

  useEffect(() => {
    return onAuthChange(u => setUser(u))
  }, [])

  if (user === undefined) {
    // Loading state — centered spinner
    return (
      <div className="admin-root min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF6A30]/20 border-t-[#FF6A30] rounded-full animate-spin" />
          <p className="text-sm text-white/40">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/apps/management/auth" replace />
  }

  return <>{children}</>
}
