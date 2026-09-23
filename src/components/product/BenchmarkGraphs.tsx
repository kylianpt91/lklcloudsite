import { motion } from 'framer-motion'
import Card from '@/components/ui/Card.tsx'

interface Benchmark {
  label: string
  value: number
  max: number
}

interface BenchmarkGraphsProps {
  benchmarks: Benchmark[]
}

export default function BenchmarkGraphs({ benchmarks }: BenchmarkGraphsProps) {
  return (
    <Card variant="glass" className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-dark">Performances</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-primary to-primary-dark" />
            <span className="text-xs text-neutral-medium">LKL Cloud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-neutral-gray" />
            <span className="text-xs text-neutral-medium">Moyenne du marche</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {benchmarks.map((benchmark, index) => {
          const percentage = (benchmark.value / benchmark.max) * 100
          const avgPercentage = 55 // Simulated market average at ~55%

          return (
            <div key={benchmark.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-dark">{benchmark.label}</span>
                <span className="text-sm font-bold text-primary">
                  {benchmark.value.toLocaleString('fr-FR')}
                </span>
              </div>

              <div className="space-y-1.5">
                {/* LKL Cloud bar */}
                <div className="relative h-6 bg-neutral-light rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {Math.round(percentage)}%
                    </span>
                  </motion.div>
                </div>

                {/* Market average bar */}
                <div className="relative h-3 bg-neutral-light rounded-md overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-neutral-gray/60 rounded-md"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${avgPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15 + 0.2,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
