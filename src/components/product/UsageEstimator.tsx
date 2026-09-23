import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ShoppingCart, Code, Server, Users, Database, Shield, Archive, Zap, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

type ProjectType = 'vitrine' | 'ecommerce' | 'application' | 'api'

interface StepData {
  projectType: ProjectType | null
  visitors: number
  options: string[]
}

const projectTypes: { id: ProjectType; label: string; icon: typeof Globe; description: string }[] = [
  { id: 'vitrine', label: 'Site vitrine', icon: Globe, description: 'Site de presentation, portfolio' },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, description: 'Boutique en ligne' },
  { id: 'application', label: 'Application', icon: Code, description: 'Application web complexe' },
  { id: 'api', label: 'API', icon: Server, description: 'API REST ou GraphQL' },
]

const additionalOptions = [
  { id: 'database', label: 'Base de donnees', icon: Database },
  { id: 'ssl', label: 'SSL', icon: Shield },
  { id: 'backups', label: 'Sauvegardes', icon: Archive },
  { id: 'cdn', label: 'CDN', icon: Zap },
]

interface Recommendation {
  product: string
  plan: string
  price: number
  slug: string
}

function getRecommendation(data: StepData): Recommendation {
  const { projectType, visitors, options } = data
  const hasComplexNeeds = options.length >= 3

  if (projectType === 'api' || projectType === 'application') {
    if (visitors > 100000 || hasComplexNeeds) {
      return { product: 'VPS Linux', plan: 'Business', price: 19.99, slug: 'vps-linux' }
    }
    if (visitors > 10000) {
      return { product: 'VPS Linux', plan: 'Pro', price: 9.99, slug: 'vps-linux' }
    }
    return { product: 'VPS Linux', plan: 'Starter', price: 4.99, slug: 'vps-linux' }
  }

  if (projectType === 'ecommerce') {
    if (visitors > 100000 || hasComplexNeeds) {
      return { product: 'Hebergement Web', plan: 'Enterprise', price: 24.99, slug: 'plesk' }
    }
    if (visitors > 10000) {
      return { product: 'Hebergement Web', plan: 'Business', price: 11.99, slug: 'plesk' }
    }
    return { product: 'Hebergement Web', plan: 'Pro', price: 5.99, slug: 'plesk' }
  }

  // vitrine
  if (visitors > 50000 || hasComplexNeeds) {
    return { product: 'Hebergement Web', plan: 'Business', price: 11.99, slug: 'plesk' }
  }
  if (visitors > 5000) {
    return { product: 'Hebergement Web', plan: 'Pro', price: 5.99, slug: 'plesk' }
  }
  return { product: 'Hebergement Web', plan: 'Starter', price: 2.99, slug: 'plesk' }
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
}

export default function UsageEstimator() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<StepData>({
    projectType: null,
    visitors: 1000,
    options: [],
  })

  const totalSteps = 4
  const progressPercentage = ((step + 1) / totalSteps) * 100

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const canProceed = step === 0 ? data.projectType !== null : true
  const recommendation = getRecommendation(data)

  function formatVisitors(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
    return value.toString()
  }

  const visitorSteps = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]

  function findClosestStep(value: number): number {
    let closest = visitorSteps[0]
    let minDiff = Math.abs(value - closest)
    for (const step of visitorSteps) {
      const diff = Math.abs(value - step)
      if (diff < minDiff) {
        minDiff = diff
        closest = step
      }
    }
    return closest
  }

  return (
    <Card variant="glass" className="p-8 max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-light rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />
      </div>

      <div className="min-h-[320px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
            >
              <h3 className="text-lg font-bold text-neutral-dark mb-2">Quel type de projet ?</h3>
              <p className="text-sm text-neutral-medium mb-6">Selectionnez le type de projet que vous souhaitez heberger</p>

              <div className="grid grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = data.projectType === type.id
                  return (
                    <motion.button
                      key={type.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setData((prev) => ({ ...prev, projectType: type.id }))}
                      className={[
                        'p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-neutral-gray/30 hover:border-neutral-gray/60',
                      ].join(' ')}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-neutral-medium'}`} />
                      <div className="text-sm font-semibold text-neutral-dark">{type.label}</div>
                      <div className="text-xs text-neutral-medium mt-0.5">{type.description}</div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
            >
              <h3 className="text-lg font-bold text-neutral-dark mb-2">Combien de visiteurs par mois ?</h3>
              <p className="text-sm text-neutral-medium mb-8">Estimez le trafic mensuel attendu</p>

              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-extrabold text-neutral-dark">
                    {formatVisitors(data.visitors)}
                  </span>
                  <span className="text-sm text-neutral-medium">visiteurs/mois</span>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={visitorSteps.length - 1}
                step={1}
                value={visitorSteps.indexOf(findClosestStep(data.visitors))}
                onChange={(e) => {
                  const idx = Number(e.target.value)
                  setData((prev) => ({ ...prev, visitors: visitorSteps[idx] }))
                }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-light accent-primary"
                aria-label="Nombre de visiteurs par mois"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-neutral-medium">100</span>
                <span className="text-xs text-neutral-medium">1M</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
            >
              <h3 className="text-lg font-bold text-neutral-dark mb-2">Avez-vous besoin de ?</h3>
              <p className="text-sm text-neutral-medium mb-6">Selectionnez les options dont vous avez besoin</p>

              <div className="space-y-3">
                {additionalOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = data.options.includes(option.id)
                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          options: isSelected
                            ? prev.options.filter((o) => o !== option.id)
                            : [...prev.options, option.id],
                        }))
                      }}
                      className={[
                        'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-gray/30 hover:border-neutral-gray/60',
                      ].join(' ')}
                    >
                      <div className={[
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                        isSelected ? 'border-primary bg-primary' : 'border-neutral-gray',
                      ].join(' ')}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-neutral-medium'}`} />
                      <span className="text-sm font-medium text-neutral-dark">{option.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
            >
              <h3 className="text-lg font-bold text-neutral-dark mb-2">Notre recommandation</h3>
              <p className="text-sm text-neutral-medium mb-6">Voici le plan ideal pour votre projet</p>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
                className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 border border-primary/20"
              >
                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                  Recommandation
                </div>
                <div className="text-xl font-bold text-neutral-dark mb-1">
                  {recommendation.product}
                </div>
                <div className="text-sm text-neutral-medium mb-4">
                  Plan {recommendation.plan}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-primary">
                    {recommendation.price.toLocaleString('fr-FR')}€
                  </span>
                  <span className="text-sm text-neutral-medium">/mois</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  href={`/products/${recommendation.slug}`}
                  className="w-full"
                >
                  Voir les offres {recommendation.product}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="flex items-center gap-1 text-sm font-medium text-neutral-medium hover:text-neutral-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Precedent
        </button>

        {step < totalSteps - 1 && (
          <Button
            variant="primary"
            size="sm"
            onClick={goNext}
            disabled={!canProceed}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        )}
      </div>
    </Card>
  )
}
