import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Users, HardDrive, Mail, Calculator, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'

interface PriceCalculatorProps {
  className?: string
}

interface InputConfig {
  key: string
  label: string
  icon: typeof Globe
  min: number
  max: number
  step: number
  unit: string
  defaultValue: number
}

const inputs: InputConfig[] = [
  { key: 'sites', label: 'Nombre de sites', icon: Globe, min: 1, max: 50, step: 1, unit: 'site(s)', defaultValue: 1 },
  { key: 'traffic', label: 'Trafic mensuel', icon: Users, min: 100, max: 1000000, step: 100, unit: 'visiteurs', defaultValue: 1000 },
  { key: 'storage', label: 'Stockage necessaire', icon: HardDrive, min: 1, max: 250, step: 1, unit: 'Go', defaultValue: 10 },
  { key: 'emails', label: "Comptes e-mail", icon: Mail, min: 0, max: 100, step: 1, unit: 'compte(s)', defaultValue: 1 },
]

interface Recommendation {
  plan: string
  price: number
  reason: string
}

function getRecommendation(values: Record<string, number>): Recommendation {
  const { sites, traffic, storage, emails } = values

  if (sites > 10 || traffic > 100000 || storage > 100 || emails > 50) {
    return {
      plan: 'Enterprise',
      price: 24.99,
      reason: 'Vos besoins importants necessitent un plan Enterprise pour des performances optimales.',
    }
  }

  if (sites > 5 || traffic > 50000 || storage > 50 || emails > 10) {
    return {
      plan: 'Business',
      price: 11.99,
      reason: 'Le plan Business offre les ressources adaptees a votre croissance.',
    }
  }

  if (sites > 1 || traffic > 10000 || storage > 20 || emails > 5) {
    return {
      plan: 'Pro',
      price: 5.99,
      reason: 'Le plan Pro est le choix ideal pour votre activite.',
    }
  }

  return {
    plan: 'Starter',
    price: 2.99,
    reason: "Le plan Starter est parfait pour demarrer votre projet en ligne.",
  }
}

function formatTraffic(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toLocaleString('fr-FR')}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString('fr-FR')}k`
  }
  return value.toLocaleString('fr-FR')
}

export default function PriceCalculator({ className = '' }: PriceCalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>({
    sites: 1,
    traffic: 1000,
    storage: 10,
    emails: 1,
  })
  const [showResult, setShowResult] = useState(false)

  const recommendation = useMemo(() => getRecommendation(values), [values])

  const handleChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setShowResult(false)
  }

  return (
    <Card variant="glass" className={`p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-dark">Estimez votre cout</h3>
          <p className="text-xs text-neutral-medium">Calculez le plan adapte a vos besoins</p>
        </div>
      </div>

      <div className="space-y-6">
        {inputs.map((input) => {
          const Icon = input.icon
          const currentValue = values[input.key]

          return (
            <div key={input.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-dark">{input.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {input.key === 'traffic'
                    ? `${formatTraffic(currentValue)} ${input.unit}`
                    : `${currentValue} ${input.unit}`}
                </span>
              </div>
              <input
                type="range"
                min={input.min}
                max={input.max}
                step={input.step}
                value={currentValue}
                onChange={(e) => handleChange(input.key, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-light accent-primary"
                aria-label={input.label}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-neutral-medium">
                  {input.key === 'traffic' ? formatTraffic(input.min) : input.min}
                </span>
                <span className="text-[10px] text-neutral-medium">
                  {input.key === 'traffic' ? formatTraffic(input.max) : input.max}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setShowResult(true)}
        className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98] cursor-pointer"
      >
        Calculer
        <ChevronRight className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 border border-primary/20">
              <p className="text-sm text-neutral-dark leading-relaxed mb-4">
                {recommendation.reason}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-medium">Nous recommandons</span>
                  <p className="text-lg font-bold text-neutral-dark">Plan {recommendation.plan}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-primary">
                    {recommendation.price.toLocaleString('fr-FR')}€
                  </span>
                  <span className="text-xs text-neutral-medium">/mois</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
