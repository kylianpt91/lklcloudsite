import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Accordion from '@/components/ui/Accordion'
import SectionTitle from '@/components/ui/SectionTitle'
import { useBridgeFaqs } from '@/hooks/useBridge'

type FAQContext = 'home' | 'product' | 'pricing' | 'support'

interface ContextualFAQProps {
  context: FAQContext
}

const productFaqs = [
  {
    question: 'Quelle est la différence entre un VPS et un hébergement mutualisé ?',
    answer:
      'Un VPS (Virtual Private Server) vous offre des ressources dédiées (CPU, RAM, stockage) avec un accès root complet et une isolation totale. L\'hébergement mutualisé partage les ressources entre plusieurs utilisateurs, ce qui est plus abordable mais offre moins de contrôle et de performances.',
  },
  {
    question: 'Puis-je upgrader mon serveur sans interruption ?',
    answer:
      'Oui, la plupart de nos upgrades (RAM, stockage, bande passante) sont effectuées à chaud, sans redémarrage ni interruption de service. Pour les changements de CPU, un bref redémarrage de quelques secondes peut être nécessaire.',
  },
  {
    question: 'Quels systèmes d\'exploitation sont disponibles ?',
    answer:
      'Nous proposons une large gamme de distributions Linux (Ubuntu, Debian, CentOS, AlmaLinux, Rocky Linux) et Windows Server (2019, 2022). Vous pouvez également importer votre propre ISO.',
  },
]

const pricingFaqs = [
  {
    question: 'Les prix affichés sont-ils TTC ?',
    answer:
      'Oui, tous nos prix sont affichés TTC (Toutes Taxes Comprises) pour les particuliers. Pour les professionnels, nous proposons des factures avec TVA détaillée.',
  },
  {
    question: 'Y a-t-il des frais d\'installation ?',
    answer:
      'Non, il n\'y a aucun frais d\'installation sur l\'ensemble de nos services. Votre service est provisionné automatiquement dans les minutes suivant votre paiement.',
  },
  {
    question: 'Proposez-vous des réductions pour un engagement annuel ?',
    answer:
      'Oui, un engagement annuel vous permet d\'économiser jusqu\'à 20% par rapport à la facturation mensuelle. Le montant exact de la réduction varie selon le service choisi.',
  },
  {
    question: 'Comment fonctionne la garantie satisfait ou remboursé ?',
    answer:
      'Vous disposez de 14 jours pour tester nos services. Si vous n\'êtes pas satisfait, contactez notre support pour obtenir un remboursement intégral, sans aucune condition ni justification requise.',
  },
]

const supportFaqs = [
  {
    question: 'Quels sont les horaires du support technique ?',
    answer:
      'Notre support est disponible 7j/7. Les plans Starter bénéficient d\'un support en heures ouvrées (9h-18h). Les plans Pro ont un support étendu (8h-22h). Les plans Business et Enterprise profitent d\'un support 24/7 avec temps de réponse garanti.',
  },
  {
    question: 'Par quels canaux puis-je contacter le support ?',
    answer:
      'Vous pouvez nous contacter par ticket (depuis votre espace client), par e-mail à support@lklcloud.fr, ou par chat en direct sur notre site. Les clients Business et Enterprise ont également accès à un support téléphonique dédié.',
  },
  {
    question: 'Quel est le temps de réponse moyen ?',
    answer:
      'Notre temps de réponse moyen est de 15 minutes pour les urgences et de 2 heures pour les demandes standards. Les clients avec un plan prioritaire bénéficient d\'un SLA avec temps de réponse garanti de 30 minutes maximum.',
  },
  {
    question: 'Proposez-vous un service d\'infogérance ?',
    answer:
      'Oui, nous proposons un service d\'infogérance complet incluant la surveillance 24/7, les mises à jour de sécurité, l\'optimisation des performances et la gestion des sauvegardes. Contactez notre équipe commerciale pour un devis personnalisé.',
  },
]

const staticContextConfig: Partial<Record<
  FAQContext,
  { title: string; subtitle: string; faqs: { question: string; answer: string }[] }
>> = {
  product: {
    title: 'FAQ Produit',
    subtitle: 'Réponses aux questions les plus posées sur nos services',
    faqs: productFaqs,
  },
  pricing: {
    title: 'FAQ Tarification',
    subtitle: 'Tout savoir sur nos prix et la facturation',
    faqs: pricingFaqs,
  },
  support: {
    title: 'FAQ Support',
    subtitle: 'Comment bénéficier de la meilleure assistance',
    faqs: supportFaqs,
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function ContextualFAQ({ context }: ContextualFAQProps) {
  const bridgeFaqs = useBridgeFaqs()

  const contextConfig = useMemo<Record<
    FAQContext,
    { title: string; subtitle: string; faqs: { question: string; answer: string }[] }
  >>(() => ({
    home: {
      title: 'Questions Fréquentes',
      subtitle: 'Tout ce que vous devez savoir avant de commencer',
      faqs: bridgeFaqs,
    },
    ...staticContextConfig as Record<Exclude<FAQContext, 'home'>, { title: string; subtitle: string; faqs: { question: string; answer: string }[] }>,
  }), [bridgeFaqs])

  const config = contextConfig[context]

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionTitle
            title={config.title}
            subtitle={config.subtitle}
            centered
            gradient
          />
        </motion.div>

        <motion.div
          className="mt-12"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Accordion items={config.faqs} />
        </motion.div>
      </div>
    </section>
  )
}
