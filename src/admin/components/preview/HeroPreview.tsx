import { ArrowRight, Play } from 'lucide-react'
import type { HeroConfig } from '../../lib/types'

interface HeroPreviewProps {
  data: HeroConfig
}

export function HeroPreview({ data }: HeroPreviewProps) {
  return (
    <div className="relative min-h-[480px] flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-gradient-to-b from-neutral-lightest to-neutral-light">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center leading-tight">
        <span className="text-neutral-dark/60">{data.titleLine1 || 'Votre titre ici'}</span>
        <br />
        <span className="text-gradient">
          {data.typedWords.length > 0 ? data.typedWords[0] : 'Mot animé'}
        </span>
      </h1>

      {/* Subtitle */}
      {data.subtitle && (
        <p className="mt-5 text-sm sm:text-base text-neutral-medium max-w-lg text-center leading-relaxed">
          {data.subtitle}
        </p>
      )}

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        {data.ctaPrimaryText && (
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-lg cursor-default">
            {data.ctaPrimaryText}
            <ArrowRight size={16} />
          </span>
        )}
        {data.ctaSecondaryText && (
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-neutral-gray/30 text-sm font-semibold text-neutral-dark cursor-default">
            <Play size={14} className="text-primary" />
            {data.ctaSecondaryText}
          </span>
        )}
      </div>

      {/* Typed words preview */}
      {data.typedWords.length > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {data.typedWords.map((word, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-primary/5 text-[11px] font-medium text-primary border border-primary/10">
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
