import { useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LogoLoop from '@/components/ui/LogoLoop'
import DeployModal from '@/components/ui/DeployModal'
import { useBridgeHero } from '@/hooks/useBridge'

const techLogos: { name: string; logo: string; height: string }[] = [
  { name: 'Proxmox', logo: '/images/logos/proxmox.svg', height: 'h-10' },
  { name: 'Intel', logo: '/images/logos/intel.svg', height: 'h-12' },
  { name: 'Cloudflare', logo: '/images/logos/cloudflare.svg', height: 'h-12' },
  { name: 'Plesk', logo: '/images/logos/plesk.svg', height: 'h-12' },
  { name: 'Debian', logo: '/images/logos/debian.svg', height: 'h-10' },
  { name: 'Ubuntu', logo: '/images/logos/ubuntu.svg', height: 'h-10' },
  { name: 'Windows Server', logo: '/images/logos/windows.svg', height: 'h-10' },
  { name: 'Wisp', logo: '/images/logos/wisp.png', height: 'h-6' },
]

const techLogoItems = techLogos.map(({ name, logo, height }) => ({
  name,
  icon: <img src={logo} alt={name} className={`${height} w-auto opacity-45 brightness-0 invert`} />,
}))

const stats: { value: string; label: string }[] = [
  { value: '99,9%', label: 'Disponibilité garantie' },
  { value: '~25 min', label: 'Réponse du support' },
  { value: '10 Gbps', label: 'Réseau anti-DDoS' },
  { value: '100%', label: 'Hébergé en France' },
]

function MascotShowcase() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center py-8"
    >
      {/* Glow behind the mascot */}
      <div
        aria-hidden="true"
        className="warm-glow pointer-events-none absolute h-[34rem] w-[34rem] rounded-full"
      />
      <motion.img
        src="/images/logos/mascot.png"
        alt="Mascotte LKLCloud"
        className="relative w-full max-w-lg drop-shadow-[0_30px_60px_rgba(255,106,48,0.25)]"
        animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
        transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])
  const hero = useBridgeHero()
  const accent = hero.typedWords?.[0] || hero.titleLine2

  return (
    <section className="relative w-full overflow-hidden bg-canvas -mt-28 pt-36 pb-16 md:pt-40 md:pb-24">
      {/* Technical grid backdrop, faded at the edges */}
      <div aria-hidden="true" className="bubble-field radial-fade pointer-events-none absolute inset-0" />
      {/* Contained warm light — top-right, deliberate shape */}
      <div
        aria-hidden="true"
        className="warm-glow pointer-events-none absolute -top-40 right-[-18%] h-[46rem] w-[46rem] rounded-full"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* ── Left: headline ─────────────────────────────────────── */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display text-[clamp(2.6rem,6.2vw,4.7rem)] text-text"
            >
              {hero.titleLine1}
              <span className="mt-1 block font-accent text-[1.06em] font-normal leading-[1.05] text-primary">
                {accent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-text-dim"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary group">
                {hero.ctaPrimaryText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a href="#solutions" className="btn-ghost">
                {hero.ctaSecondaryText}
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 border-t border-hairline pt-7 sm:grid-cols-4"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="sm:border-l sm:border-hairline sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-2xl font-bold tracking-tight text-text tabular-nums">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-tight text-text-faint">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* ── Right: mascot (lg+) ─────────────────────────────────── */}
          <div className="hidden lg:block">
            <MascotShowcase />
          </div>
        </div>

        {/* ── Tech logos ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 md:mt-20"
        >
          <p className="eyebrow mb-6 text-text-faint">Technologies exploitées</p>
          <LogoLoop items={techLogoItems} speed={40} maskColor="transparent" logoOnly />
        </motion.div>
      </div>

      <DeployModal open={modalOpen} onClose={closeModal} />
    </section>
  )
}
