import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Cpu, MemoryStick, HardDrive, Wifi, ShoppingCart } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

interface ProductConfiguratorProps {
  basePrice: number
  productName: string
}

interface SliderConfig {
  key: string
  label: string
  icon: typeof Cpu
  min: number
  max: number
  step: number
  unit: string
  defaultValue: number
}

const sliders: SliderConfig[] = [
  { key: 'ram', label: 'RAM', icon: MemoryStick, min: 2, max: 64, step: 2, unit: 'Go', defaultValue: 2 },
  { key: 'cpu', label: 'CPU', icon: Cpu, min: 1, max: 16, step: 1, unit: 'vCPU', defaultValue: 1 },
  { key: 'storage', label: 'Stockage', icon: HardDrive, min: 20, max: 500, step: 10, unit: 'Go', defaultValue: 20 },
  { key: 'bandwidth', label: 'Bande passante', icon: Wifi, min: 500, max: 10000, step: 500, unit: 'Mbit/s', defaultValue: 500 },
]

const bandwidthMultipliers: Record<number, number> = {
  500: 0,
  1000: 2,
  1500: 3.5,
  2000: 5,
  2500: 7,
  3000: 9,
  3500: 11,
  4000: 13,
  4500: 15,
  5000: 17,
  5500: 19.5,
  6000: 22,
  6500: 24.5,
  7000: 27,
  7500: 29.5,
  8000: 32,
  8500: 34.5,
  9000: 37,
  9500: 39.5,
  10000: 42,
}

function getBandwidthMultiplier(value: number): number {
  return bandwidthMultipliers[value] ?? 0
}

function formatBandwidth(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString('fr-FR')} Gbit/s`
  }
  return `${value} Mbit/s`
}

export default function ProductConfigurator({ basePrice, productName }: ProductConfiguratorProps) {
  const [values, setValues] = useState<Record<string, number>>({
    ram: 2,
    cpu: 1,
    storage: 20,
    bandwidth: 500,
  })

  const handleChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const totalPrice = useMemo(() => {
    const ramCost = (values.ram - 2) * 1.5
    const cpuCost = (values.cpu - 1) * 3
    const storageCost = (values.storage - 20) * 0.05
    const bandwidthCost = getBandwidthMultiplier(values.bandwidth)
    return basePrice + ramCost + cpuCost + storageCost + bandwidthCost
  }, [basePrice, values])

  return (
    <Card variant="glass" className="p-8 relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark" />

      <h3 className="text-xl font-bold text-neutral-dark mb-2">
        Configurateur {productName}
      </h3>
      <p className="text-sm text-neutral-medium mb-8">
        Ajustez les ressources selon vos besoins
      </p>

      <div className="space-y-8">
        {sliders.map((slider) => {
          const Icon = slider.icon
          const currentValue = values[slider.key]
          const percentage = ((currentValue - slider.min) / (slider.max - slider.min)) * 100

          return (
            <div key={slider.key}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-neutral-dark">{slider.label}</span>
                </div>
                <motion.span
                  key={currentValue}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' as const }}
                  className="text-sm font-bold text-primary"
                >
                  {slider.key === 'bandwidth'
                    ? formatBandwidth(currentValue)
                    : `${currentValue} ${slider.unit}`}
                </motion.span>
              </div>

              <div className="relative">
                <div className="w-full h-2 bg-neutral-light rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    initial={false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.2, ease: 'easeOut' as const }}
                  />
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={currentValue}
                  onChange={(e) => handleChange(slider.key, Number(e.target.value))}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  aria-label={slider.label}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-neutral-medium">
                  {slider.key === 'bandwidth' ? formatBandwidth(slider.min) : `${slider.min} ${slider.unit}`}
                </span>
                <span className="text-[10px] text-neutral-medium">
                  {slider.key === 'bandwidth' ? formatBandwidth(slider.max) : `${slider.max} ${slider.unit}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total price */}
      <div className="mt-10 pt-6 border-t border-neutral-gray/30">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-neutral-medium">Total mensuel</span>
          <motion.div
            key={totalPrice.toFixed(2)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
            className="flex items-baseline gap-1"
          >
            <span className="text-3xl font-extrabold text-neutral-dark">
              {totalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
            </span>
            <span className="text-sm text-neutral-medium">/mois</span>
          </motion.div>
        </div>

        <Button variant="primary" size="lg" className="w-full" icon={<ShoppingCart className="w-4 h-4" />}>
          Commander
        </Button>
      </div>
    </Card>
  )
}
