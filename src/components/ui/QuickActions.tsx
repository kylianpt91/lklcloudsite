import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

export default function QuickActions() {
  const [nearBottom, setNearBottom] = useState(false)
  const [groupHovered, setGroupHovered] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleScroll() {
      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      setNearBottom(docHeight - scrollBottom < 200)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (nearBottom) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-20 right-6 z-50 hidden lg:flex flex-col gap-2.5"
      aria-label="Actions rapides"
      role="group"
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <QuickActionButton
        href="tel:+33123456789"
        icon={<Phone className="w-5 h-5" aria-hidden="true" />}
        label="Appeler"
        ariaLabel="Appeler LKL Cloud"
        expanded={groupHovered}
      />
      <QuickActionButton
        href="mailto:support@lklcloud.fr"
        icon={<Mail className="w-5 h-5" aria-hidden="true" />}
        label="E-mail"
        ariaLabel="Envoyer un e-mail"
        expanded={groupHovered}
      />
    </motion.div>
  )
}

function QuickActionButton({
  href,
  icon,
  label,
  ariaLabel,
  expanded,
}: {
  href: string
  icon: React.ReactNode
  label: string
  ariaLabel: string
  expanded: boolean
}) {
  return (
    <motion.a
      variants={itemVariants}
      href={href}
      className="group flex items-center bg-paper border border-line rounded-xl p-3 shadow-lg shadow-black/5 hover:border-neutral-dark/30 transition-colors duration-300 cursor-pointer text-neutral-dark hover:text-primary"
      aria-label={ariaLabel}
    >
      {icon}
      <motion.span
        initial={false}
        animate={{
          width: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0,
          marginLeft: expanded ? 8 : 0,
          marginRight: expanded ? 4 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' as const }}
        className="overflow-hidden whitespace-nowrap text-sm font-medium"
      >
        {label}
      </motion.span>
    </motion.a>
  )
}
