import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'
import type { LegalSection } from './LegalLayout'

const sections: LegalSection[] = [
  {
    id: 'article-1',
    title: '1. Objet',
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente (ci-après « CGV ») définissent les droits et obligations de l'association LKL CLOUD (ci-après « le Prestataire ») et de ses clients (ci-après « le Client ») dans le cadre de la vente de services d'hébergement web, de serveurs privés virtuels (VPS), de serveurs de jeux et de services associés proposés sur le site <strong>lklcloud.fr</strong>.
        </p>
        <p>
          Toute commande de services implique l'acceptation sans réserve par le Client des présentes CGV. Ces conditions prévalent sur tout autre document du Client, sauf dérogation formelle et écrite du Prestataire. Le Prestataire se réserve le droit de modifier les présentes CGV à tout moment ; les conditions applicables sont celles en vigueur à la date de la commande.
        </p>
      </>
    ),
  },
  {
    id: 'article-2',
    title: '2. Identification du prestataire',
    content: (
      <>
        <p>
          Les services sont fournis par :
        </p>
        <ul className="list-none space-y-1 my-4">
          <li><strong>Dénomination :</strong> LKL CLOUD</li>
          <li><strong>Forme juridique :</strong> Association déclarée (loi 1901)</li>
          <li><strong>SIREN :</strong> 999 237 175</li>
          <li><strong>SIRET :</strong> 999 237 175 00016</li>
          <li><strong>N° RNA :</strong> W913016294</li>
          <li><strong>Siège social :</strong> 15 Route de Gif, 91190 Villiers-le-Bâcle, France</li>
          <li><strong>E-mail :</strong> <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a></li>
        </ul>
      </>
    ),
  },
  {
    id: 'article-3',
    title: '3. Services proposés',
    content: (
      <>
        <p>
          Le Prestataire propose des services d'hébergement web mutualisé, de serveurs privés virtuels (VPS) KVM sous Linux, et d'hébergement d'applications Python et Node.js. D'autres gammes de services (VPS Windows, noms de domaine) seront proposées ultérieurement.
        </p>
        <p>
          Les caractéristiques essentielles des services (ressources allouées, spécifications techniques, tarifs) sont décrites sur les pages produits du site lklcloud.fr. Le Prestataire s'engage à fournir les services conformément aux spécifications techniques indiquées dans l'offre souscrite par le Client.
        </p>
        <p>
          Le Prestataire se réserve le droit de faire évoluer les caractéristiques techniques de ses services afin d'en améliorer les performances. Ces évolutions ne pourront en aucun cas entraîner une dégradation de la qualité des services par rapport aux spécifications initiales de l'offre souscrite.
        </p>
      </>
    ),
  },
  {
    id: 'article-4',
    title: '4. Commande',
    content: (
      <>
        <p>
          Le Client passe commande via l'espace client accessible à l'adresse <a href="https://clients.lklcloud.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">clients.lklcloud.fr</a>. La commande n'est définitivement confirmée qu'après acceptation du paiement par le prestataire de paiement et envoi d'un e-mail de confirmation au Client.
        </p>
        <p>
          Le Client garantit l'exactitude des informations fournies lors de la commande (identité, coordonnées, adresse e-mail). Toute commande passée sur la base d'informations erronées pourra être annulée par le Prestataire.
        </p>
        <p>
          Le Prestataire se réserve le droit de refuser toute commande pour motif légitime, notamment en cas de suspicion de fraude, de non-paiement d'une commande antérieure, ou de non-respect des présentes CGV.
        </p>
      </>
    ),
  },
  {
    id: 'article-5',
    title: '5. Tarifs et paiement',
    content: (
      <>
        <p>
          Les prix des services sont indiqués en euros toutes taxes comprises (TTC) sur le site lklcloud.fr. L'association LKL CLOUD n'étant pas assujettie à la TVA, les prix affichés ne sont pas soumis à la taxe sur la valeur ajoutée.
        </p>
        <p>
          Le paiement est exigible à la commande. Les moyens de paiement acceptés sont indiqués lors du processus de commande sur l'espace client. Les factures sont émises selon la périodicité choisie par le Client (mensuelle, trimestrielle ou annuelle selon les offres). En cas de paiement récurrent, le Client autorise le Prestataire à débiter automatiquement son moyen de paiement à chaque échéance.
        </p>
        <p>
          Tout retard de paiement entraînera l'application de pénalités de retard calculées au taux de trois fois le taux d'intérêt légal en vigueur. En cas de non-paiement dans un délai de 15 jours suivant l'échéance, le Prestataire se réserve le droit de suspendre les services sans préavis supplémentaire.
        </p>
      </>
    ),
  },
  {
    id: 'article-6',
    title: '6. Droit de rétractation',
    content: (
      <>
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client consommateur dispose d'un délai de <strong>quatorze (14) jours calendaires</strong> à compter de la souscription pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
        </p>
        <p>
          Pour exercer ce droit, le Client doit adresser une demande claire et non ambiguë par e-mail à l'adresse <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a> en indiquant son identité, la référence de la commande concernée et sa volonté de se rétracter. Le Prestataire procédera au remboursement du Client dans un délai maximum de <strong>quatorze (14) jours</strong> à compter de la réception de la demande de rétractation, en utilisant le même moyen de paiement que celui utilisé pour la commande initiale.
        </p>
        <p>
          Si le Client a expressément demandé le début de l'exécution des services avant l'expiration du délai de rétractation, il devra verser au Prestataire un montant proportionnel à ce qui lui a été fourni jusqu'à la communication de sa décision de se rétracter, conformément à l'article L.221-25 du Code de la consommation.
        </p>
        <p>
          Le Prestataire ne propose pas de garantie « satisfait ou remboursé ». Seul le droit de rétractation légal de 14 jours s'applique dans les conditions décrites ci-dessus.
        </p>
      </>
    ),
  },
  {
    id: 'article-7',
    title: '7. Durée et renouvellement',
    content: (
      <>
        <p>
          Les services sont souscrits pour une durée initiale correspondant à la période de facturation choisie par le Client (mensuelle, trimestrielle ou annuelle). À l'expiration de cette période, les services sont automatiquement renouvelés pour une durée identique, sauf résiliation par l'une ou l'autre des parties.
        </p>
        <p>
          Le Client est informé du renouvellement à venir par e-mail avant chaque échéance. Il peut désactiver le renouvellement automatique à tout moment depuis son espace client.
        </p>
      </>
    ),
  },
  {
    id: 'article-8',
    title: '8. Résiliation',
    content: (
      <>
        <p>
          Le Client peut résilier ses services à tout moment depuis son espace client sur <a href="https://clients.lklcloud.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">clients.lklcloud.fr</a>. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement au prorata ne sera effectué pour la période restante, sauf dans le cadre du droit de rétractation prévu à l'article 6.
        </p>
        <p>
          Le Prestataire peut résilier les services de plein droit en cas de manquement grave du Client à ses obligations, notamment en cas de non-paiement, d'utilisation abusive des ressources ou de violation des présentes CGV ou des <Link to="/cgu" className="text-primary hover:underline">Conditions Générales d'Utilisation</Link>. Le Client sera informé par e-mail et disposera d'un délai de 7 jours pour régulariser sa situation avant la suspension définitive des services.
        </p>
        <p>
          En cas de résiliation, les données du Client sont conservées pendant un délai de 30 jours, durant lequel il peut demander leur récupération. Passé ce délai, les données sont définitivement supprimées.
        </p>
      </>
    ),
  },
  {
    id: 'article-9',
    title: '9. Obligations du Client',
    content: (
      <>
        <p>
          Le Client s'engage à utiliser les services conformément à leur destination et dans le respect de la législation française et européenne en vigueur. Il est responsable de l'ensemble des contenus hébergés sur ses services et garantit que ceux-ci ne portent pas atteinte aux droits des tiers, à l'ordre public ou aux bonnes mœurs.
        </p>
        <p>
          Le Client est seul responsable de la sécurisation de ses accès (identifiants, mots de passe, clés SSH) et s'engage à ne pas les communiquer à des tiers non autorisés. Il est tenu de mettre en œuvre les mesures de sécurité appropriées pour protéger ses données et applications.
        </p>
        <p>
          Sont notamment interdits : l'envoi de spam, le phishing, l'hébergement de contenus piratés ou illicites, le minage de cryptomonnaies non autorisé, les attaques informatiques (DDoS, brute force), ou toute activité susceptible de porter atteinte à l'intégrité de l'infrastructure du Prestataire. Toute violation pourra entraîner la suspension immédiate des services sans indemnité.
        </p>
      </>
    ),
  },
  {
    id: 'article-10',
    title: '10. Obligations du Prestataire',
    content: (
      <>
        <p>
          Le Prestataire s'engage à fournir les services avec diligence et selon les règles de l'art, dans le cadre d'une obligation de moyens. Il met en œuvre tous les moyens nécessaires pour assurer la continuité et la qualité des services proposés.
        </p>
        <p>
          Le Prestataire s'engage à assurer la disponibilité de son infrastructure conformément aux engagements de niveau de service (SLA) définis à l'article 11. Il informe le Client de toute maintenance programmée dans un délai raisonnable et s'efforce de minimiser l'impact de ces interventions.
        </p>
        <p>
          Le Prestataire met en œuvre les mesures de sécurité techniques et organisationnelles appropriées pour protéger l'infrastructure contre les accès non autorisés, les attaques DDoS et les pertes de données. Toutefois, le Prestataire ne saurait garantir une sécurité absolue et recommande au Client de maintenir ses propres sauvegardes.
        </p>
      </>
    ),
  },
  {
    id: 'article-11',
    title: '11. Niveau de service (SLA)',
    content: (
      <>
        <p>
          Le Prestataire garantit un taux de disponibilité réseau de <strong>99,9 %</strong> sur une base mensuelle, hors périodes de maintenance programmée et cas de force majeure. Ce taux est calculé sur la disponibilité de l'infrastructure réseau du Prestataire, à l'exclusion des éléments indépendants de sa volonté (transit internet, FAI du Client, etc.).
        </p>
        <p>
          En cas de non-respect de cet engagement, le Client pourra solliciter une compensation sous forme de crédit de service, calculé proportionnellement à la durée de l'indisponibilité constatée. Ce crédit ne pourra excéder le montant mensuel de l'abonnement du Client. La demande de crédit devra être adressée par e-mail dans un délai de 30 jours suivant l'incident.
        </p>
        <p>
          Cette garantie ne s'applique pas en cas de : force majeure, maintenance programmée, faute du Client ou d'un tiers, attaque DDoS d'une ampleur exceptionnelle, ou indisponibilité résultant d'une utilisation anormale des services par le Client.
        </p>
      </>
    ),
  },
  {
    id: 'article-12',
    title: '12. Limitation de responsabilité',
    content: (
      <>
        <p>
          La responsabilité du Prestataire est limitée aux dommages directs et prévisibles résultant d'un manquement avéré à ses obligations contractuelles. En aucun cas, le Prestataire ne pourra être tenu responsable des dommages indirects, tels que pertes de chiffre d'affaires, pertes de données, atteinte à l'image de marque ou manque à gagner.
        </p>
        <p>
          En tout état de cause, la responsabilité totale du Prestataire au titre d'une année contractuelle ne pourra excéder le montant total des sommes versées par le Client au cours des douze (12) derniers mois précédant le fait générateur de responsabilité.
        </p>
        <p>
          Le Client est seul responsable des sauvegardes de ses données. Bien que le Prestataire puisse proposer des solutions de sauvegarde selon l'offre souscrite, il appartient au Client de vérifier l'intégrité de ses sauvegardes et de maintenir des copies indépendantes de ses données critiques.
        </p>
      </>
    ),
  },
  {
    id: 'article-13',
    title: '13. Données personnelles',
    content: (
      <>
        <p>
          Dans le cadre de l'exécution de ses services, le Prestataire est amené à traiter des données personnelles du Client en qualité de responsable de traitement pour les données de gestion de compte, et en qualité de sous-traitant pour les données hébergées sur les serveurs du Client.
        </p>
        <p>
          Le traitement des données personnelles est effectué conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés. Pour plus d'informations, veuillez consulter notre <Link to="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>.
        </p>
        <p>
          Le Prestataire s'engage à ne pas transférer les données du Client en dehors de l'Union Européenne sans le consentement préalable de celui-ci et sans garanties appropriées conformément au RGPD.
        </p>
      </>
    ),
  },
  {
    id: 'article-14',
    title: '14. Force majeure',
    content: (
      <p>
        Aucune des parties ne pourra être tenue responsable de l'inexécution de ses obligations si cette inexécution résulte d'un cas de force majeure au sens de l'article 1218 du Code civil. Sont notamment considérés comme cas de force majeure : les catastrophes naturelles, les guerres, les grèves, les pannes générales de télécommunication, les cyberattaques d'ampleur exceptionnelle, les décisions gouvernementales ou réglementaires empêchant l'exécution du contrat. La partie invoquant la force majeure devra en informer l'autre partie dans les meilleurs délais.
      </p>
    ),
  },
  {
    id: 'article-15',
    title: '15. Droit applicable et litiges',
    content: (
      <>
        <p>
          Les présentes CGV sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis à la compétence exclusive des tribunaux du ressort du siège social du Prestataire, sauf dispositions légales impératives contraires.
        </p>
        <p>
          Préalablement à toute action judiciaire, les parties s'engagent à rechercher une solution amiable. Le Client pourra adresser une réclamation par e-mail à <a href="mailto:support@lklcloud.fr" className="text-primary hover:underline">support@lklcloud.fr</a>. Le Prestataire s'engage à répondre dans un délai de 30 jours.
        </p>
        <p>
          Conformément aux dispositions du Code de la consommation, le Client consommateur peut recourir gratuitement à un service de médiation de la consommation. Il peut également utiliser la plateforme européenne de Règlement en Ligne des Litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
        </p>
      </>
    ),
  },
]

export default function CGV() {
  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      lastUpdated="19 février 2026"
      sections={sections}
    />
  )
}
