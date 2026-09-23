import { motion } from 'framer-motion'
import Accordion from '@/components/ui/Accordion'
import { useBridgeFaqs } from '@/hooks/useBridge'

export default function HomeFAQ() {
  const faqs = useBridgeFaqs()

  return (
    <section className="border-t border-hairline bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-16">
          <motion.div
            className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-5">
              <span className="font-mono text-primary">05</span>
              <span className="h-px w-6 bg-hairline-strong" />
              FAQ
            </span>
            <h2 className="display text-3xl sm:text-4xl lg:text-[3rem] text-text">
              Questions{' '}
              <span className="font-accent font-normal text-primary">fréquentes</span>
            </h2>
            <p className="mt-4 text-text-dim">
              Tout ce que vous devez savoir avant de commencer.
            </p>
            <a
              href="mailto:support@lklcloud.fr"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-text transition-colors hover:text-primary"
            >
              Une autre question ? Écrivez-nous →
            </a>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Accordion items={faqs} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
