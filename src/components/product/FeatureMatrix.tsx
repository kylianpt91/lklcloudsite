import { motion } from 'framer-motion'
import { Check, Minus, X } from 'lucide-react'
import type { ProductCategory } from '@/types/index.ts'
import Card from '@/components/ui/Card.tsx'

interface FeatureMatrixProps {
  categories: ProductCategory[]
}

interface FeatureRow {
  label: string
  key: string
}

const commonFeatures: FeatureRow[] = [
  { label: 'Certificat SSL gratuit', key: 'ssl' },
  { label: 'Protection DDoS', key: 'ddos' },
  { label: 'Sauvegardes automatiques', key: 'backups' },
  { label: 'Support technique', key: 'support' },
  { label: 'SSD', key: 'nvme' },
  { label: 'Panel de gestion', key: 'panel' },
  { label: 'Bande passante illimitee', key: 'bandwidth' },
  { label: 'IPv4 dediee', key: 'ipv4' },
  { label: 'Deploiement Git', key: 'git' },
  { label: 'Base de donnees', key: 'database' },
  { label: 'Acces root / admin', key: 'root' },
  { label: 'CDN inclus', key: 'cdn' },
]

type FeatureStatus = 'full' | 'partial' | 'none'

function getFeatureStatus(category: ProductCategory, featureKey: string): FeatureStatus {
  const allFeatures = category.plans.flatMap((p) => p.features).join(' ').toLowerCase()
  const allSpecs = category.plans.flatMap((p) => Object.values(p.specs)).join(' ').toLowerCase()
  const combined = `${allFeatures} ${allSpecs}`

  const featureMap: Record<string, { full: string[]; partial: string[] }> = {
    ssl: { full: ['ssl'], partial: [] },
    ddos: { full: ['anti-ddos avancée', 'anti-ddos gaming'], partial: ['anti-ddos', 'ddos'] },
    backups: { full: ['quotidiennes', 'sauvegardes automatiques'], partial: ['hebdomadaires', 'sauvegardes'] },
    support: { full: ['support prioritaire'], partial: ['support'] },
    nvme: { full: ['nvme'], partial: ['ssd'] },
    panel: { full: ['panel', 'cpanel', 'pterodactyl', 'txadmin'], partial: [] },
    bandwidth: { full: ['illimité', 'illimitée'], partial: ['gbit', 'mbit'] },
    ipv4: { full: ['ipv4', 'ip dédiée'], partial: [] },
    git: { full: ['déploiement git', 'git'], partial: [] },
    database: { full: ['mysql', 'postgresql', 'mongodb', 'base de données'], partial: [] },
    root: { full: ['root complet', 'administrateur complet'], partial: ['root', 'admin'] },
    cdn: { full: ['cdn inclus'], partial: ['cdn'] },
  }

  const config = featureMap[featureKey]
  if (!config) return 'none'

  if (config.full.some((keyword) => combined.includes(keyword))) return 'full'
  if (config.partial.some((keyword) => combined.includes(keyword))) return 'partial'
  return 'none'
}

function StatusIcon({ status }: { status: FeatureStatus }) {
  switch (status) {
    case 'full':
      return <Check className="w-5 h-5 text-primary mx-auto" />
    case 'partial':
      return <Minus className="w-5 h-5 text-amber-500 mx-auto" />
    case 'none':
      return <X className="w-5 h-5 text-neutral-gray mx-auto" />
  }
}

export default function FeatureMatrix({ categories }: FeatureMatrixProps) {
  return (
    <Card variant="glass" className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-white/90 backdrop-blur-sm">
              <th className="sticky left-0 z-20 bg-white/95 backdrop-blur-sm text-left p-4 text-sm font-semibold text-neutral-dark border-b border-neutral-gray/30 min-w-[200px]">
                Fonctionnalite
              </th>
              {categories.map((category) => (
                <th
                  key={category.slug}
                  className="p-4 text-center text-sm font-semibold text-neutral-dark border-b border-neutral-gray/30 min-w-[130px]"
                >
                  {category.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commonFeatures.map((feature, index) => (
              <motion.tr
                key={feature.key}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' as const }}
                className="border-b border-neutral-gray/20 hover:bg-neutral-light/30 transition-colors"
              >
                <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm p-4 text-sm font-medium text-neutral-dark">
                  {feature.label}
                </td>
                {categories.map((category) => (
                  <td key={category.slug} className="p-4 text-center">
                    <StatusIcon status={getFeatureStatus(category, feature.key)} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-neutral-gray/20 flex items-center gap-6 justify-center">
        <div className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-xs text-neutral-medium">Inclus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Minus className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-neutral-medium">Partiel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <X className="w-4 h-4 text-neutral-gray" />
          <span className="text-xs text-neutral-medium">Non disponible</span>
        </div>
      </div>
    </Card>
  )
}
