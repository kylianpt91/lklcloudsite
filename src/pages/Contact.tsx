import { motion } from 'framer-motion'
import { Ticket, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import SEOHead from '@/components/SEOHead'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Card from '@/components/ui/Card'

const channels = [
  {
    icon: Ticket,
    title: 'Ouvrir un ticket',
    description:
      'Le plus rapide pour un problème sur un service en cours. Réponse en moyenne en 25 minutes, 7j/7.',
    cta: 'Accéder à l’espace client',
    href: 'https://clients.lklcloud.fr',
  },
  {
    icon: Mail,
    title: 'Par e-mail',
    description: 'Pour toute question avant ou après votre commande.',
    cta: 'support@lklcloud.fr',
    href: 'mailto:support@lklcloud.fr',
  },
  {
    icon: MessageCircle,
    title: 'Sur Discord',
    description: 'Échangez avec l’équipe et la communauté LKLCloud en direct.',
    cta: 'Rejoindre le Discord',
    href: 'https://discord.gg/lklcloud',
  },
]

export default function Contact() {
  useDocumentTitle('Contact')

  return (
    <>
      <SEOHead
        pageSlug="contact"
        fallbackTitle="Contact — LKLCloud"
        fallbackDescription="Contactez l'équipe LKLCloud par ticket, e-mail ou Discord. Support réactif 7j/7."
      />

      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Contact' }]} />
          <div className="mt-6 sm:mt-8">
            <h1 className="display text-3xl sm:text-4xl lg:text-[3.5rem] text-neutral-dark">
              Contactez-nous
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-neutral-medium max-w-2xl">
              Une question, un problème, un projet ? Notre équipe vous répond en moyenne en
              25 minutes, 7j/7.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {channels.map((channel, i) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
              >
                <Card variant="default" hoverable className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-neutral-dark/[0.04] text-neutral-dark">
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-neutral-dark">{channel.title}</h2>
                  <p className="mt-2 text-sm text-neutral-medium flex-1">{channel.description}</p>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    {channel.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-sm text-neutral-medium text-center">
            Clients Business et Enterprise : un support téléphonique dédié est aussi disponible
            depuis votre espace client.
          </p>
        </div>
      </section>
    </>
  )
}
