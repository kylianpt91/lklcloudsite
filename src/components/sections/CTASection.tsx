import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import DeployModal from '@/components/ui/DeployModal'

export default function CTASection() {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface text-text">
      <div aria-hidden="true" className="bubble-field radial-fade pointer-events-none absolute inset-0 opacity-60" />
      {/* one contained warm glow */}
      <div
        aria-hidden="true"
        className="warm-glow pointer-events-none absolute -bottom-48 -right-24 h-[40rem] w-[40rem] rounded-full"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-6">
          <span className="font-mono text-primary">06</span>
          <span className="h-px w-6 bg-hairline-strong" />
          Lancez-vous dès maintenant
        </span>

        <h2 className="display max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)] text-text">
          Prêt à propulser{' '}
          <span className="font-accent font-normal text-primary">votre projet&nbsp;?</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-dim">
          Un hébergement français d&apos;exception, une connexion ultra-rapide et un
          support humain réactif, 24/7.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-light"
          >
            Commencer maintenant
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="https://discord.gg/lklcloud"
            className="inline-flex items-center gap-2.5 rounded-xl border border-hairline px-7 py-3.5 text-sm font-semibold text-text transition-colors duration-300 hover:border-hairline-strong"
          >
            <MessageCircle className="h-4 w-4" />
            Parler à un expert
          </a>
        </div>
      </motion.div>

      <DeployModal open={modalOpen} onClose={closeModal} />
    </section>
  )
}
