import type { NavItem } from '@/types'

export const mainNavigation: NavItem[] = [
  {
    label: 'Accueil',
    href: '/',
  },
  {
    label: 'Cloud',
    href: '#',
    children: [
      { label: 'VPS KVM Linux', href: '/produits/vps-linux' },
      { label: 'Hébergement Web', href: '/produits/plesk' },
      { label: 'VPS Windows', href: '/produits/vps-windows', comingSoon: true },
    ],
  },
  {
    label: 'Bots Discord',
    href: '#',
    children: [
      { label: 'Bot Discord Node.js', href: '/produits/nodejs' },
      { label: 'Bot Discord Python', href: '/produits/python' },
    ],
  },
  {
    label: 'Domaines',
    href: '/coming-soon',
    comingSoon: true,
  },
  {
    label: 'Contact',
    href: 'mailto:support@lklcloud.fr',
  },
]

/**
 * Product navigation items organized by group for use in mega-menu dropdowns.
 */
export const productGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Cloud',
    items: [
      { label: 'VPS KVM Linux', href: '/produits/vps-linux' },
      { label: 'Hébergement Web', href: '/produits/plesk' },
      { label: 'VPS Windows', href: '/coming-soon', comingSoon: true },
    ],
  },
  {
    label: 'Bots Discord',
    items: [
      { label: 'Bot Discord Node.js', href: '/produits/nodejs' },
      { label: 'Bot Discord Python', href: '/produits/python' },
    ],
  },
  {
    label: 'Domaines',
    items: [{ label: 'Noms de domaine', href: '/coming-soon', comingSoon: true }],
  },
]
