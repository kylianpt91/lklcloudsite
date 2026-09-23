import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import SEOHead from '@/components/SEOHead'

interface LegalSection {
  id: string
  title: string
  content: ReactNode
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

export default function LegalLayout({
  title,
  lastUpdated,
  sections,
}: LegalLayoutProps) {
  useDocumentTitle(title)
  const location = useLocation()
  const seoSlug = location.pathname.replace(/^\//, '')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="pt-24 sm:pt-32 pb-10 sm:pb-16">
      <SEOHead pageSlug={seoSlug} fallbackTitle={`${title} — LKLCloud`} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <nav className="sticky top-28 space-y-2 border-l border-line pl-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-neutral-dark/55 hover:text-primary transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            <span className="eyebrow inline-flex items-center gap-2 text-neutral-dark/45 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Légal
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="display text-3xl sm:text-[2.75rem] mb-2 text-neutral-dark"
            >
              {title}
            </motion.h1>

            <p className="text-sm text-neutral-dark/45 mb-12">
              Dernière mise à jour : {lastUpdated}
            </p>

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-neutral-dark tracking-tight">
                  {section.title}
                </h2>
                <div className="text-neutral-dark/60 leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-dark text-white shadow-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer z-50"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export type { LegalSection, LegalLayoutProps }
