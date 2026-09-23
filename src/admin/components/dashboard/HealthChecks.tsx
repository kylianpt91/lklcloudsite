import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, ExternalLink, ChevronDown } from 'lucide-react'
import { useAdmin } from '../../lib/context'
import { SpotlightCard } from '../reactbits'

interface HealthCheck {
  type: 'warning' | 'info'
  message: string
  href?: string
}

export function HealthChecks() {
  const { gammes, offres, annonces, maintenanceMode } = useAdmin()
  const navigate = useNavigate()

  const checks = useMemo(() => {
    const results: HealthCheck[] = []

    // Offres actives sans orderUrl
    for (const o of offres.filter(o => o.statut === 'actif' && !o.orderUrl)) {
      results.push({ type: 'warning', message: `"${o.nom}" active sans URL de commande`, href: '/apps/management/offres' })
    }

    // Offres actives avec features vides
    for (const o of offres.filter(o => o.statut === 'actif' && o.features.length === 0)) {
      results.push({ type: 'warning', message: `"${o.nom}" active sans caractéristiques`, href: '/apps/management/offres' })
    }

    // Gammes actives sans offres actives
    for (const g of gammes.filter(g => g.actif && !g.comingSoon)) {
      const hasActive = offres.some(o => o.gammeId === g.id && o.statut === 'actif')
      if (!hasActive) {
        results.push({ type: 'warning', message: `Gamme "${g.nom}" active sans offres`, href: '/apps/management/gammes' })
      }
    }

    // Offres avec prix mensuel = 0
    for (const o of offres.filter(o => o.statut === 'actif' && !o.prix.mensuel)) {
      results.push({ type: 'warning', message: `"${o.nom}" active avec prix à 0€`, href: '/apps/management/offres' })
    }

    // Maintenance mode actif
    if (maintenanceMode?.enabled) {
      results.push({ type: 'info', message: 'Mode maintenance activé', href: '/apps/management/maintenance' })
    }

    // Aucune annonce active
    if (annonces.length > 0 && !annonces.some(a => a.actif)) {
      results.push({ type: 'info', message: 'Aucune annonce active', href: '/apps/management/annonces' })
    }

    // Contenu non mis à jour depuis > 30 jours
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const staleCount = [...gammes, ...offres].filter(e => new Date(e.updatedAt) < thirtyDaysAgo).length
    if (staleCount > 0) {
      results.push({ type: 'warning', message: `${staleCount} élément${staleCount > 1 ? 's' : ''} non mis à jour depuis +30 jours` })
    }

    return results
  }, [gammes, offres, annonces, maintenanceMode])

  const [collapsed, setCollapsed] = useState(true)

  if (checks.length === 0) return null

  return (
    <SpotlightCard className="!p-5">
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h3 className="text-sm font-bold text-[var(--admin-text-primary)]">Health Checks</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--admin-warning)] bg-[var(--admin-warning)]/10 px-2 py-0.5 rounded-md">
            {checks.length} alerte{checks.length > 1 ? 's' : ''}
          </span>
          <ChevronDown
            size={14}
            className={`text-[var(--admin-text-muted)] transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          />
        </div>
      </button>
      {!collapsed && (
        <div className="space-y-2 mt-4">
          {checks.map((check, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                check.type === 'warning' ? 'bg-[var(--admin-warning)]/10' : 'bg-[var(--admin-info)]/10'
              } ${check.href ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={check.href ? () => navigate(check.href!) : undefined}
            >
              <div className="mt-0.5">
                {check.type === 'warning'
                  ? <AlertTriangle size={14} className="text-[var(--admin-warning)]" />
                  : <Info size={14} className="text-[var(--admin-info)]" />
                }
              </div>
              <p className="text-xs text-[var(--admin-text-secondary)] flex-1">{check.message}</p>
              {check.href && <ExternalLink size={12} className="text-[var(--admin-text-muted)] mt-0.5 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </SpotlightCard>
  )
}
