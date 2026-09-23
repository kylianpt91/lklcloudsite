export interface PricingPlan {
  id: string
  name: string
  price: number
  priceQuarterly?: number
  priceYearly?: number
  period: 'mois' | 'an'
  features: string[]
  highlighted?: boolean
  badge?: string
  orderUrl?: string
  specs: {
    ram: string
    cpu: string
    storage: string
    bandwidth: string
  }
  originalPrice?: number
  originalPriceQuarterly?: number
  originalPriceYearly?: number
  promoPercent?: number
}

export interface ProductCategory {
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  heroTitle: string
  heroDescription: string
  plans: PricingPlan[]
  faqs: FAQ[]
  useCases: string[]
  category: string
  comingSoon?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  service: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
  comingSoon?: boolean
}
