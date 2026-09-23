import type { ReactNode } from 'react'
import { Cpu, HardDrive, Wifi, Check, MemoryStick, Database, Globe, Network } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

interface PricingCardProps {
  plan: string
  price: number
  priceQuarterly?: number
  priceYearly?: number
  period: 'mois' | 'an'
  features: string[]
  highlighted?: boolean
  badge?: string
  specs: { ram: string; cpu: string; storage: string; bandwidth: string }
  ctaText?: string
  ctaLink?: string
  originalPrice?: number
  originalPriceQuarterly?: number
  originalPriceYearly?: number
  promoPercent?: number
}

export default function PricingCard({
  plan,
  price,
  priceQuarterly,
  priceYearly,
  period,
  features,
  highlighted = false,
  badge,
  specs,
  ctaText = 'Commander',
  ctaLink = 'https://client.lklcloud.fr/register.php',
  originalPrice,
  originalPriceQuarterly,
  originalPriceYearly,
  promoPercent,
}: PricingCardProps) {
  const isBdd = specs.bandwidth.includes('BDD') || specs.bandwidth.includes('base')
  const isDomainRam = specs.ram.includes('domaine')
  const isSubdomainCpu = specs.cpu.includes('sous-domaine')

  const ramIcon = isDomainRam ? <Globe className="w-4 h-4" /> : <MemoryStick className="w-4 h-4" />
  const cpuIcon = isSubdomainCpu ? <Network className="w-4 h-4" /> : <Cpu className="w-4 h-4" />
  const bandwidthIcon = isBdd ? <Database className="w-4 h-4" /> : <Wifi className="w-4 h-4" />

  return (
    <div
      className={[
        'relative h-full',
        highlighted ? 'z-10' : '',
      ].join(' ')}
    >
      {badge && (
        <div className="absolute -top-3 left-6 z-20">
          <span className="inline-block bg-primary text-white text-[11px] font-semibold px-3 py-1 rounded-lg">
            {badge}
          </span>
        </div>
      )}

      <Card
        variant="default"
        className={[
          'p-5 sm:p-6 lg:p-8 h-full flex flex-col',
          highlighted ? '!border-neutral-dark border-2' : '',
        ].join(' ')}
      >
        {/* Plan name */}
        <h3 className="text-lg font-semibold text-neutral-dark">{plan}</h3>

        {/* Price */}
        <div className="mt-3">
          <p className="text-xs text-neutral-medium mb-1">À partir de</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-neutral-dark">
              {price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
            </span>
            <span className="text-neutral-medium text-sm">/{period}</span>
          </div>
          {originalPrice != null && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-neutral-medium line-through">
                {originalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€/{period}
              </span>
              {promoPercent != null && (
                <span className="inline-block text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-2 py-0.5 rounded-full">
                  -{promoPercent}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quarterly / Yearly prices */}
        {(priceQuarterly || priceYearly) && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {priceQuarterly && (
              <span className="text-xs text-neutral-medium">
                {originalPriceQuarterly != null && (
                  <span className="line-through mr-1">
                    {originalPriceQuarterly.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                  </span>
                )}
                {priceQuarterly.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€/trimestre
              </span>
            )}
            {priceYearly && (
              <span className="text-xs text-neutral-medium">
                {originalPriceYearly != null && (
                  <span className="line-through mr-1">
                    {originalPriceYearly.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                  </span>
                )}
                {priceYearly.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€/an
              </span>
            )}
          </div>
        )}

        {/* Specs grid */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
          <SpecItem icon={cpuIcon} label={specs.cpu} />
          <SpecItem icon={ramIcon} label={specs.ram} />
          <SpecItem icon={<HardDrive className="w-4 h-4" />} label={specs.storage} />
          <SpecItem icon={bandwidthIcon} label={specs.bandwidth} />
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 border-t border-line" />

        {/* Features */}
        <ul className="flex-1 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-neutral-medium">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-6 sm:pt-8">
          <Button
            variant={highlighted ? 'primary' : 'outline'}
            size="md"
            href={ctaLink}
            className="w-full"
          >
            {ctaText}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function SpecItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-neutral-dark/[0.04] px-2.5 py-2 sm:px-3">
      <span className="text-neutral-dark/50 shrink-0">{icon}</span>
      <span className="text-[11px] sm:text-xs font-medium text-neutral-dark leading-tight">{label}</span>
    </div>
  )
}
