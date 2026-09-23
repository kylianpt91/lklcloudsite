import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shield, Globe, Archive, Zap, Server, Headphones, ShoppingCart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

interface AddOn {
  id: string
  name: string
  price: number
  icon: LucideIcon
  description: string
}

const addOns: AddOn[] = [
  { id: 'ssl-premium', name: 'SSL Premium', price: 2, icon: Shield, description: 'Certificat SSL EV ou Wildcard' },
  { id: 'ip-dediee', name: 'IP Dediee', price: 3, icon: Globe, description: 'Adresse IPv4 dediee a votre serveur' },
  { id: 'backups-plus', name: 'Sauvegardes +', price: 1, icon: Archive, description: 'Sauvegardes horaires avec retention 30j' },
  { id: 'ddos-plus', name: 'Protection DDoS +', price: 5, icon: Zap, description: 'Protection DDoS avancee avec mitigation' },
  { id: 'cdn-premium', name: 'CDN Premium', price: 4, icon: Server, description: 'CDN mondial avec 150+ points de presence' },
  { id: 'support-prioritaire', name: 'Support Prioritaire', price: 10, icon: Headphones, description: 'Support prioritaire par telephone et chat' },
]

export default function AddOnsMarketplace() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const total = useMemo(() => {
    return addOns
      .filter((a) => selected.has(a.id))
      .reduce((sum, a) => sum + a.price, 0)
  }, [selected])

  return (
    <Card variant="glass" className="p-8">
      <h3 className="text-lg font-bold text-neutral-dark mb-2">Options supplementaires</h3>
      <p className="text-sm text-neutral-medium mb-6">Personnalisez votre hebergement avec nos add-ons</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {addOns.map((addon) => {
          const Icon = addon.icon
          const isActive = selected.has(addon.id)

          return (
            <motion.button
              key={addon.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(addon.id)}
              className={[
                'flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                isActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-neutral-gray/30 hover:border-neutral-gray/60',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-neutral-medium'}`} />
                <div className={[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  isActive ? 'border-primary bg-primary' : 'border-neutral-gray',
                ].join(' ')}>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-dark">{addon.name}</span>
              <span className="text-xs text-neutral-medium mt-1 flex-1">{addon.description}</span>
              <span className={[
                'text-sm font-bold mt-2',
                isActive ? 'text-primary' : 'text-neutral-dark',
              ].join(' ')}>
                +{addon.price.toLocaleString('fr-FR')}€/mois
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-neutral-gray/30 flex items-center justify-between">
        <div>
          <span className="text-sm text-neutral-medium">Total add-ons</span>
          <div className="flex items-baseline gap-1">
            <motion.span
              key={total}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="text-2xl font-extrabold text-neutral-dark"
            >
              +{total.toLocaleString('fr-FR')}€
            </motion.span>
            <span className="text-sm text-neutral-medium">/mois</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={selected.size === 0}
          icon={<ShoppingCart className="w-4 h-4" />}
        >
          Ajouter ({selected.size})
        </Button>
      </div>
    </Card>
  )
}
