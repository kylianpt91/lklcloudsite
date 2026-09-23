import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap, Headset, BadgeEuro, MapPin, ArrowRight } from 'lucide-react'
import DeployModal from '@/components/ui/DeployModal'

const commitments = [
  {
    icon: Zap,
    title: 'Disponibilité 99,9 %',
    description:
      'Un taux de disponibilité garanti par contrat. En cas de manquement, vous êtes indemnisé sur demande (voir conditions).',
  },
  {
    icon: Headset,
    title: 'Support 24/7',
    description:
      'Une équipe française qui répond à vos tickets en environ 25 minutes, 7 jours sur 7.',
  },
  {
    icon: BadgeEuro,
    title: 'Aucun frais caché',
    description:
      'Le prix affiché est le prix payé. Pas de surcoût à l’activation, pas de mauvaise surprise.',
  },
  {
    icon: MapPin,
    title: 'Hébergé en France',
    description:
      'Vos données restent dans un datacenter parisien, en conformité avec le RGPD.',
  },
]

export default function Benefits() {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <section id="benefits" className="border-t border-hairline bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-5">
            <span className="font-mono text-primary">02</span>
            <span className="h-px w-6 bg-hairline-strong" />
            Nos engagements
          </span>
          <h2 className="display text-3xl sm:text-4xl lg:text-[3.25rem] text-text">
            Des promesses{' '}
            <span className="font-accent font-normal text-primary">qui engagent</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-dim">
            Nous ne vous demandons pas de nous faire confiance aveuglément. Chaque
            engagement est contractuel, mesurable et vérifiable.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {commitments.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="surface-card group p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-tint-2)] text-text transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-dim">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="max-w-md text-sm text-text-faint">
            Tous nos engagements sont détaillés dans nos conditions générales de
            vente. Pas de petites lignes.
          </p>
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary group shrink-0">
            Déployer mon projet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>

      <DeployModal open={modalOpen} onClose={closeModal} />
    </section>
  )
}
