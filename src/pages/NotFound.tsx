import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'

function ServerErrorIllustration() {
  return (
    <svg
      viewBox="0 0 600 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-xl mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
      aria-hidden="true"
    >
      {/* ====== EMBEDDED ANIMATIONS ====== */}
      <style>{`
        @keyframes riseSteam {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { opacity: 0.2; }
          100% { transform: translateY(-15px) scale(1.2) translateX(5px); opacity: 0; }
        }
        @keyframes blink {
          0%, 49% { opacity: 0.5; }
          50%, 100% { opacity: 0; }
        }
        @keyframes serverActive {
          0%, 100% { opacity: 0.3; }
          10%, 30%, 50%, 70% { opacity: 1; }
          20%, 40%, 60%, 80% { opacity: 0.2; }
        }
        @keyframes breatheAndBlink {
          0%   { opacity: 0.8; }
          15%  { opacity: 0.2; }
          30%  { opacity: 0.8; }
          45%  { opacity: 0.2; }
          55%  { opacity: 0.8; }
          56%  { opacity: 0.1; }
          57%  { opacity: 0.9; }
          58%  { opacity: 0.1; }
          59%  { opacity: 0.8; }
          70%  { opacity: 0.2; }
          85%  { opacity: 0.8; }
          92%  { opacity: 0.1; }
          93%  { opacity: 0.8; }
          100% { opacity: 0.8; }
        }
        @keyframes subtleGlitch {
          0%, 96%, 100% { transform: translate(0, 0); opacity: 0.9; }
          97% { transform: translate(-2px, 1px); opacity: 0.7; }
          98% { transform: translate(2px, -1px); opacity: 1; }
          99% { transform: translate(-1px, 2px); opacity: 0.8; }
        }
        .anim-steam-1 { animation: riseSteam 3s ease-in infinite; }
        .anim-steam-2 { animation: riseSteam 3.5s ease-in infinite 0.5s; }
        .anim-steam-3 { animation: riseSteam 2.8s ease-in infinite 1.2s; }
        .anim-blink { animation: blink 1s step-end infinite; }
        .anim-led-fast { animation: blink 0.5s step-end infinite; }
        .anim-monitor-led { animation: breatheAndBlink 7s ease-in-out infinite; }
        .anim-server-data { animation: serverActive 2.5s infinite; }
        .anim-glitch { animation: subtleGlitch 5s infinite; }
      `}</style>

      {/* ====== DESK / SURFACE ====== */}
      <rect x="60" y="340" width="480" height="12" rx="6" fill="#E5E5E5" />
      <rect x="80" y="348" width="440" height="4" rx="2" fill="#D4D4D4" />
      {/* Desk legs */}
      <rect x="110" y="352" width="8" height="56" rx="3" fill="#D4D4D4" />
      <rect x="482" y="352" width="8" height="56" rx="3" fill="#D4D4D4" />
      {/* Desk shadow */}
      <ellipse cx="300" cy="412" rx="220" ry="8" fill="#111" fillOpacity="0.3" />

      {/* ====== MONITOR ====== */}
      {/* Stand base */}
      <rect x="260" y="326" width="80" height="14" rx="4" fill="#D4D4D4" />
      {/* Stand neck */}
      <rect x="290" y="295" width="20" height="35" rx="4" fill="#C4C4C4" />
      {/* Monitor body */}
      <rect x="145" y="80" width="310" height="220" rx="14" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="2" />
      {/* Monitor bezel inner */}
      <rect x="157" y="92" width="286" height="196" rx="8" fill="#111111" />
      {/* Screen */}
      <rect x="163" y="98" width="274" height="178" rx="5" fill="#0D1117" />

      {/* ── Screen content ── */}
      <rect x="163" y="98" width="274" height="178" rx="5" fill="url(#screenGlow404)" fillOpacity="0.15" />

      {/* "404" large text with glitch */}
      <text className="anim-glitch" x="300" y="175" textAnchor="middle" fill="#FF6A30" fontSize="56" fontFamily="system-ui" fontWeight="800" opacity="0.9">404</text>

      {/* Terminal prompt lines */}
      <text x="180" y="220" fill="#3B82F6" fontSize="8" fontFamily="monospace" opacity="0.7">$</text>
      <text x="190" y="220" fill="#6B7280" fontSize="8" fontFamily="monospace" opacity="0.6">ping page... timeout</text>

      <text x="180" y="234" fill="#3B82F6" fontSize="8" fontFamily="monospace" opacity="0.7">$</text>
      <text x="190" y="234" fill="#EF4444" fontSize="8" fontFamily="monospace" opacity="0.6">ERR_PAGE_NOT_FOUND</text>

      <text x="180" y="248" fill="#3B82F6" fontSize="8" fontFamily="monospace" opacity="0.5">$</text>
      <rect className="anim-blink" x="190" y="242" width="6" height="10" rx="1" fill="#3B82F6" opacity="0.4" />

      {/* Power LED on monitor */}
      <circle className="anim-monitor-led" cx="300" cy="290" r="2.5" fill="#FF6A30" opacity="0.8" />

      {/* ====== KEYBOARD ====== */}
      <rect x="210" y="310" width="180" height="28" rx="6" fill="#E8E8E8" stroke="#D4D4D4" strokeWidth="1" />
      {/* Row 1 */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
        <rect key={`k1-${i}`} x={218 + i * 14} y={314} width={10} height={8} rx={2} fill="#F5F5F5" stroke="#D4D4D4" strokeWidth="0.5" />
      ))}
      {/* Row 2 */}
      {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
        <rect key={`k2-${i}`} x={222 + i * 14} y={324} width={10} height={8} rx={2} fill="#F5F5F5" stroke="#D4D4D4" strokeWidth="0.5" />
      ))}

      {/* ====== MOUSE ====== */}
      <rect x="408" y="314" width="22" height="30" rx="10" fill="#E8E8E8" stroke="#D4D4D4" strokeWidth="1" />
      <line x1="419" y1="316" x2="419" y2="324" stroke="#D4D4D4" strokeWidth="0.8" />
      {/* Mouse cable */}
      <path d="M419 314 C419 308, 412 304, 406 300" stroke="#D4D4D4" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* ====== SMALL SERVER UNIT (right side of desk) ====== */}
      <rect x="480" y="290" width="70" height="50" rx="6" fill="#F7F7F7" stroke="#E5E5E5" strokeWidth="1.2" />
      {/* Server details */}
      <circle cx="494" cy="306" r="3" fill="#EF4444" />
      <circle className="anim-server-data" cx="494" cy="306" r="1.5" fill="#FCA5A5" />
      <circle className="anim-led-fast" cx="494" cy="318" r="2" fill="#FF6A30" opacity="0.5" />
      {/* Drive bays */}
      <rect x="504" y="298" width="12" height="10" rx="2" fill="#EFEFEF" stroke="#E5E5E5" strokeWidth="0.6" />
      <rect x="519" y="298" width="12" height="10" rx="2" fill="#EFEFEF" stroke="#E5E5E5" strokeWidth="0.6" />
      <rect x="534" y="298" width="12" height="10" rx="2" fill="#EFEFEF" stroke="#E5E5E5" strokeWidth="0.6" />
      {/* Vent grille */}
      <rect x="504" y="316" width="42" height="10" rx="2" fill="#EFEFEF" stroke="#E5E5E5" strokeWidth="0.6" />
      <line x1="510" y1="318" x2="510" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      <line x1="516" y1="318" x2="516" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      <line x1="522" y1="318" x2="522" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      <line x1="528" y1="318" x2="528" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      <line x1="534" y1="318" x2="534" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      <line x1="540" y1="318" x2="540" y2="324" stroke="#E5E5E5" strokeWidth="0.5" />
      {/* Ethernet port */}
      <rect x="486" y="330" width="10" height="8" rx="1.5" fill="#2A2A2A" stroke="#333" strokeWidth="0.5" />

      {/* ====== COFFEE MUG ====== */}
      <rect x="120" y="310" width="30" height="30" rx="4" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1.2" />
      {/* Mug handle */}
      <path d="M150 317 C158 317, 160 325, 150 332" stroke="#E5E5E5" strokeWidth="1.5" fill="none" />
      {/* Coffee surface */}
      <ellipse cx="135" cy="316" rx="11" ry="3" fill="#C4956A" opacity="0.6" />
      {/* Steam wisps (animated) */}
      <path className="anim-steam-1" d="M128 306 C126 300, 130 296, 128 290" stroke="#D4D4D4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
      <path className="anim-steam-2" d="M135 304 C133 298, 137 293, 135 287" stroke="#D4D4D4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />
      <path className="anim-steam-3" d="M142 306 C140 300, 144 296, 142 290" stroke="#D4D4D4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* ====== GRADIENT DEFINITIONS ====== */}
      <defs>
        <radialGradient id="screenGlow404" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FF6A30" />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
      </defs>
    </svg>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function NotFound() {
  useDocumentTitle('Page introuvable')

  return (
    <div className="min-h-[calc(100dvh-7rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden -mt-28 pt-28 bg-paper">
      <div
        aria-hidden="true"
        className="warm-glow pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full opacity-70"
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Illustration */}
        <motion.div variants={itemVariants}>
          <ServerErrorIllustration />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="display mt-8 text-3xl sm:text-4xl md:text-[3rem] text-neutral-dark"
          variants={itemVariants}
        >
          Cette page s&apos;est{' '}
          <span className="font-accent font-normal text-primary">volatilisée</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mt-4 text-base sm:text-lg text-neutral-dark/55 max-w-md mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Le lien que vous avez suivi est peut-être obsolète ou la page a été déplacée.
          Pas d&apos;inquiétude, nos serveurs tournent toujours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-neutral-dark rounded-xl transition-colors duration-300 hover:bg-primary"
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border border-neutral-dark/15 rounded-xl hover:border-neutral-dark/40 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Page précédente
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
