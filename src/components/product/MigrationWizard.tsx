import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Server, Files, Database, Mail, Globe, HardDrive, Clock, PartyPopper } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'
import ProgressSteps from '@/components/ui/ProgressSteps.tsx'

interface MigrationData {
  provider: string
  migrateItems: string[]
  sizeIndex: number
}

const stepLabels = ['Fournisseur', 'Contenu', 'Taille', 'Resultat']

const providers = [
  'OVH', 'Ionos', 'Hostinger', 'Infomaniak', 'PlanetHoster', 'o2switch', 'Autre',
]

const migrateOptions = [
  { id: 'files', label: 'Fichiers', icon: Files },
  { id: 'database', label: 'Base de donnees', icon: Database },
  { id: 'emails', label: 'E-mails', icon: Mail },
  { id: 'dns', label: 'DNS', icon: Globe },
]

const sizeLabels = ['< 1 Go', '1-5 Go', '5-10 Go', '10-25 Go', '25-50 Go', '50-100 Go', '100 Go+']
const sizeEstimates = ['~15 min', '~30 min', '~1h', '~2h', '~4h', '~8h', '~12-24h']

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

export default function MigrationWizard() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<MigrationData>({
    provider: '',
    migrateItems: [],
    sizeIndex: 0,
  })

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, 3))
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const canProceed = (): boolean => {
    if (step === 0) return data.provider !== ''
    if (step === 1) return data.migrateItems.length > 0
    return true
  }

  return (
    <Card variant="glass" className="p-8 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-neutral-dark mb-6">
        Estimez votre migration
      </h3>

      <ProgressSteps steps={stepLabels} currentStep={step} className="mb-12" />

      <div className="min-h-[300px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 0: Provider */}
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
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-semibold text-neutral-dark">Votre fournisseur actuel</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setData((prev) => ({ ...prev, provider }))}
                    className={[
                      'p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                      data.provider === provider
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-neutral-gray/30 text-neutral-dark hover:border-neutral-gray/60',
                    ].join(' ')}
                  >
                    {provider}
                  </button>
                ))}
              </div>
              {data.provider === 'Autre' && (
                <input
                  type="text"
                  placeholder="Nom du fournisseur"
                  className="mt-3 w-full p-3 rounded-xl border border-neutral-gray/30 text-sm focus:outline-none focus:border-primary transition-colors"
                  onChange={(e) => setData((prev) => ({ ...prev, provider: e.target.value || 'Autre' }))}
                />
              )}
            </motion.div>
          )}

          {/* Step 1: What to migrate */}
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
              <h4 className="text-sm font-semibold text-neutral-dark mb-4">Que souhaitez-vous migrer ?</h4>
              <div className="space-y-3">
                {migrateOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = data.migrateItems.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          migrateItems: isSelected
                            ? prev.migrateItems.filter((i) => i !== option.id)
                            : [...prev.migrateItems, option.id],
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
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Size estimation */}
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
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-semibold text-neutral-dark">Taille estimee de votre site</h4>
              </div>

              <div className="text-center mb-6">
                <span className="text-2xl font-extrabold text-neutral-dark">
                  {sizeLabels[data.sizeIndex]}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={sizeLabels.length - 1}
                step={1}
                value={data.sizeIndex}
                onChange={(e) => setData((prev) => ({ ...prev, sizeIndex: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-light accent-primary"
                aria-label="Taille du site"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-neutral-medium">{sizeLabels[0]}</span>
                <span className="text-xs text-neutral-medium">{sizeLabels[sizeLabels.length - 1]}</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Result */}
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
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
                className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 border border-primary/20 text-center"
              >
                <PartyPopper className="w-10 h-10 text-primary mx-auto mb-4" />

                <h4 className="text-lg font-bold text-neutral-dark mb-2">Migration gratuite !</h4>
                <p className="text-sm text-neutral-medium mb-6">
                  Nous migrons votre site depuis {data.provider} sans frais supplementaires.
                </p>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                    <span className="text-xs text-neutral-medium block">Duree estimee</span>
                    <span className="text-sm font-bold text-neutral-dark">{sizeEstimates[data.sizeIndex]}</span>
                  </div>
                  <div className="text-center">
                    <Files className="w-5 h-5 text-primary mx-auto mb-1" />
                    <span className="text-xs text-neutral-medium block">Elements</span>
                    <span className="text-sm font-bold text-neutral-dark">{data.migrateItems.length} types</span>
                  </div>
                  <div className="text-center">
                    <HardDrive className="w-5 h-5 text-primary mx-auto mb-1" />
                    <span className="text-xs text-neutral-medium block">Taille</span>
                    <span className="text-sm font-bold text-neutral-dark">{sizeLabels[data.sizeIndex]}</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="w-full">
                  Demander une migration
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

        {step < 3 && (
          <Button
            variant="primary"
            size="sm"
            onClick={goNext}
            disabled={!canProceed()}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        )}
      </div>
    </Card>
  )
}
