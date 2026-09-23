import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Heart, Eye, Shield } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { useBridgeTeam } from '@/hooks/useBridge'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Heart,
  Eye,
  Shield,
}

const companyValues = [
  {
    title: 'Performance',
    description:
      "Infrastructure de dernière génération avec SSD et processeurs haute fréquence pour des temps de réponse minimaux.",
    icon: 'Zap',
  },
  {
    title: 'Proximit\u00e9',
    description:
      "Un support humain, r\u00e9actif et francophone. Nous connaissons chacun de nos clients et leurs besoins.",
    icon: 'Heart',
  },
  {
    title: 'Transparence',
    description:
      "Pas de frais cach\u00e9s, pas d'engagement. Des tarifs clairs et des conditions g\u00e9n\u00e9rales compr\u00e9hensibles.",
    icon: 'Eye',
  },
  {
    title: 'S\u00e9curit\u00e9',
    description:
      "Donn\u00e9es h\u00e9berg\u00e9es en France, sauvegardes automatiques, protection anti-DDoS et conformit\u00e9 RGPD.",
    icon: 'Shield',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export default function TeamPage() {
  useDocumentTitle('Notre Équipe')
  const team = useBridgeTeam()

  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Notre <span className="text-gradient">\u00e9quipe</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl text-neutral-medium max-w-2xl mx-auto leading-relaxed"
          >
            Des experts passionn\u00e9s qui construisent et maintiennent une
            infrastructure cloud d'excellence, au service de vos projets.
          </motion.p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                className="glass rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-300"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                  {member.avatar}
                </div>

                <h3 className="mt-5 text-lg font-bold text-neutral-dark">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {member.role}
                </p>
                <p className="mt-3 text-sm text-neutral-medium leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 sm:py-24 bg-neutral-light/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-dark">
              Nos valeurs
            </h2>
            <p className="mt-4 text-lg text-neutral-medium max-w-xl mx-auto">
              Les principes qui guident chacune de nos d\u00e9cisions et fa\u00e7onnent
              notre culture d'entreprise.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {companyValues.map((value) => {
              const Icon = iconMap[value.icon] ?? Zap
              return (
                <motion.div
                  key={value.title}
                  variants={cardVariants}
                  className="glass rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-dark">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-medium leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Rejoignez-nous CTA */}
      <section className="py-12 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-dark">
              Rejoignez-nous
            </h2>
            <p className="mt-4 text-neutral-medium max-w-lg mx-auto leading-relaxed">
              Vous \u00eates passionn\u00e9 par le cloud, l'infrastructure ou le
              d\u00e9veloppement ? Nous sommes toujours \u00e0 la recherche de talents
              pour renforcer notre \u00e9quipe.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <a
                href="mailto:recrutement@lklcloud.fr"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-7 py-3 text-sm rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
              >
                Envoyer ma candidature
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 glass px-7 py-3 text-sm rounded-full font-semibold hover:bg-white/60 transition-all duration-300 backdrop-blur-xl"
              >
                Retour \u00e0 l'accueil
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
