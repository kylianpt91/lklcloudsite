import PricingCard from '@/components/ui/PricingCard'

interface OffrePreviewProps {
  nom: string
  prix: { mensuel?: number; trimestriel?: number; annuel?: number }
  features: string[]
  specs: { ram: string; cpu: string; storage: string; bandwidth: string }
  badge?: string
  misEnAvant?: boolean
}

export function OffrePreview({ nom, prix, features, specs, badge, misEnAvant }: OffrePreviewProps) {
  return (
    <div className="p-6 bg-neutral-lightest min-h-[200px]">
      <div className="max-w-sm mx-auto">
        <PricingCard
          plan={nom || 'Nom de l\'offre'}
          price={prix.mensuel ?? 0}
          priceQuarterly={(prix.trimestriel ?? 0) > 0 ? prix.trimestriel : undefined}
          priceYearly={(prix.annuel ?? 0) > 0 ? prix.annuel : undefined}
          period="mois"
          features={features.length > 0 ? features : ['Fonctionnalité 1', 'Fonctionnalité 2']}
          specs={{
            ram: specs.ram || '—',
            cpu: specs.cpu || '—',
            storage: specs.storage || '—',
            bandwidth: specs.bandwidth || '—',
          }}
          badge={badge || undefined}
          highlighted={misEnAvant}
          ctaText="Commander"
          ctaLink="#"
        />
      </div>
    </div>
  )
}
