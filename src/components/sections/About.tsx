import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import DeployModal from '@/components/ui/DeployModal'

const steps = [
  { title: 'Choisissez votre offre', description: 'Parcourez nos solutions adaptées à chaque besoin.' },
  { title: 'Commandez en quelques clics', description: 'Finalisez votre commande depuis l’espace client.' },
  { title: 'Déployé en quelques minutes', description: 'Activation quasi-instantanée de votre service.' },
  { title: 'Profitez du support 24/7', description: 'Notre équipe vous accompagne en temps réel.' },
]

export default function About() {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <section className="border-t border-hairline bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Left — story */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-5">
              <span className="font-mono text-primary">03</span>
              <span className="h-px w-6 bg-hairline-strong" />
              L&apos;équipe
            </span>
            <h2 className="display text-3xl sm:text-4xl lg:text-[3rem] text-text">
              Un fondateur,{' '}
              <span className="font-accent font-normal text-primary">une ambition</span>
            </h2>
            <div className="mt-6 space-y-4 text-text-dim leading-relaxed">
              <p>
                Passionné par le numérique, j&apos;ai lancé LKLCloud pour offrir un
                hébergement français haut de gamme, accessible à tous : startups,
                freelances, particuliers. L&apos;idée est simple — donner à chacun
                l&apos;infrastructure qui transforme une idée en projet solide,
                sans barrière ni compromis.
              </p>
              <p>
                Chaque innovation, chaque client conquis me rapproche d&apos;un
                digital plus accessible et plus performant.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
                Découvrir nos offres
              </button>
              <a
                href="https://linkedin.com/company/lklcloud"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Suivre notre aventure
              </a>
            </div>
          </motion.div>

          {/* Right — process */}
          <motion.ol
            className="relative border-l border-hairline"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps.map((step, i) => (
              <li key={step.title} className="relative pl-8 pb-9 last:pb-0">
                <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-lg bg-primary font-mono text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold tracking-tight text-text">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-dim">
                  {step.description}
                </p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>

      <DeployModal open={modalOpen} onClose={closeModal} />
    </section>
  )
}
