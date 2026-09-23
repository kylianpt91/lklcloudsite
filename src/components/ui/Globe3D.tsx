interface Globe3DProps {
  className?: string
  size?: number
}

/** Datacenter locations mapped to approximate SVG coordinates on the globe */
const datacenters = [
  { name: 'Paris', cx: 152, cy: 118 },
  { name: 'Strasbourg', cx: 162, cy: 112 },
]

export default function Globe3D({ className = '', size = 300 }: Globe3DProps) {
  const center = size / 2
  const radius = size / 2 - 10

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size, perspective: '800px' }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="globe-svg"
        aria-label="Globe illustrant les datacenters en France"
        role="img"
      >
        <defs>
          {/* Gradient for globe fill */}
          <radialGradient
            id="globe-gradient"
            cx="40%"
            cy="35%"
            r="60%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="rgba(248, 129, 79, 0.08)" />
            <stop offset="100%" stopColor="rgba(248, 129, 79, 0.02)" />
          </radialGradient>

          {/* Clip path for the globe circle */}
          <clipPath id="globe-clip">
            <circle cx={center} cy={center} r={radius} />
          </clipPath>
        </defs>

        {/* Globe background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#globe-gradient)"
          stroke="rgba(248, 129, 79, 0.15)"
          strokeWidth="1.5"
        />

        {/* Grid lines clipped to the globe */}
        <g clipPath="url(#globe-clip)" className="globe-grid">
          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const yOffset = center + (lat / 90) * radius
            const ellipseRx =
              radius * Math.cos((Math.abs(lat) / 90) * (Math.PI / 2))
            return (
              <ellipse
                key={`lat-${lat}`}
                cx={center}
                cy={yOffset}
                rx={ellipseRx}
                ry={ellipseRx * 0.15}
                fill="none"
                stroke="rgba(248, 129, 79, 0.1)"
                strokeWidth="0.75"
              />
            )
          })}

          {/* Longitude lines (animated rotation group) */}
          <g className="globe-longitude">
            {[-60, -30, 0, 30, 60].map((lon) => {
              const xOffset = (lon / 90) * radius * 0.3
              return (
                <ellipse
                  key={`lon-${lon}`}
                  cx={center + xOffset}
                  cy={center}
                  rx={radius * 0.25}
                  ry={radius}
                  fill="none"
                  stroke="rgba(248, 129, 79, 0.1)"
                  strokeWidth="0.75"
                />
              )
            })}
          </g>
        </g>

        {/* Datacenter locations */}
        {datacenters.map((dc) => (
          <g key={dc.name}>
            {/* Pulsing ring */}
            <circle
              cx={dc.cx}
              cy={dc.cy}
              r="8"
              fill="none"
              stroke="rgba(248, 129, 79, 0.4)"
              strokeWidth="1"
              className="globe-pulse"
            />
            {/* Solid dot */}
            <circle cx={dc.cx} cy={dc.cy} r="3" fill="#FF6A30" />
            {/* Label */}
            <text
              x={dc.cx + 12}
              y={dc.cy + 4}
              fontSize="10"
              fill="rgba(248, 129, 79, 0.7)"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {dc.name}
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        .globe-svg {
          animation: globe-rotate 40s linear infinite;
        }

        @keyframes globe-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .globe-pulse {
          animation: globe-pulse-anim 2s ease-in-out infinite;
        }

        @keyframes globe-pulse-anim {
          0%, 100% {
            r: 4;
            opacity: 0.6;
          }
          50% {
            r: 10;
            opacity: 0;
          }
        }

        .globe-longitude {
          animation: longitude-drift 20s ease-in-out infinite alternate;
        }

        @keyframes longitude-drift {
          0% { transform: translateX(-4px); }
          100% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
