import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleScroll() {
      setVisible(window.scrollY > 400)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          role="complementary"
          aria-label="Actions rapides"
        >
          <div
            className="glass-strong border-t border-neutral-gray/30 px-4 py-3 flex gap-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <Link
              to="/produits/plesk"
              className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm rounded-full py-2.5 px-4 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-300"
            >
              Voir les offres
            </Link>
            <a
              href="mailto:support@lklcloud.fr"
              className="inline-flex items-center justify-center border border-neutral-dark/20 text-neutral-dark font-semibold text-sm rounded-full py-2.5 px-4 hover:bg-neutral-dark hover:text-white active:scale-[0.98] transition-all duration-300"
            >
              Contacter
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
