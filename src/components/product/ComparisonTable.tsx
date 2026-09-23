import { motion } from 'framer-motion'
import { Cpu, MemoryStick, HardDrive, Wifi, Database, Globe, Network } from 'lucide-react'
import type { PricingPlan } from '@/types/index.ts'
import Card from '@/components/ui/Card.tsx'

interface ComparisonTableProps {
  plans: PricingPlan[]
}

export default function ComparisonTable({ plans }: ComparisonTableProps) {
  const isBdd = plans.some(p => p.specs.bandwidth.includes('BDD') || p.specs.bandwidth.includes('base'))
  const isDomainRam = plans.some(p => p.specs.ram.includes('domaine'))
  const isSubdomainCpu = plans.some(p => p.specs.cpu.includes('sous-domaine'))

  const specRows: { key: keyof PricingPlan['specs']; label: string; icon: typeof Cpu }[] = [
    { key: 'ram', label: isDomainRam ? 'Domaines' : 'RAM', icon: isDomainRam ? Globe : MemoryStick },
    { key: 'cpu', label: isSubdomainCpu ? 'Sous-domaines' : 'CPU', icon: isSubdomainCpu ? Network : Cpu },
    { key: 'storage', label: 'Stockage', icon: HardDrive },
    { key: 'bandwidth', label: isBdd ? 'Bases de données' : 'Bande passante', icon: isBdd ? Database : Wifi },
  ]

  return (
    <Card variant="glass" className="p-0 overflow-hidden">
      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="w-full min-w-[640px]">
          {/* Sticky header */}
          <thead>
            <tr className="sticky top-0 z-10 bg-paper">
              <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-neutral-dark border-b border-line min-w-[140px] sm:min-w-[180px]">
                Fonctionnalité
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  className={[
                    'p-3 sm:p-4 text-center text-xs sm:text-sm font-semibold border-b min-w-[120px] sm:min-w-[150px]',
                    plan.highlighted
                      ? 'bg-neutral-dark/[0.04] border-line text-neutral-dark'
                      : 'text-neutral-dark border-line',
                  ].join(' ')}
                >
                  <div className="flex flex-col items-center gap-1">
                    {plan.badge && (
                      <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-semibold">
                        {plan.badge}
                      </span>
                    )}
                    <span>{plan.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Specs section */}
            <tr>
              <td
                colSpan={plans.length + 1}
                className="px-3 sm:px-4 pt-6 pb-2 text-xs font-bold text-neutral-medium uppercase tracking-wider"
              >
                Spécifications
              </td>
            </tr>

            {specRows.map((spec) => {
              const Icon = spec.icon
              return (
                <motion.tr
                  key={spec.key}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                  className="border-b border-line hover:bg-neutral-dark/[0.02] transition-colors"
                >
                  <td className="p-3 sm:p-4 text-sm text-neutral-dark">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{spec.label}</span>
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className={[
                        'p-3 sm:p-4 text-center text-xs sm:text-sm',
                        plan.highlighted ? 'bg-neutral-dark/[0.03] font-semibold text-neutral-dark' : 'text-neutral-medium',
                      ].join(' ')}
                    >
                      {plan.specs[spec.key]}
                    </td>
                  ))}
                </motion.tr>
              )
            })}

            {/* Price row */}
            <tr className="bg-neutral-dark/[0.03]">
              <td className="p-3 sm:p-4 text-sm font-bold text-neutral-dark">Prix</td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={[
                    'p-3 sm:p-4 text-center',
                    plan.highlighted ? 'bg-neutral-dark/[0.05]' : '',
                  ].join(' ')}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] text-neutral-medium">À partir de</span>
                    {plan.originalPrice != null && (
                      <span className="text-sm text-neutral-medium line-through">
                        {plan.originalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                      </span>
                    )}
                    <span className={[
                      'text-xl sm:text-2xl font-extrabold',
                      plan.highlighted ? 'text-primary' : 'text-neutral-dark',
                    ].join(' ')}>
                      {plan.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                    </span>
                    <span className="text-xs text-neutral-medium">/{plan.period}</span>
                    {plan.promoPercent != null && (
                      <span className="inline-block text-[10px] font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-1.5 py-0.5 rounded mt-0.5">
                        -{plan.promoPercent}%
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* CTA row */}
            <tr>
              <td className="p-3 sm:p-4" />
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={[
                    'p-3 sm:p-4 text-center',
                    plan.highlighted ? 'bg-neutral-dark/[0.03]' : '',
                  ].join(' ')}
                >
                  <a
                    href={plan.orderUrl ?? 'https://client.lklcloud.fr/register.php'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      'inline-block px-5 py-2 text-xs font-semibold rounded-xl transition-colors duration-300',
                      plan.highlighted
                        ? 'bg-neutral-dark text-white hover:bg-primary'
                        : 'border border-neutral-dark/15 text-neutral-dark hover:border-neutral-dark/40',
                    ].join(' ')}
                  >
                    Commander
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
