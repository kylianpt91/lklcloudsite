import type { ReactNode } from 'react'

interface LogoLoopProps {
  items: { name: string; icon: ReactNode }[]
  speed?: number
  className?: string
  maskColor?: string
  /** Hide text labels and use larger spacing — logo-only mode */
  logoOnly?: boolean
}

export default function LogoLoop({
  items,
  speed = 30,
  className = '',
  maskColor = 'var(--color-neutral-lightest)',
  logoOnly = false,
}: LogoLoopProps) {
  const gap = logoOnly ? 'gap-16' : 'gap-12'
  const pr = logoOnly ? 'pr-16' : 'pr-12'

  // Triple items inside each set so one set is always wider than the viewport.
  // Without this, 10 logos + gaps ≈ 1440px < 1920px viewport → visible gap.
  const filled = [...items, ...items, ...items]

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label="Logo marquee"
    >
      {/* Left fade mask */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${maskColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Right fade mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${maskColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Scrolling track — two identical sets for seamless loop */}
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{
          animation: `logo-scroll ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            className={`flex items-center ${gap} shrink-0 ${pr}`}
            aria-hidden={setIndex === 1 ? true : undefined}
          >
            {filled.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center gap-2.5 shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <span className={logoOnly ? '' : 'text-2xl'}>{item.icon}</span>
                {!logoOnly && (
                  <span className="text-sm font-medium text-neutral-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes logo-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
