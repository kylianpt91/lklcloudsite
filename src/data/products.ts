import type { ProductCategory } from '@/types'

const O = 'https://client.lklcloud.fr/index.php?rp=/store'

export const productCategories: ProductCategory[] = [
  // ─── VPS KVM Linux ─────────────────────────────────────────────────
  {
    slug: 'vps-linux',
    category: 'Cloud',
    name: 'VPS KVM Linux',
    shortName: 'VPS KVM',
    description:
      'Serveurs privés virtuels KVM sous Linux avec accès root complet, ressources dédiées et performances NVMe.',
    icon: 'Server',
    heroTitle: 'VPS KVM Linux',
    heroDescription:
      'Déployez votre serveur Linux en quelques secondes. Virtualisation KVM, accès root complet et ressources dédiées pour une flexibilité totale.',
    plans: [
      { id: 'vps-linux-iskra', name: 'Iskra', price: 3.99, priceQuarterly: 10.99, priceYearly: 39.99, period: 'mois', orderUrl: `${O}/vps/iskra`, features: ['Intel Xeon E5-2650 v2', '2 vCores 2,60 GHz', '4 Go RAM', '40 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '4 Go RAM', cpu: '2 vCores 2,60 GHz', storage: '40 Go SSD', bandwidth: '10 Gbps' } },
      { id: 'vps-linux-impulse', name: 'Impulse', price: 7.99, priceQuarterly: 21.99, priceYearly: 79.99, period: 'mois', orderUrl: `${O}/vps/impulse`, features: ['Intel Xeon E5-2650 v2', '4 vCores 2,60 GHz', '8 Go RAM', '80 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '8 Go RAM', cpu: '4 vCores 2,60 GHz', storage: '80 Go SSD', bandwidth: '10 Gbps' } },
      { id: 'vps-linux-momentum', name: 'Momentum', price: 9.99, priceQuarterly: 27.99, priceYearly: 99.99, period: 'mois', highlighted: true, badge: 'Populaire', orderUrl: `${O}/vps/momentum`, features: ['Intel Xeon E5-2650 v2', '6 vCores 2,60 GHz', '12 Go RAM', '120 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '12 Go RAM', cpu: '6 vCores 2,60 GHz', storage: '120 Go SSD', bandwidth: '10 Gbps' } },
      { id: 'vps-linux-keystone', name: 'Keystone', price: 11.99, priceQuarterly: 33.99, priceYearly: 121.99, period: 'mois', orderUrl: `${O}/vps/keystone`, features: ['Intel Xeon E5-2650 v2', '8 vCores 2,60 GHz', '16 Go RAM', '160 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '16 Go RAM', cpu: '8 vCores 2,60 GHz', storage: '160 Go SSD', bandwidth: '10 Gbps' } },
      { id: 'vps-linux-aurora', name: 'Aurora', price: 18.99, priceQuarterly: 53.99, priceYearly: 189.99, period: 'mois', orderUrl: `${O}/vps/aurora`, features: ['Intel Xeon E5-2650 v2', '10 vCores 2,60 GHz', '24 Go RAM', '220 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '24 Go RAM', cpu: '10 vCores 2,60 GHz', storage: '220 Go SSD', bandwidth: '10 Gbps' } },
      { id: 'vps-linux-zenith', name: 'Zenith', price: 24.99, priceQuarterly: 69.99, priceYearly: 249.99, period: 'mois', orderUrl: `${O}/vps/zenith`, features: ['Intel Xeon E5-2650 v2', '12 vCores 2,60 GHz', '32 Go RAM', '280 Go SSD', 'Réseau jusqu’à 10 Gbps', 'Anti-DDoS Stormwall & Gcore', 'Support 24/7'], specs: { ram: '32 Go RAM', cpu: '12 vCores 2,60 GHz', storage: '280 Go SSD', bandwidth: '10 Gbps' } },
    ],
    faqs: [
      { question: 'Quelles distributions Linux sont disponibles ?', answer: 'Debian 12, Debian 13, Ubuntu 22.04 et Ubuntu 24.04. D’autres distributions seront ajoutées prochainement.' },
      { question: 'Ai-je un accès root complet ?', answer: 'Oui. Vous disposez d’un accès root complet et êtes libre d’installer et de configurer les logiciels de votre choix.' },
      { question: 'Comment accéder à mon VPS ?', answer: 'Via SSH avec l’utilisateur root et un mot de passe. Vous pouvez utiliser un client SSH comme <a href="https://mobaxterm.mobatek.net/download-home-edition.html" target="_blank" rel="noopener noreferrer">MobaXterm</a> ou <a href="https://termius.com/" target="_blank" rel="noopener noreferrer">Termius</a>.' },
      { question: 'Puis-je changer de plan à tout moment ?', answer: 'Oui. La migration est effectuée sans interruption de service et la différence de prix est calculée au prorata.' },
      { question: 'La protection anti-DDoS est-elle incluse ?', answer: 'Oui, une protection anti-DDoS Stormwall & Gcore est appliquée sur toutes les IP de nos VPS.' },
    ],
    useCases: [
      'Déployer une application SaaS ou un site à fort trafic',
      'Faire tourner des bots Discord ou des automatisations 24/7',
      'Monter un VPN privé ou un reverse proxy Nginx',
      'Héberger une base PostgreSQL, MongoDB ou Redis',
      'Créer un environnement de dev / staging isolé',
    ],
  },

  // ─── Hébergement Web ───────────────────────────────────────────────
  {
    slug: 'plesk',
    category: 'Web',
    name: 'Hébergement Web',
    shortName: 'Web',
    description:
      'Hébergement web performant avec certificat SSL, panel Plesk et support 24/7. Idéal pour sites vitrines, blogs et e-commerce.',
    icon: 'Globe',
    heroTitle: 'Hébergement Web',
    heroDescription:
      'Un hébergement web rapide avec stockage SSD, certificat Let’s Encrypt et panel Plesk intuitif. Vos sites sont entre de bonnes mains.',
    plans: [
      { id: 'web-orbit', name: 'Orbit', price: 2.99, priceQuarterly: 8.99, priceYearly: 32.99, period: 'mois', orderUrl: `${O}/plesk/orbit`, features: ['1 domaine', '10 sous-domaines', '2 bases de données', '20 Go SSD', '10 comptes e-mail', 'Certificat Let’s Encrypt', 'Panel Plesk', 'Support 24/7'], specs: { ram: '1 domaine', cpu: '10 sous-domaines', storage: '20 Go SSD', bandwidth: '2 BDD' } },
      { id: 'web-pulsar', name: 'Pulsar', price: 4.99, priceQuarterly: 14.99, priceYearly: 54.99, period: 'mois', highlighted: true, badge: 'Populaire', orderUrl: `${O}/plesk/pulsar`, features: ['5 domaines', '50 sous-domaines', '10 bases de données', '40 Go SSD', '25 comptes e-mail', 'Certificat Let’s Encrypt', 'Panel Plesk', 'Support 24/7'], specs: { ram: '5 domaines', cpu: '50 sous-domaines', storage: '40 Go SSD', bandwidth: '10 BDD' } },
      { id: 'web-quasar', name: 'Quasar', price: 7.99, priceQuarterly: 22.99, priceYearly: 86.99, period: 'mois', orderUrl: `${O}/plesk/quasar`, features: ['25 domaines', '75 sous-domaines', '50 bases de données', '80 Go SSD', '100 comptes e-mail', 'Certificat Let’s Encrypt', 'Panel Plesk', 'Support VIP 24/7'], specs: { ram: '25 domaines', cpu: '75 sous-domaines', storage: '80 Go SSD', bandwidth: '50 BDD' } },
    ],
    faqs: [
      { question: 'Puis-je migrer mon site existant ?', answer: 'Oui, la migration est gratuite. Notre équipe transfère vos fichiers, bases de données et e-mails sans interruption de service.' },
      { question: 'Quel panneau de gestion est utilisé ?', answer: 'Plesk — un panneau complet et intuitif pour gérer fichiers, bases de données, e-mails et certificats SSL.' },
      { question: 'Le certificat SSL est-il vraiment gratuit ?', answer: 'Oui, chaque hébergement inclut un certificat SSL Let’s Encrypt gratuit, renouvelé automatiquement.' },
      { question: 'Puis-je installer WordPress facilement ?', answer: 'Oui, Plesk propose un installateur en un clic pour WordPress, Joomla, PrestaShop et bien d’autres.' },
      { question: 'Quelle est la disponibilité garantie ?', answer: 'Nous garantissons un taux de disponibilité de 99,9 %. En cas de non-respect, vous êtes éligible à un remboursement proportionnel (voir CGV).' },
    ],
    useCases: [
      'Sites vitrines et portfolios',
      'Blogs et sites éditoriaux',
      'Boutiques e-commerce (PrestaShop, WooCommerce)',
      'Sites associatifs et institutionnels',
    ],
  },

  // ─── VPS Windows ───────────────────────────────────────────────────
  {
    slug: 'vps-windows',
    category: 'Cloud',
    name: 'VPS Windows',
    shortName: 'VPS Windows',
    description:
      'Serveurs privés virtuels sous Windows Server avec accès Bureau à distance et licence incluse.',
    icon: 'MonitorSmartphone',
    comingSoon: true,
    heroTitle: 'VPS Windows',
    heroDescription:
      'Un VPS sous Windows Server avec accès RDP, licence incluse et anti-DDoS. Bientôt disponible.',
    plans: [
      { id: 'vps-windows-starter', name: 'Starter', price: 9.99, period: 'mois', features: ['4 Go RAM DDR4', '2 vCPU AMD EPYC', '40 Go SSD', 'Bande passante 500 Mbit/s', 'Licence Windows Server incluse', 'Accès RDP', '1 IPv4'], specs: { ram: '4 Go', cpu: '2 vCPU', storage: '40 Go SSD', bandwidth: '500 Mbit/s' } },
      { id: 'vps-windows-pro', name: 'Pro', price: 19.99, period: 'mois', highlighted: true, badge: 'Populaire', features: ['8 Go RAM DDR4', '4 vCPU AMD EPYC', '80 Go SSD', 'Bande passante 1 Gbit/s', 'Licence Windows Server incluse', 'Accès RDP', '1 IPv4', 'Sauvegardes hebdomadaires'], specs: { ram: '8 Go', cpu: '4 vCPU', storage: '80 Go SSD', bandwidth: '1 Gbit/s' } },
      { id: 'vps-windows-business', name: 'Business', price: 34.99, period: 'mois', features: ['16 Go RAM DDR4', '6 vCPU AMD EPYC', '160 Go SSD', 'Bande passante 2 Gbit/s', 'Licence Windows Server incluse', 'Accès RDP', '1 IPv4', 'Sauvegardes quotidiennes', 'Anti-DDoS avancé'], specs: { ram: '16 Go', cpu: '6 vCPU', storage: '160 Go SSD', bandwidth: '2 Gbit/s' } },
    ],
    faqs: [
      { question: 'La licence Windows Server est-elle incluse ?', answer: 'Oui, chaque VPS Windows inclut une licence Windows Server valide, sans surcoût.' },
      { question: 'Comment me connecter au serveur ?', answer: 'Via le Bureau à distance (RDP) avec l’identifiant Administrateur fourni à la livraison.' },
    ],
    useCases: ['Applications métier Windows', 'Bureau distant / poste de travail cloud', 'Automatisation et bots sous Windows'],
  },

  // ─── Bot Discord Node.js ───────────────────────────────────────────
  {
    slug: 'nodejs',
    category: 'Cloud',
    name: 'Bot Discord Node.js',
    shortName: 'Bot Node.js',
    description:
      'Hébergement optimisé pour vos bots Discord et applications Node.js. Uptime 24/7, panel Wisp et redémarrage automatique.',
    icon: 'Braces',
    heroTitle: 'Bot Discord Node.js',
    heroDescription:
      'Faites tourner votre bot Discord (discord.js) 24/7 sans coupure. Déploiement en quelques clics, panel Wisp, base de données et sauvegardes incluses.',
    plans: [
      { id: 'nodejs-pulse', name: 'Pulse', price: 1.99, priceQuarterly: 4.99, priceYearly: 18.99, period: 'mois', orderUrl: `${O}/node-js/pulse`, features: ['Intel Xeon E5-2650 v2', '1 vCore 2,60 GHz', '2 Go RAM', '10 Go SSD', '1 base de données', '1 sauvegarde', 'Panel Wisp', 'Support 24/7'], specs: { ram: '2 Go', cpu: '1 vCore 2,60 GHz', storage: '10 Go SSD', bandwidth: '1 BDD' } },
      { id: 'nodejs-cipher', name: 'Cipher', price: 3.99, priceQuarterly: 10.99, priceYearly: 39.99, period: 'mois', highlighted: true, badge: 'Populaire', orderUrl: `${O}/node-js/cipher`, features: ['Intel Xeon E5-2650 v2', '2 vCores 2,60 GHz', '4 Go RAM', '20 Go SSD', '2 bases de données', '1 sauvegarde', 'Panel Wisp', 'Support 24/7'], specs: { ram: '4 Go', cpu: '2 vCores 2,60 GHz', storage: '20 Go SSD', bandwidth: '2 BDD' } },
      { id: 'nodejs-flux', name: 'Flux', price: 7.99, priceQuarterly: 21.99, priceYearly: 79.99, period: 'mois', orderUrl: `${O}/node-js/flux`, features: ['Intel Xeon E5-2650 v2', '4 vCores 2,60 GHz', '8 Go RAM', '40 Go SSD', '3 bases de données', '2 sauvegardes', 'Panel Wisp', 'Support 24/7'], specs: { ram: '8 Go', cpu: '4 vCores 2,60 GHz', storage: '40 Go SSD', bandwidth: '3 BDD' } },
    ],
    faqs: [
      { question: 'discord.js est-il supporté ?', answer: 'Oui, discord.js et toute autre librairie Node.js (Eris, Discordeno…) fonctionnent parfaitement. Express, Fastify et NestJS sont également supportés pour vos APIs.' },
      { question: 'Mon bot redémarre-t-il automatiquement ?', answer: 'Oui, le panel Wisp relance automatiquement votre bot en cas de crash, et vous pouvez configurer un redémarrage planifié.' },
      { question: 'Puis-je utiliser npm ou yarn ?', answer: 'Les deux. Le système détecte votre gestionnaire via le lockfile (package-lock.json ou yarn.lock) et installe vos dépendances au déploiement.' },
      { question: 'Comment déployer mon bot ?', answer: 'Via SFTP ou directement depuis le panel Wisp. Un accès console en temps réel est disponible pour suivre les logs.' },
    ],
    useCases: [
      'Bot Discord communautaire (modération, musique, niveaux)',
      'Bot Discord avec base de données et tableau de bord web',
      'API REST ou GraphQL',
      'Application temps réel avec WebSocket',
    ],
  },

  // ─── Bot Discord Python ────────────────────────────────────────────
  {
    slug: 'python',
    category: 'Cloud',
    name: 'Bot Discord Python',
    shortName: 'Bot Python',
    description:
      'Hébergement optimisé pour vos bots Discord et applications Python. Uptime 24/7, panel Wisp et environnement isolé.',
    icon: 'Code',
    heroTitle: 'Bot Discord Python',
    heroDescription:
      'Faites tourner votre bot Discord (discord.py / Pycord) 24/7. Environnement isolé, installation des paquets via requirements.txt, panel Wisp inclus.',
    plans: [
      { id: 'python-viper', name: 'Viper', price: 1.99, priceQuarterly: 5.99, priceYearly: 19.99, period: 'mois', orderUrl: `${O}/python/viper`, features: ['Intel Xeon E5-2650 v2', '1 vCore 2,60 GHz', '2 Go RAM', '10 Go SSD', '1 base de données', '1 sauvegarde', 'Panel Wisp', 'Support 24/7'], specs: { ram: '2 Go', cpu: '1 vCore 2,60 GHz', storage: '10 Go SSD', bandwidth: '1 BDD' } },
      { id: 'python-mamba', name: 'Mamba', price: 3.99, priceQuarterly: 11.99, priceYearly: 39.99, period: 'mois', highlighted: true, badge: 'Populaire', orderUrl: `${O}/python/mamba`, features: ['Intel Xeon E5-2650 v2', '2 vCores 2,60 GHz', '4 Go RAM', '20 Go SSD', '2 bases de données', '1 sauvegarde', 'Panel Wisp', 'Support 24/7'], specs: { ram: '4 Go', cpu: '2 vCores 2,60 GHz', storage: '20 Go SSD', bandwidth: '2 BDD' } },
      { id: 'python-anaconda', name: 'Anaconda', price: 7.99, priceQuarterly: 22.99, priceYearly: 79.99, period: 'mois', orderUrl: `${O}/python/anaconda`, features: ['Intel Xeon E5-2650 v2', '4 vCores 2,60 GHz', '8 Go RAM', '40 Go SSD', '3 bases de données', '2 sauvegardes', 'Panel Wisp', 'Support 24/7'], specs: { ram: '8 Go', cpu: '4 vCores 2,60 GHz', storage: '40 Go SSD', bandwidth: '3 BDD' } },
    ],
    faqs: [
      { question: 'discord.py est-il supporté ?', answer: 'Oui, discord.py, Pycord, Nextcord et Hikari fonctionnent nativement. Django, Flask et FastAPI sont également disponibles pour vos APIs.' },
      { question: 'Puis-je installer mes propres paquets pip ?', answer: 'Oui, chaque application a son propre environnement. Ajoutez vos dépendances dans un fichier requirements.txt, elles sont installées au déploiement.' },
      { question: 'Mon bot tourne-t-il en continu ?', answer: 'Oui, 24h/24. Le panel Wisp relance automatiquement votre bot en cas d’erreur.' },
      { question: 'Quel panneau de gestion est utilisé ?', answer: 'Le panel Wisp — interface moderne pour gérer votre application, ses fichiers et ses bases de données.' },
    ],
    useCases: [
      'Bot Discord (modération, économie, mini-jeux)',
      'Bot Discord avec IA / API externes',
      'API REST avec FastAPI ou Django REST Framework',
      'Scripts d’automatisation et de data',
    ],
  },

  // ─── Noms de domaine ──────────────────────────────────────────────
  {
    slug: 'domaines',
    category: 'Web',
    name: 'Noms de domaine',
    shortName: 'Domaines',
    description:
      'Réservez et gérez vos noms de domaine directement chez LKLCloud. DNS rapide, e-mail et redirections inclus.',
    icon: 'Link',
    comingSoon: true,
    heroTitle: 'Noms de domaine',
    heroDescription:
      'Bientôt : réservez vos .fr, .com, .io et gérez vos DNS depuis le même espace que vos serveurs.',
    plans: [],
    faqs: [
      { question: 'Quand les noms de domaine seront-ils disponibles ?', answer: 'Nous finalisons l’intégration. Laissez-nous votre e-mail pour être prévenu au lancement.' },
    ],
    useCases: ['Réserver un domaine pour votre site', 'Gérer vos DNS au même endroit que vos serveurs', 'Redirections et sous-domaines'],
  },
]

export function getProductBySlug(slug: string): ProductCategory | undefined {
  return productCategories.find((p) => p.slug === slug)
}
