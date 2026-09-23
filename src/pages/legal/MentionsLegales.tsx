import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'
import type { LegalSection } from './LegalLayout'

const sections: LegalSection[] = [
  {
    id: 'article-1',
    title: '1. Éditeur du site',
    content: (
      <>
        <p>
          Le site <strong>lklcloud.fr</strong> est édité par l'association <strong>LKL CLOUD</strong>, association déclarée régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.
        </p>
        <ul className="list-none space-y-1 my-4">
          <li><strong>Dénomination :</strong> LKL CLOUD</li>
          <li><strong>Forme juridique :</strong> Association déclarée (loi 1901)</li>
          <li><strong>SIREN :</strong> 999 237 175</li>
          <li><strong>SIRET (siège) :</strong> 999 237 175 00016</li>
          <li><strong>N° RNA :</strong> W913016294</li>
          <li><strong>Code APE :</strong> 94.99Z — Autres organisations fonctionnant par adhésion volontaire</li>
          <li><strong>Catégorie juridique INSEE :</strong> 9220</li>
          <li><strong>Date de création :</strong> 27 décembre 2025</li>
        </ul>
        <p>
          Pour toute question relative au site, vous pouvez nous contacter par e-mail à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-2',
    title: '2. Siège social',
    content: (
      <>
        <p>
          Le siège social de l'association LKL CLOUD est situé à l'adresse suivante :
        </p>
        <p className="my-4">
          <strong>LKL CLOUD</strong><br />
          15 Route de Gif<br />
          91190 Villiers-le-Bâcle<br />
          France
        </p>
      </>
    ),
  },
  {
    id: 'article-3',
    title: '3. Dirigeants de l\'association',
    content: (
      <>
        <p>
          Les dirigeants de l'association LKL CLOUD sont :
        </p>
        <ul className="list-none space-y-1 my-4">
          <li><strong>Président :</strong> Kylian TORQUEAU</li>
          <li><strong>Vice-Président :</strong> Lorenzo SAMBARINO</li>
        </ul>
      </>
    ),
  },
  {
    id: 'article-4',
    title: '4. Directeur de la publication',
    content: (
      <p>
        Le directeur de la publication du site <strong>lklcloud.fr</strong> est Monsieur Kylian TORQUEAU, en qualité de Président de l'association LKL CLOUD. Il peut être contacté à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
      </p>
    ),
  },
  {
    id: 'article-5',
    title: '5. Hébergement du site',
    content: (
      <>
        <p>
          Le site lklcloud.fr est hébergé sur les propres infrastructures de l'association LKL CLOUD, situées en France. L'infrastructure bénéficie d'une surveillance permanente par notre équipe technique et d'un taux de disponibilité garanti de 99,9 %.
        </p>
        <p>
          Pour toute réclamation relative à l'hébergement, vous pouvez contacter notre équipe à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
        </p>
      </>
    ),
  },
  {
    id: 'article-6',
    title: '6. Propriété intellectuelle',
    content: (
      <>
        <p>
          L'ensemble des éléments constituant le site lklcloud.fr — textes, graphismes, logiciels, photographies, images, vidéos, sons, logos, marques, créations et œuvres protégeables diverses — ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
        </p>
        <p>
          Ces éléments sont la propriété exclusive de l'association LKL CLOUD. Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable de LKL CLOUD.
        </p>
        <p>
          Toute exploitation non autorisée sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
        </p>
      </>
    ),
  },
  {
    id: 'article-7',
    title: '7. Limitation de responsabilité',
    content: (
      <>
        <p>
          L'association LKL CLOUD s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le site lklcloud.fr. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
        </p>
        <p>
          En conséquence, LKL CLOUD décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site. LKL CLOUD ne saurait être tenue responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site, y compris l'inaccessibilité, les pertes de données, détériorations ou virus qui pourraient affecter l'équipement informatique de l'utilisateur.
        </p>
        <p>
          LKL CLOUD ne pourra en aucun cas être tenue responsable du contenu des sites vers lesquels des liens hypertextes renvoient depuis le site lklcloud.fr, ni en cas de force majeure ou de fait indépendant de sa volonté.
        </p>
      </>
    ),
  },
  {
    id: 'article-8',
    title: '8. Protection des données personnelles',
    content: (
      <>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, l'association LKL CLOUD s'engage à protéger les données personnelles des utilisateurs du site lklcloud.fr.
        </p>
        <p>
          Les informations collectées via les formulaires du site sont destinées exclusivement à LKL CLOUD et sont nécessaires au traitement de vos demandes. Elles ne sont en aucun cas cédées à des tiers sans votre consentement préalable. Vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, de portabilité et d'opposition concernant vos données.
        </p>
        <p>
          Pour plus d'informations sur le traitement de vos données personnelles, veuillez consulter notre <Link to="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>. Vous pouvez exercer vos droits en contactant le responsable du traitement à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>.
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
          Le site lklcloud.fr utilise des cookies pour améliorer l'expérience de navigation des utilisateurs. Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la consultation d'un site internet.
        </p>
        <p>
          Les cookies utilisés sur notre site sont de deux types : les cookies strictement nécessaires au fonctionnement du site (authentification, préférences d'affichage), qui ne nécessitent pas votre consentement, et les cookies de préférences permettant de mémoriser vos choix de navigation. Nous n'utilisons pas de cookies publicitaires ni de cookies tiers à des fins de traçage.
        </p>
        <p>
          Vous pouvez à tout moment modifier vos préférences en matière de cookies via le bandeau de consentement ou les paramètres de votre navigateur. La suppression des cookies peut toutefois altérer votre expérience de navigation. Conformément à la directive ePrivacy et aux recommandations de la CNIL, nous recueillons votre consentement avant le dépôt de cookies non essentiels.
        </p>
      </>
    ),
  },
  {
    id: 'article-10',
    title: '10. Droit applicable et litiges',
    content: (
      <>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
        </p>
        <p>
          Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, vous pouvez recourir à un service de médiation. Vous pouvez également utiliser la plateforme de Règlement en Ligne des Litiges (RLL) de la Commission Européenne, accessible à l'adresse suivante : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
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
          Pour toute question, demande d'information ou signalement de contenu illicite, vous pouvez contacter l'éditeur du site :
        </p>
        <p className="my-4">
          <strong>Association LKL CLOUD</strong><br />
          15 Route de Gif<br />
          91190 Villiers-le-Bâcle, France<br />
          E-mail : <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>
        </p>
        <p>
          Nous nous efforçons de répondre à toutes les demandes dans un délai de 48 heures ouvrées.
        </p>
      </>
    ),
  },
]

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions Légales"
      lastUpdated="19 février 2026"
      sections={sections}
    />
  )
}
