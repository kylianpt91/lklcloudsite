export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string // URL to photo
  socials?: { twitter?: string; linkedin?: string; github?: string }
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Kylian T.',
    role: 'Fondateur & Président',
    bio: 'Kylian gère seul LKLCloud au quotidien : relation client, infrastructure et développement du service.',
    avatar: 'https://lklcloud.fr/images/team/kylian.jpeg',
  },
]
