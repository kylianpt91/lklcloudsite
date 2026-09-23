import { useEffect, useRef } from 'react'
import { useAdmin } from '../lib/context'

/**
 * Polls every 60s to automatically activate/deactivate gammes and offres
 * based on their `scheduleConfig.publishAt` and `scheduleConfig.unpublishAt`.
 *
 * Only runs client-side when the admin panel is open.
 */
export function useSchedulePoller() {
  const { gammes, offres, updateGamme, updateOffre, addToast } = useAdmin()
  const processingRef = useRef(false)

  useEffect(() => {
    const check = async () => {
      if (processingRef.current) return
      processingRef.current = true

      const now = new Date()

      try {
        // Check gammes
        for (const g of gammes) {
          if (!g.scheduleConfig) continue

          // Auto-publish
          if (g.scheduleConfig.publishAt && !g.actif && new Date(g.scheduleConfig.publishAt) <= now) {
            await updateGamme(g.id, {
              actif: true,
              scheduleConfig: { ...g.scheduleConfig, publishAt: undefined },
            })
            addToast('info', `Gamme "${g.nom}" activée automatiquement (planification)`)
          }

          // Auto-unpublish
          if (g.scheduleConfig.unpublishAt && g.actif && new Date(g.scheduleConfig.unpublishAt) <= now) {
            await updateGamme(g.id, {
              actif: false,
              scheduleConfig: { ...g.scheduleConfig, unpublishAt: undefined },
            })
            addToast('info', `Gamme "${g.nom}" désactivée automatiquement (planification)`)
          }
        }

        // Check offres
        for (const o of offres) {
          if (!o.scheduleConfig) continue

          // Auto-publish
          if (o.scheduleConfig.publishAt && o.statut !== 'actif' && new Date(o.scheduleConfig.publishAt) <= now) {
            await updateOffre(o.id, {
              statut: 'actif',
              scheduleConfig: { ...o.scheduleConfig, publishAt: undefined },
            })
            addToast('info', `Offre "${o.nom}" activée automatiquement (planification)`)
          }

          // Auto-unpublish
          if (o.scheduleConfig.unpublishAt && o.statut === 'actif' && new Date(o.scheduleConfig.unpublishAt) <= now) {
            await updateOffre(o.id, {
              statut: 'archive',
              scheduleConfig: { ...o.scheduleConfig, unpublishAt: undefined },
            })
            addToast('info', `Offre "${o.nom}" archivée automatiquement (planification)`)
          }
        }
      } catch {
        // Silently fail — will retry next poll
      } finally {
        processingRef.current = false
      }
    }

    // Initial check
    check()

    // Poll every 60 seconds
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [gammes, offres, updateGamme, updateOffre, addToast])
}
