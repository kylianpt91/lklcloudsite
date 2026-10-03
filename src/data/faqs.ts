import type { FAQ } from '@/types'

export const generalFaqs: FAQ[] = [
  {
    question: "Qu'est-ce que LKLCloud ?",
    answer:
      "LKLCloud est un hébergeur français fondé en décembre 2025 par Kylian, qui est spécialisé dans les serveurs VPS, l'hébergement web et l'hébergement de bots Discord (Node.js, Python). Notre infrastructure est hébergée à Paris et nous vous proposons une connexion ultra-rapide sur l'ensemble de nos offres.",
  },
  {
    question: 'Où sont situés vos serveurs ?',
    answer:
      "Tous nos serveurs sont hébergés en France, à Paris. Cela garantit une latence minimale pour vos visiteurs européens, ainsi qu'une conformité RGPD native pour vos données.",
  },

  {
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer:
      "Nous acceptons les cartes bancaires (Visa, Mastercard, CB) et PayPal. Toutes les transactions sont sécurisées par chiffrement SSL via notre espace client.",
  },
  {
    question: 'Comment contacter le support technique ?',
    answer:
      "Notre support est disponible 7j/7 par ticket depuis votre espace client et par <a href=\"https://discord.gg/lklcloud\">Discord</a>. Nous répondons en moyenne en 25 minutes.",
  },
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer:
      "Oui, vous pouvez passer à un plan supérieur à tout moment depuis votre espace client. La migration est effectuée sans interruption de service et la facturation est ajustée au prorata.",
  },
  {
    question: 'Vos services incluent-ils une protection anti-DDoS ?',
    answer:
      "Oui, tous nos services bénéficient d'une protection anti-DDoS incluse, sans surcoût. La mitigation est automatique et adaptée au type de service (web, VPS ou bot Discord).",
  },
  {
    question: 'Comment sont gérées les sauvegardes ?',
    answer:
      "L'infrastructure est sauvegardée au niveau de chaque node de manière automatique. Cependant, ces sauvegardes ne sont pas directement accessibles. Nous vous recommandons de réaliser vos propres sauvegardes régulières de vos fichiers et bases de données.",
  },
]
