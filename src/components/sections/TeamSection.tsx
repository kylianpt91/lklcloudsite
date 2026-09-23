import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, HeartHandshake } from 'lucide-react'
import { useBridgeTeam } from '@/hooks/useBridge'

function MemberAvatar({ avatar, name }: { avatar: string; name: string }) {
  const [failed, setFailed] = useState(false)

  if (!avatar || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-tint-2)] text-2xl font-bold text-text-faint">
        {name.split(' ').map((n) => n[0]).join('')}
      </div>
    )
  }

  return (
    <img
      src={avatar}
      alt={name}
      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const values = [
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Un engagement quotidien envers la stabilité et la sécurité de vos services.',
  },
  {
    icon: HeartHandshake,
    title: 'Proximité',
    description: 'Un interlocuteur unique, accessible et à votre écoute.',
  },
  {
    icon: Users,
    title: 'Expertise',
    description: 'Un profil polyvalent pour couvrir tous vos besoins techniques.',
  },
]

export default function TeamSection() {
  const team = useBridgeTeam()

  return (
    <section className="relative overflow-hidden border-t border-hairline bg-canvas py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          {/* Left — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-5">
              <span className="font-mono text-primary">04</span>
              <span className="h-px w-6 bg-hairline-strong" />
              Le fondateur
            </span>

            <h2 className="display text-3xl sm:text-4xl lg:text-[3.25rem] text-text">
              La personne derrière{' '}
              <span className="font-accent font-normal text-primary">le projet</span>
            </h2>

            <p className="mt-5 text-lg text-text-dim leading-relaxed max-w-lg">
              Passionné et impliqué à 100 %, avec la volonté d&apos;offrir le
              meilleur hébergement cloud français. Je m&apos;occupe
              personnellement de chaque aspect pour garantir la qualité de mes
              services.
            </p>

            {/* Values */}
            <div className="mt-10 space-y-5">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-2)] text-text flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{value.title}</h4>
                      <p className="text-sm text-text-dim mt-0.5 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right — Member card */}
          <motion.div
            className="max-w-sm"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                className="surface-card group overflow-hidden"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-tint-1)]">
                  <MemberAvatar avatar={member.avatar} name={member.name} />
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold tracking-tight text-text">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-primary">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-dim">
                    {member.bio}
                  </p>
                  {member.socials?.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-semibold text-text-faint transition-colors hover:text-primary"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
