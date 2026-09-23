import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface Section {
  id: string
  label: string
}

interface NavigationDotsProps {
  sections: Section[]
}

export default function NavigationDots({ sections }: NavigationDotsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const location = useLocation()

  const isHomepage = location.pathname === '/'

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isHomepage) return

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    })

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections, handleIntersect, isHomepage])

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!isHomepage) return null

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
      aria-label="Navigation par section"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id
        const isHovered = hoveredId === id

        return (
          <div key={id} className="relative flex items-center">
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-full mr-3 whitespace-nowrap"
                >
                  <span className="glass-strong px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-dark shadow-sm">
                    {label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => scrollToSection(id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className="p-1 cursor-pointer"
              aria-label={`Aller à la section ${label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <motion.span
                animate={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  backgroundColor: isActive ? '#FF6A30' : '#A3A3A3',
                }}
                transition={{ duration: 0.2, ease: 'easeOut' as const }}
                className="block rounded-full"
              />
            </button>
          </div>
        )
      })}
    </nav>
  )
}
