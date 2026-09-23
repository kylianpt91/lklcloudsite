import { motion } from 'framer-motion'

interface AnimatedServerSVGProps {
  className?: string
  size?: number
}

export default function AnimatedServerSVG({ className = '', size = 200 }: AnimatedServerSVGProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <rect x="40" y="30" width="120" height="140" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />

      <rect x="52" y="42" width="96" height="28" rx="4" fill="#222" stroke="#333" strokeWidth="1" />
      <motion.circle cx="64" cy="56" r="3" fill="#FF6A30" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle cx="76" cy="56" r="3" fill="#22c55e" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
      <rect x="100" y="48" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="56" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="64" width="40" height="4" rx="1" fill="#333" />

      <rect x="52" y="78" width="96" height="28" rx="4" fill="#222" stroke="#333" strokeWidth="1" />
      <motion.circle cx="64" cy="92" r="3" fill="#22c55e" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
      <motion.circle cx="76" cy="92" r="3" fill="#FF6A30" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
      <rect x="100" y="84" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="92" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="100" width="40" height="4" rx="1" fill="#333" />

      <rect x="52" y="114" width="96" height="28" rx="4" fill="#222" stroke="#333" strokeWidth="1" />
      <motion.circle cx="64" cy="128" r="3" fill="#3b82f6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }} />
      <motion.circle cx="76" cy="128" r="3" fill="#22c55e" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
      <rect x="100" y="120" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="128" width="40" height="4" rx="1" fill="#333" />
      <rect x="100" y="136" width="40" height="4" rx="1" fill="#333" />

      <motion.circle cx="100" cy="170" r="2" fill="#FF6A30" animate={{ cy: [170, 20], opacity: [0.8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
      <motion.circle cx="85" cy="170" r="1.5" fill="#3b82f6" animate={{ cy: [170, 20], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }} />
      <motion.circle cx="115" cy="170" r="1.5" fill="#22c55e" animate={{ cy: [170, 20], opacity: [0.6, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} />
    </motion.svg>
  )
}
