import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DynamicGreetingProps {
  className?: string
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours()

  if (hour < 12) {
    return { text: 'Bonjour', emoji: '\u2600\uFE0F' }
  }
  if (hour < 18) {
    return { text: 'Bon apr\u00e8s-midi', emoji: '\uD83C\uDF24\uFE0F' }
  }
  return { text: 'Bonsoir', emoji: '\uD83C\uDF19' }
}

const textVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
}

export default function DynamicGreeting({
  className = '',
}: DynamicGreetingProps) {
  const [greeting, setGreeting] = useState(getGreeting)

  useEffect(() => {
    // Update every minute in case the user stays on the page across thresholds
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 ${className}`}
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      <span aria-hidden="true">{greeting.emoji}</span>
      <span>{greeting.text}</span>
    </motion.span>
  )
}
