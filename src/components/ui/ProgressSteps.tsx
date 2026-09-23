import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

export default function ProgressSteps({
  steps,
  currentStep,
  className = '',
}: ProgressStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isFuture = index > currentStep

          return (
            <div
              key={index}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step circle */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: isCompleted
                      ? '#FF6A30'
                      : isCurrent
                        ? 'transparent'
                        : '#e5e5e5',
                    border: isCurrent ? '2px solid #FF6A30' : 'none',
                  }}
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isCurrent ? Infinity : 0,
                    ease: 'easeInOut' as const,
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: isCurrent
                          ? '#FF6A30'
                          : isFuture
                            ? '#a3a3a3'
                            : '#fff',
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.div>

                {/* Step label */}
                <span
                  className="absolute top-full mt-2 text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isCompleted || isCurrent ? '#171717' : '#a3a3a3',
                  }}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="flex-1 mx-2"
                  style={{
                    height: 2,
                    background:
                      index < currentStep
                        ? '#FF6A30'
                        : index === currentStep
                          ? 'linear-gradient(to right, #FF6A30, #e5e5e5)'
                          : '#e5e5e5',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
