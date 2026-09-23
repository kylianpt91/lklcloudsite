interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  variant?: 'header' | 'footer'
}

const sizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14',
  '2xl': 'h-20',
  '3xl': 'h-24',
}

// The mascot mark is opaque orange + white on a transparent background,
// so it reads correctly on both the light and dark theme without needing
// separate variants per mode.
const MASCOT = '/images/logos/mascot.png'

export default function Logo({ className = '', size = 'md', variant: _variant = 'header' }: LogoProps) {
  return (
    <a href="/" className={`flex items-center shrink-0 ${className}`}>
      <img
        src={MASCOT}
        alt="LKL Cloud"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </a>
  )
}
