interface SectionTitleProps {
  title: string
  subtitle?: string
  eyebrow?: string
  gradient?: boolean
  centered?: boolean
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  eyebrow,
  centered = false,
  className = '',
}: SectionTitleProps) {
  const wrapperClasses = [
    centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {eyebrow && (
        <span
          className={`eyebrow inline-flex items-center gap-2 text-neutral-dark/45 mb-4 ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="display text-3xl sm:text-4xl text-neutral-dark">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-neutral-dark/55">{subtitle}</p>}
    </div>
  )
}
