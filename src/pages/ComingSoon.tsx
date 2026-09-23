import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bell, ArrowRight } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function ComingSoon() {
  useDocumentTitle('Prochainement')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[calc(100dvh-7rem)] flex flex-col overflow-hidden -mt-28 pt-28 bg-paper"
    >
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
            className="eyebrow inline-flex items-center gap-2 text-neutral-dark/45 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Prochainement
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="display text-[clamp(2.6rem,6vw,4.5rem)] text-neutral-dark max-w-3xl"
          >
            On vous prépare{' '}
            <span className="font-accent font-normal text-primary">quelque chose de grand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-lg text-lg text-neutral-dark/60 leading-relaxed"
          >
            Cette gamme est en cours de préparation. Nous y travaillons pour vous
            proposer le meilleur — restez informé.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="https://discord.gg/lklcloud"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-neutral-dark px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary"
            >
              <Bell className="h-4 w-4" />
              Me notifier au lancement
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-dark/15 px-6 py-3.5 text-sm font-semibold text-neutral-dark transition-colors duration-300 hover:border-neutral-dark/40"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Link
              to="/produits/plesk"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-dark/40 hover:text-primary transition-colors"
            >
              Découvrir nos offres déjà disponibles
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
