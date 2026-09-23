import { motion } from 'framer-motion'

interface PricingToggleProps {
  isAnnual: boolean
  onToggle: (isAnnual: boolean) => void
}

export default function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={[
          'text-sm font-medium transition-colors duration-300',
          !isAnnual ? 'text-neutral-dark' : 'text-neutral-medium',
        ].join(' ')}
      >
        Mensuel
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Basculer entre tarification mensuelle et annuelle"
        onClick={() => onToggle(!isAnnual)}
        className="relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        style={{
          backgroundColor: isAnnual ? '#FF6A30' : '#e5e5e5',
        }}
      >
        <motion.div
          className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
          initial={false}
          animate={{
            left: isAnnual ? 30 : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={[
            'text-sm font-medium transition-colors duration-300',
            isAnnual ? 'text-neutral-dark' : 'text-neutral-medium',
          ].join(' ')}
        >
          Annuel
        </span>

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isAnnual ? 1 : 0.5,
            scale: isAnnual ? 1 : 0.95,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700"
        >
          Economisez 20%
        </motion.span>
      </div>
    </div>
  )
}
