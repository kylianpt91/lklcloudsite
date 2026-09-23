import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'
import type { LegalSection } from './LegalLayout'

const sections: LegalSection[] = [
  {
    id: 'article-1',
    title: '1. Responsable du traitement',
    content: (
      <>
        <p>
          Le responsable du traitement des données personnelles collectées sur le site <strong>lklcloud.fr</strong> et via l'espace client est :
        </p>
        <ul className="list-none space-y-1 my-4">
          <li><strong>Association LKL CLOUD</strong></li>
          <li>15 Route de Gif</li>
          <li>91190 Villiers-le-Bâcle, France</li>
          <li>SIREN : 999 237 175</li>
          <li>E-mail : <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a></li>
        </ul>
        <p>
          Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à l'adresse ci-dessus.
        </p>
      </>
    ),
  },
  {
    id: 'article-2',
    title: '2. Données collectées',
    content: (
      <>
        <p>
          Dans le cadre de la fourniture de ses services et de la navigation sur le site lklcloud.fr, LKL CLOUD est amenée à collecter les catégories de données personnelles suivantes :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail</li>
          <li><strong>Données de facturation :</strong> adresse postale, informations de paiement (les coordonnées bancaires complètes ne sont jamais stockées par LKL CLOUD)</li>
          <li><strong>Données de connexion :</strong> adresse IP, logs de connexion, données de navigation</li>
          <li><strong>Données techniques :</strong> type de navigateur, système d'exploitation, résolution d'écran</li>
        </ul>
        <p>
          La collecte est effectuée lors de la création de votre compte utilisateur, lors de la souscription à nos services, lors de l'utilisation de nos formulaires de contact, ou automatiquement lors de la navigation sur notre site via les cookies.
        </p>
        <p>
          Seules les données strictement nécessaires à la finalité du traitement sont collectées, conformément au principe de minimisation des données prévu par le RGPD (article 5.1.c). Nous ne collectons aucune donnée sensible au sens de l'article 9 du RGPD.
        </p>
      </>
    ),
  },
  {
    id: 'article-3',
    title: '3. Finalités du traitement',
    content: (
      <>
        <p>
          Les données personnelles collectées sont utilisées pour les finalités suivantes :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li>La gestion de votre compte client et l'exécution de nos services d'hébergement</li>
          <li>La facturation et le suivi des paiements</li>
          <li>Le support technique et la résolution de vos demandes</li>
          <li>L'amélioration de nos services et de l'expérience utilisateur</li>
          <li>L'envoi de communications relatives à nos services (avec votre consentement)</li>
          <li>Le respect de nos obligations légales et réglementaires</li>
        </ul>
        <p>
          Les données de navigation (adresse IP, pages consultées) sont utilisées à des fins statistiques et d'amélioration de nos services. Nous n'utilisons pas vos données personnelles à des fins de profilage commercial.
        </p>
      </>
    ),
  },
  {
    id: 'article-4',
    title: '4. Base légale du traitement',
    content: (
      <>
        <p>
          Le traitement de vos données personnelles repose sur les bases légales suivantes, conformément à l'article 6 du RGPD :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>L'exécution du contrat</strong> (article 6.1.b) : pour la gestion de votre compte et la fourniture des services souscrits</li>
          <li><strong>L'obligation légale</strong> (article 6.1.c) : pour la facturation, les obligations comptables et la conservation des données de connexion</li>
          <li><strong>Le consentement</strong> (article 6.1.a) : pour l'envoi de newsletters, les cookies non essentiels et les communications commerciales</li>
          <li><strong>L'intérêt légitime</strong> (article 6.1.f) : pour la prévention de la fraude, l'amélioration de nos services et la sécurité de notre infrastructure</li>
        </ul>
        <p>
          Lorsque le traitement est fondé sur votre consentement, vous pouvez retirer ce consentement à tout moment, sans que cela n'affecte la licéité du traitement effectué avant le retrait. Pour retirer votre consentement, contactez-nous à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-5',
    title: '5. Destinataires des données',
    content: (
      <>
        <p>
          LKL CLOUD ne vend, ne loue et ne cède en aucun cas vos données personnelles à des tiers à des fins commerciales. Vos données peuvent toutefois être partagées dans les cas strictement nécessaires suivants :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>Prestataires de paiement :</strong> pour le traitement sécurisé de vos transactions financières</li>
          <li><strong>Fournisseurs d'infrastructure :</strong> dans le cadre de la fourniture des services d'hébergement</li>
          <li><strong>Autorités compétentes :</strong> sur demande judiciaire ou dans le cadre d'obligations légales</li>
        </ul>
        <p>
          Nos sous-traitants sont contractuellement tenus de protéger vos données et de ne les utiliser que conformément à nos instructions et dans le respect du RGPD.
        </p>
        <p>
          Vos données sont hébergées et traitées exclusivement au sein de l'Union Européenne. En cas de transfert de données en dehors de l'UE, des garanties appropriées seront mises en place (clauses contractuelles types de la Commission Européenne).
        </p>
      </>
    ),
  },
  {
    id: 'article-6',
    title: '6. Durée de conservation',
    content: (
      <>
        <p>
          Les données personnelles sont conservées pendant la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>Données de compte client :</strong> pendant toute la durée de la relation contractuelle, puis 3 ans après la fin de la relation</li>
          <li><strong>Données de facturation :</strong> 10 ans conformément aux obligations légales comptables et fiscales</li>
          <li><strong>Données de support technique :</strong> 2 ans à compter de la résolution de la demande</li>
          <li><strong>Données de connexion (logs) :</strong> 12 mois maximum conformément à la réglementation applicable</li>
          <li><strong>Cookies :</strong> 13 mois maximum conformément aux recommandations de la CNIL</li>
        </ul>
        <p>
          À l'expiration de ces délais, vos données sont soit supprimées, soit anonymisées de manière irréversible. Vous pouvez à tout moment demander la suppression anticipée de vos données, sous réserve du respect des obligations légales de conservation.
        </p>
      </>
    ),
  },
  {
    id: 'article-7',
    title: '7. Sécurité des données',
    content: (
      <>
        <p>
          LKL CLOUD met en œuvre les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données personnelles, conformément à l'article 32 du RGPD. Ces mesures incluent notamment :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li>Le chiffrement des données en transit (protocole TLS/SSL)</li>
          <li>Le contrôle d'accès strict aux systèmes contenant des données personnelles</li>
          <li>La surveillance continue de notre infrastructure</li>
          <li>La protection contre les attaques DDoS</li>
          <li>Des sauvegardes régulières et sécurisées</li>
        </ul>
        <p>
          En cas de violation de données à caractère personnel susceptible d'engendrer un risque élevé pour vos droits et libertés, nous vous en informerons dans les meilleurs délais conformément à l'article 34 du RGPD. Nous notifierons également la CNIL dans un délai de 72 heures conformément à l'article 33 du RGPD.
        </p>
      </>
    ),
  },
  {
    id: 'article-8',
    title: '8. Vos droits',
    content: (
      <>
        <p>
          Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>Droit d'accès</strong> (article 15) : obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
          <li><strong>Droit de rectification</strong> (article 16) : demander la correction de données inexactes ou incomplètes</li>
          <li><strong>Droit à l'effacement</strong> (article 17) : demander la suppression de vos données dans les cas prévus par le RGPD</li>
          <li><strong>Droit à la limitation du traitement</strong> (article 18) : demander la suspension du traitement de vos données</li>
          <li><strong>Droit à la portabilité</strong> (article 20) : recevoir vos données dans un format structuré et couramment utilisé</li>
          <li><strong>Droit d'opposition</strong> (article 21) : vous opposer au traitement de vos données pour des motifs légitimes</li>
        </ul>
        <p>
          Pour exercer ces droits, adressez votre demande par e-mail à <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a> en précisant votre identité et le droit que vous souhaitez exercer. Votre demande sera traitée dans un délai maximum de 30 jours.
        </p>
        <p>
          Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-9',
    title: '9. Cookies',
    content: (
      <>
        <p>
          Le site lklcloud.fr utilise des cookies et technologies similaires pour améliorer votre expérience de navigation. Un cookie est un petit fichier texte déposé sur votre terminal lors de la consultation du site.
        </p>
        <p>
          Nous utilisons les catégories de cookies suivantes :
        </p>
        <ul className="list-disc list-inside space-y-1 my-3">
          <li><strong>Cookies strictement nécessaires :</strong> authentification, préférences d'affichage, sécurité. Ces cookies ne nécessitent pas votre consentement.</li>
          <li><strong>Cookies de préférences :</strong> mémorisation de vos choix de navigation (taille de police, contraste, etc.)</li>
        </ul>
        <p>
          Nous n'utilisons pas de cookies publicitaires ni de cookies de réseaux sociaux à des fins de traçage. Vous pouvez gérer vos préférences via le bandeau de consentement affiché lors de votre première visite ou via les paramètres de votre navigateur.
        </p>
        <p>
          Conformément aux recommandations de la CNIL, les cookies de préférences ont une durée de vie maximale de 13 mois. Votre consentement est renouvelé périodiquement.
        </p>
      </>
    ),
  },
  {
    id: 'article-10',
    title: '10. Modifications de la politique',
    content: (
      <>
        <p>
          LKL CLOUD se réserve le droit de modifier la présente Politique de Confidentialité afin de l'adapter aux évolutions légales, réglementaires ou techniques. Toute modification substantielle sera portée à votre connaissance par e-mail ou par notification visible sur le site.
        </p>
        <p>
          La date de dernière mise à jour est indiquée en haut de ce document. En cas de modification affectant significativement le traitement de vos données, nous vous en informerons au moins 30 jours avant l'entrée en vigueur et vous offrirons la possibilité de retirer votre consentement.
        </p>
      </>
    ),
  },
  {
    id: 'article-11',
    title: '11. Contact',
    content: (
      <>
        <p>
          Pour toute question relative à la protection de vos données personnelles ou pour exercer vos droits :
        </p>
        <p className="my-4">
          <strong>Association LKL CLOUD</strong><br />
          15 Route de Gif<br />
          91190 Villiers-le-Bâcle, France<br />
          E-mail : <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>
        </p>
        <p>
          Vous pouvez également consulter nos <Link to="/mentions-legales" className="text-primary hover:underline">Mentions Légales</Link> et nos <Link to="/cgu" className="text-primary hover:underline">Conditions Générales d'Utilisation</Link> pour plus d'informations.
        </p>
      </>
    ),
  },
]

export default function PolitiqueConfidentialite() {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      lastUpdated="19 février 2026"
      sections={sections}
    />
  )
}
