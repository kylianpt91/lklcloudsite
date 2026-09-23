import { motion } from 'framer-motion'
import LogoLoop from '@/components/ui/LogoLoop'

const partners = [
  'WordPress',
  'React',
  'Node.js',
  'Python',
  'Docker',
  'PHP',
  'Laravel',
  'Next.js',
  'Vue.js',
  'Angular',
].map((name) => ({
  name,
  icon: (
    <span className="text-base font-semibold text-neutral-dark/60">
      {name}
    </span>
  ),
}))

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function Partners() {
  return (
    <section className="py-20 relative">
      {/* Animated gradient line */}
      <motion.div
        className="h-px max-w-4xl mx-auto mb-12"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(248,129,79,0.2), transparent)',
          transformOrigin: 'center',
        }}
        variants={lineVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        aria-hidden="true"
      />

      <p className="text-center text-xs font-medium text-neutral-medium uppercase tracking-[0.25em] mb-8">
        Technologies support&eacute;es
      </p>

      <LogoLoop items={partners} speed={40} />
    </section>
  )
}
