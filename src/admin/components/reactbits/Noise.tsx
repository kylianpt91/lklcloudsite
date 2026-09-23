import { useRef, useEffect } from 'react'

interface NoiseProps {
  className?: string
  opacity?: number
  grainSize?: number
}

export default function Noise({
  className = '',
  opacity = 0.04,
  grainSize = 1,
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      // Use lower resolution for performance
      canvas.width = Math.ceil(width / grainSize)
      canvas.height = Math.ceil(height / grainSize)
      draw()
    }

    const ctx = canvas.getContext('2d')!
    const draw = () => {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(parent)
    resize()

    return () => ro.disconnect()
  }, [grainSize])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        width: '100%',
        height: '100%',
        mixBlendMode: 'overlay',
        imageRendering: 'pixelated',
      }}
    />
  )
}
