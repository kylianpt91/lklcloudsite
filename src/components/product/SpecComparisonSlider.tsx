import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card.tsx'

interface SpecComparisonSliderProps {
  before: { label: string; value: string }
  after: { label: string; value: string }
  metric: string
}

export default function SpecComparisonSlider({ before, after, metric }: SpecComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <Card variant="glass" className="p-6 overflow-hidden">
      <div className="text-center mb-4">
        <span className="text-xs font-bold text-neutral-medium uppercase tracking-wider">{metric}</span>
      </div>

      <div
        ref={containerRef}
        className="relative h-48 rounded-xl overflow-hidden cursor-col-resize select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Comparaison de performances"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        tabIndex={0}
      >
        {/* Before side (left) */}
        <div
          className="absolute inset-0 bg-neutral-light flex flex-col items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <span className="text-xs font-semibold text-neutral-medium mb-2 uppercase tracking-wider">Avant</span>
          <span className="text-sm font-medium text-neutral-medium mb-1">{before.label}</span>
          <span className="text-2xl font-extrabold text-neutral-dark">{before.value}</span>
        </div>

        {/* After side (right) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 flex flex-col items-center justify-center"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <span className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">LKL Cloud</span>
          <span className="text-sm font-medium text-neutral-dark mb-1">{after.label}</span>
          <span className="text-2xl font-extrabold text-primary">{after.value}</span>
        </div>

        {/* Draggable divider */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-primary z-10 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <div className="w-0.5 h-3 bg-white/80 rounded-full" />
              <div className="w-0.5 h-3 bg-white/80 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  )
}
