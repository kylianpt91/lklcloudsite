import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Headset } from 'lucide-react'
import HeaderBubble from './HeaderBubble'
import Footer from './Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import BackToTop from '@/components/ui/BackToTop'
import QuickActions from '@/components/ui/QuickActions'
import CookieConsent from '@/components/ui/CookieConsent'
import { NotificationContainer } from '@/contexts/NotificationContext'
import { PrintStyles } from '@/components/ui/PrintStyles'
import { useBridgeMaintenance } from '@/hooks/useBridge'

export default function Layout() {
  const { pathname } = useLocation()
  const maintenance = useBridgeMaintenance()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (maintenance.enabled) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-screen flex flex-col overflow-hidden bg-canvas"
      >
        <div aria-hidden="true" className="bubble-field radial-fade pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="warm-glow pointer-events-none absolute -top-24 right-[-15%] h-[40rem] w-[40rem] rounded-full"
        />
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

        <div className="relative z-10 flex-1 flex items-center">
          <div className="mx-auto max-w-6xl w-full px-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow inline-flex items-center gap-2 text-text-faint mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Maintenance
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display text-[clamp(2.6rem,6vw,4.5rem)] text-text max-w-3xl"
            >
              Maintenance{' '}
              <span className="font-accent font-normal text-primary">en cours</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 max-w-lg text-lg text-text-dim leading-relaxed"
            >
              {maintenance.message || "Nous travaillons sur le site pour vous offrir une meilleure expérience. Merci de votre patience."}
            </motion.p>

            {maintenance.estimatedReturn && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm text-text-dim"
              >
                <Clock className="w-3.5 h-3.5 text-primary" />
                Retour prévu : {new Date(maintenance.estimatedReturn).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="https://discord.gg/lklcloud"
                className="btn-primary"
              >
                <Headset className="w-4 h-4" />
                Nous contacter
              </a>
              <a
                href="https://clients.lklcloud.fr"
                className="btn-ghost"
              >
                Espace Client
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <HeaderBubble />
      <main className="flex-1">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />

      {/* Global overlays & floating elements */}
      <BackToTop />
      <QuickActions />
      <NotificationContainer />
      <PrintStyles />
      <CookieConsent />
    </div>
  )
}
