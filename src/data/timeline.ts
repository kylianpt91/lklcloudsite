export interface TimelineEvent {
  year: string
  title: string
  description: string
}

export const companyTimeline: TimelineEvent[] = [
  { year: '2024', title: 'Naissance du projet', description: 'L\'idée de LKL Cloud naît : créer un hébergeur français performant, transparent et accessible.' },
  { year: '2025', title: 'Construction de l\'infrastructure', description: 'Mise en place des serveurs, choix des datacenters parisiens et développement de la plateforme.' },
  { year: '2026', title: 'Lancement officiel', description: 'LKL Cloud ouvre ses portes avec une gamme complète : hébergement web, VPS, serveurs de jeux et support réactif.' },
]
