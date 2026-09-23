import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TOCSection {
  id: string
  label: string
}

interface FloatingTOCProps {
  sections: TOCSection[]
}

export default function FloatingTOC({ sections }: FloatingTOCProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (!el) continue

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id)
          }
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )

      observer.observe(el)
      observers.push(observer)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1"
          aria-label="Table des matières"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`group flex items-center gap-3 px-3 py-1.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary'
                    : 'text-neutral-medium/50 hover:text-neutral-dark'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                    isActive ? 'bg-primary scale-125' : 'bg-neutral-gray/40 group-hover:bg-neutral-medium'
                  }`}
                />
                <span className="text-xs font-medium whitespace-nowrap">
                  {section.label}
                </span>
              </button>
            )
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
