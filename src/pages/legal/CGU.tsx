import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'
import type { LegalSection } from './LegalLayout'

const sections: LegalSection[] = [
  {
    id: 'article-1',
    title: "1. Acceptation des conditions",
    content: (
      <>
        <p>
          Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site <strong>lklcloud.fr</strong> ainsi que de l'ensemble des services proposés par l'association LKL CLOUD. L'accès au site et l'utilisation des services impliquent l'acceptation pleine et entière des présentes CGU.
        </p>
        <p>
          Si vous n'acceptez pas l'intégralité des présentes CGU, vous êtes invité à renoncer à l'utilisation du site et des services. LKL CLOUD se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification sur le site ou par e-mail.
        </p>
        <p>
          La poursuite de l'utilisation des services après la publication des modifications vaut acceptation de celles-ci. Il est recommandé de consulter régulièrement les présentes CGU afin de prendre connaissance de toute évolution.
        </p>
      </>
    ),
  },
  {
    id: 'article-2',
    title: '2. Description des services',
    content: (
      <>
        <p>
          L'association LKL CLOUD met à disposition de ses utilisateurs une plateforme de services d'hébergement web, de serveurs privés virtuels (VPS), d'hébergement d'applications et de serveurs de jeux. Ces services sont accessibles via le site lklcloud.fr et l'espace client disponible à l'adresse <a href="https://client.lklcloud.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">client.lklcloud.fr</a>.
        </p>
        <p>
          Les services comprennent la mise à disposition de ressources informatiques (calcul, stockage, réseau), la gestion technique de l'infrastructure sous-jacente, le support technique, ainsi que l'accès à des outils de gestion via l'espace client.
        </p>
        <p>
          Le Prestataire s'efforce de maintenir les services accessibles 24 heures sur 24, 7 jours sur 7. Toutefois, il se réserve le droit de suspendre temporairement l'accès pour des raisons de maintenance, de mise à jour ou pour tout autre motif technique, sans que cela ne puisse engager sa responsabilité.
        </p>
      </>
    ),
  },
  {
    id: 'article-3',
    title: '3. Inscription et compte utilisateur',
    content: (
      <>
        <p>
          L'accès à certains services nécessite la création d'un compte utilisateur sur la plateforme <a href="https://client.lklcloud.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">client.lklcloud.fr</a>. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription. Toute information erronée ou incomplète pourra entraîner la suspension ou la suppression du compte.
        </p>
        <p>
          L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion (adresse e-mail et mot de passe). Il s'engage à ne pas divulguer ces informations à des tiers et à informer immédiatement LKL CLOUD de toute utilisation non autorisée de son compte ou de toute atteinte à sa sécurité.
        </p>
        <p>
          LKL CLOUD se réserve le droit de refuser l'inscription ou de supprimer un compte utilisateur en cas de non-respect des présentes CGU, de fourniture d'informations inexactes, ou de comportement portant atteinte aux intérêts du Prestataire ou des autres utilisateurs.
        </p>
      </>
    ),
  },
  {
    id: 'article-4',
    title: '4. Utilisation acceptable',
    content: (
      <>
        <p>
          L'utilisateur s'engage à utiliser les services de manière responsable et conforme aux lois et réglementations en vigueur. Il est strictement interdit d'utiliser les services à des fins illégales, frauduleuses, diffamatoires, discriminatoires ou portant atteinte aux droits des tiers.
        </p>
        <p>
          Sont notamment interdits :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li>L'envoi de communications commerciales non sollicitées (spam)</li>
          <li>Le phishing, l'usurpation d'identité ou toute forme de fraude</li>
          <li>La diffusion de logiciels malveillants (virus, ransomware, chevaux de Troie)</li>
          <li>Le minage de cryptomonnaies sans autorisation préalable</li>
          <li>Les attaques informatiques (DDoS, brute force, scanning de ports)</li>
          <li>L'hébergement de contenus portant atteinte à la propriété intellectuelle</li>
          <li>L'hébergement de contenus pédopornographiques, incitant à la haine ou à la violence</li>
          <li>Toute activité susceptible de nuire à l'infrastructure ou aux services du Prestataire</li>
        </ul>
        <p>
          En cas de violation de ces règles, LKL CLOUD se réserve le droit de suspendre immédiatement les services concernés, sans préavis ni indemnité. L'utilisateur sera informé par e-mail et pourra contester la décision en adressant une réclamation à <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-5',
    title: '5. Contenu et propriété intellectuelle',
    content: (
      <>
        <p>
          L'utilisateur conserve l'intégralité des droits de propriété intellectuelle sur les contenus qu'il héberge via les services de LKL CLOUD. Le Prestataire ne revendique aucun droit de propriété sur les données, fichiers, applications ou tout autre contenu déposé par l'utilisateur.
        </p>
        <p>
          L'utilisateur garantit qu'il dispose de tous les droits nécessaires sur les contenus hébergés et que ceux-ci ne portent pas atteinte aux droits de propriété intellectuelle de tiers. En cas de réclamation d'un tiers, l'utilisateur s'engage à indemniser et dégager LKL CLOUD de toute responsabilité.
        </p>
        <p>
          L'ensemble des éléments du site lklcloud.fr (marque, logo, design, textes, code source) sont la propriété exclusive de l'association LKL CLOUD et sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction ou utilisation non autorisée de ces éléments constitue une contrefaçon.
        </p>
      </>
    ),
  },
  {
    id: 'article-6',
    title: '6. Disponibilité des services',
    content: (
      <>
        <p>
          LKL CLOUD met en œuvre tous les moyens raisonnables pour assurer une disponibilité maximale de ses services. L'objectif de disponibilité est de 99,9 % sur une base mensuelle, hors périodes de maintenance programmée. Les engagements de niveau de service (SLA) sont détaillés dans les <Link to="/cgv" className="text-primary hover:underline">Conditions Générales de Vente</Link>.
        </p>
        <p>
          Des interruptions de service peuvent survenir en raison de maintenances programmées, de mises à jour de sécurité, de pannes matérielles ou de circonstances indépendantes de la volonté du Prestataire. LKL CLOUD s'efforce d'informer les utilisateurs au préalable de toute maintenance planifiée et de minimiser la durée des interruptions.
        </p>
        <p>
          Le Prestataire ne saurait être tenu responsable des interruptions résultant de cas de force majeure, de défaillances des réseaux de télécommunication, d'actes malveillants de tiers ou de toute circonstance échappant à son contrôle raisonnable.
        </p>
      </>
    ),
  },
  {
    id: 'article-7',
    title: '7. Suspension et résiliation',
    content: (
      <>
        <p>
          LKL CLOUD se réserve le droit de suspendre ou de résilier l'accès aux services en cas de manquement de l'utilisateur aux présentes CGU, de non-paiement des sommes dues, ou d'utilisation abusive des ressources mises à disposition. La suspension est notifiée par e-mail et peut être levée après régularisation.
        </p>
        <p>
          En cas de motif grave (activité illicite, atteinte à l'infrastructure), la suspension peut être immédiate et sans préavis. L'utilisateur dispose d'un délai de 7 jours pour formuler ses observations. À l'issue de ce délai, et en l'absence de régularisation, les services pourront être résiliés définitivement.
        </p>
        <p>
          L'utilisateur peut à tout moment demander la résiliation de ses services depuis son espace client. Ses données seront conservées pendant 30 jours après la résiliation, délai durant lequel il peut en demander la récupération. Au-delà, les données sont définitivement supprimées.
        </p>
      </>
    ),
  },
  {
    id: 'article-8',
    title: '8. Responsabilité',
    content: (
      <>
        <p>
          LKL CLOUD agit en qualité d'hébergeur au sens de la loi pour la confiance dans l'économie numérique (LCEN) du 21 juin 2004. À ce titre, le Prestataire n'est pas tenu d'une obligation générale de surveillance des contenus hébergés par les utilisateurs.
        </p>
        <p>
          Toutefois, le Prestataire s'engage à agir promptement pour retirer ou rendre inaccessible tout contenu manifestement illicite dès qu'il en a connaissance, conformément aux dispositions de la LCEN. Tout utilisateur peut signaler un contenu illicite en contactant <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
        </p>
        <p>
          La responsabilité du Prestataire ne saurait être engagée pour les dommages résultant de l'utilisation des services par l'utilisateur, de la perte ou de l'altération de données, ou de toute conséquence liée à l'interruption des services dans les cas prévus aux présentes CGU. L'utilisateur demeure seul responsable de l'utilisation qu'il fait des services.
        </p>
      </>
    ),
  },
  {
    id: 'article-9',
    title: '9. Données personnelles',
    content: (
      <p>
        Le traitement des données personnelles des utilisateurs est effectué conformément au RGPD et à la loi Informatique et Libertés. Pour connaître les modalités de collecte, de traitement et de protection de vos données, veuillez consulter notre <Link to="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>.
      </p>
    ),
  },
  {
    id: 'article-10',
    title: '10. Modification des CGU',
    content: (
      <>
        <p>
          LKL CLOUD se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le site lklcloud.fr. Les utilisateurs seront informés des modifications substantielles par e-mail ou par notification visible sur le site.
        </p>
        <p>
          En cas de modification, l'utilisateur dispose d'un délai de 30 jours pour accepter ou refuser les nouvelles conditions. L'absence de refus dans ce délai vaut acceptation. En cas de refus, l'utilisateur pourra résilier ses services sans frais ni pénalité.
        </p>
      </>
    ),
  },
  {
    id: 'article-11',
    title: '11. Droit applicable et litiges',
    content: (
      <>
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis aux tribunaux français compétents.
        </p>
        <p>
          Conformément aux dispositions du Code de la consommation, le Client consommateur peut recourir gratuitement à un service de médiation de la consommation. Il peut également utiliser la plateforme européenne de Règlement en Ligne des Litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-12',
    title: '12. Contact',
    content: (
      <>
        <p>
          Pour toute question relative aux présentes CGU ou à l'utilisation des services :
        </p>
        <p className="my-4">
          <strong>Association LKL CLOUD</strong><br />
          15 Route de Gif<br />
          91190 Villiers-le-Bâcle, France<br />
          E-mail : <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a><br />
          Espace client : <a href="https://client.lklcloud.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">client.lklcloud.fr</a>
        </p>
      </>
    ),
  },
]

export default function CGU() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      lastUpdated="19 février 2026"
      sections={sections}
    />
  )
}
