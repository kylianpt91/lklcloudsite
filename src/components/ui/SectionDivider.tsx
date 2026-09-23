export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-24 -my-12 pointer-events-none z-10 ${className}`} aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
    </div>
  )
}
