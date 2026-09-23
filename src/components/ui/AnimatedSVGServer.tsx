interface AnimatedSVGServerProps {
  className?: string
  animated?: boolean
}

export default function AnimatedSVGServer({
  className = '',
  animated = true,
}: AnimatedSVGServerProps) {
  const animClass = animated ? 'server-animated' : ''

  return (
    <div className={`inline-block ${className}`}>
      <svg
        viewBox="0 0 120 180"
        width="120"
        height="180"
        role="img"
        aria-label="Illustration d'un rack serveur"
        className={animClass}
      >
        {/* Rack frame */}
        <rect
          x="10"
          y="10"
          width="100"
          height="160"
          rx="6"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1.5"
          className={animated ? 'server-rack-vibrate' : ''}
        />

        {/* Server unit 1 */}
        <rect x="18" y="22" width="84" height="28" rx="3" fill="#222" stroke="#444" strokeWidth="0.75" />
        {/* LED lights for unit 1 */}
        <circle cx="30" cy="36" r="2.5" fill="#22c55e" className={animated ? 'led-blink-1' : ''} />
        <circle cx="38" cy="36" r="2.5" fill="#22c55e" className={animated ? 'led-blink-2' : ''} />
        <circle cx="46" cy="36" r="2" fill="#3b82f6" />
        {/* Vents */}
        <line x1="60" y1="28" x2="60" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="66" y1="28" x2="66" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="72" y1="28" x2="72" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="78" y1="28" x2="78" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="84" y1="28" x2="84" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="90" y1="28" x2="90" y2="44" stroke="#333" strokeWidth="0.5" />
        <line x1="96" y1="28" x2="96" y2="44" stroke="#333" strokeWidth="0.5" />

        {/* Server unit 2 */}
        <rect x="18" y="58" width="84" height="28" rx="3" fill="#222" stroke="#444" strokeWidth="0.75" />
        <circle cx="30" cy="72" r="2.5" fill="#22c55e" className={animated ? 'led-blink-3' : ''} />
        <circle cx="38" cy="72" r="2.5" fill="#FF6A30" />
        <circle cx="46" cy="72" r="2" fill="#3b82f6" />
        <line x1="60" y1="64" x2="60" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="66" y1="64" x2="66" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="72" y1="64" x2="72" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="78" y1="64" x2="78" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="84" y1="64" x2="84" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="90" y1="64" x2="90" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="96" y1="64" x2="96" y2="80" stroke="#333" strokeWidth="0.5" />

        {/* Server unit 3 */}
        <rect x="18" y="94" width="84" height="28" rx="3" fill="#222" stroke="#444" strokeWidth="0.75" />
        <circle cx="30" cy="108" r="2.5" fill="#22c55e" className={animated ? 'led-blink-2' : ''} />
        <circle cx="38" cy="108" r="2.5" fill="#22c55e" className={animated ? 'led-blink-1' : ''} />
        <circle cx="46" cy="108" r="2" fill="#3b82f6" />
        <line x1="60" y1="100" x2="60" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="66" y1="100" x2="66" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="72" y1="100" x2="72" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="78" y1="100" x2="78" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="84" y1="100" x2="84" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="90" y1="100" x2="90" y2="116" stroke="#333" strokeWidth="0.5" />
        <line x1="96" y1="100" x2="96" y2="116" stroke="#333" strokeWidth="0.5" />

        {/* Bottom panel / PSU */}
        <rect x="18" y="130" width="84" height="28" rx="3" fill="#1c1c1c" stroke="#444" strokeWidth="0.75" />
        <circle cx="30" cy="144" r="2" fill="#22c55e" />
        <rect x="56" y="136" width="40" height="16" rx="2" fill="#181818" stroke="#333" strokeWidth="0.5" />
        <text x="64" y="148" fontSize="7" fill="#555" fontFamily="monospace">PSU</text>

        {/* Data flow lines (animated dashes going upward) */}
        {animated && (
          <g>
            <line
              x1="40"
              y1="170"
              x2="40"
              y2="10"
              stroke="rgba(248, 129, 79, 0.3)"
              strokeWidth="1"
              strokeDasharray="3 6"
              className="data-flow-line"
            />
            <line
              x1="60"
              y1="170"
              x2="60"
              y2="10"
              stroke="rgba(34, 197, 94, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 6"
              className="data-flow-line data-flow-delay-1"
            />
            <line
              x1="80"
              y1="170"
              x2="80"
              y2="10"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 6"
              className="data-flow-line data-flow-delay-2"
            />
          </g>
        )}
      </svg>

      <style>{`
        .led-blink-1 {
          animation: led-blink 1.5s ease-in-out infinite;
        }
        .led-blink-2 {
          animation: led-blink 2s ease-in-out infinite 0.5s;
        }
        .led-blink-3 {
          animation: led-blink 1.8s ease-in-out infinite 1s;
        }

        @keyframes led-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .server-rack-vibrate {
          animation: rack-vibrate 0.15s linear infinite;
        }

        @keyframes rack-vibrate {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(0.2px); }
          75% { transform: translateX(-0.2px); }
        }

        .data-flow-line {
          animation: data-flow 2s linear infinite;
        }
        .data-flow-delay-1 {
          animation-delay: 0.7s;
        }
        .data-flow-delay-2 {
          animation-delay: 1.4s;
        }

        @keyframes data-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -18; }
        }
      `}</style>
    </div>
  )
}
