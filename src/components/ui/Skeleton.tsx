interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full' | '2xl'
  className?: string
  count?: number
}

const roundedMap: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
  '2xl': 'rounded-2xl',
}

function SkeletonLine({
  width,
  height = '1rem',
  rounded = 'md',
  className = '',
}: Omit<SkeletonProps, 'count'>) {
  return (
    <>
      <div
        className={`skeleton-shimmer ${roundedMap[rounded]} ${className}`}
        style={{ width: width ?? '100%', height }}
      />
      <style>{`
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
          background-color: rgba(163, 163, 163, 0.3);
        }
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: skeleton-sweep 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-sweep {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  )
}

export default function Skeleton({
  width,
  height,
  rounded,
  className,
  count = 1,
}: SkeletonProps) {
  if (count <= 1) {
    return (
      <SkeletonLine
        width={width}
        height={height}
        rounded={rounded}
        className={className}
      />
    )
  }

  const widthVariants = ['100%', '92%', '85%', '96%', '78%']

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={width ?? widthVariants[i % widthVariants.length]}
          height={height}
          rounded={rounded}
          className={className}
        />
      ))}
    </div>
  )
}
