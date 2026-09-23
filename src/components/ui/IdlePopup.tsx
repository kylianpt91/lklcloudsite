import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

const STORAGE_KEY = 'lkl_idle_popup_shown'
const IDLE_TIMEOUT = 45_000 // 45 seconds

export default function IdlePopup() {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    setVisible(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') return

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setVisible(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, 'true')
        }
      }, IDLE_TIMEOUT)
    }

    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    resetTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="fixed bottom-24 right-6 z-50 w-72 glass-strong rounded-2xl shadow-xl shadow-black/10 p-5"
          role="alert"
          aria-live="polite"
        >
          {/* Close */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-neutral-medium" aria-hidden="true" />
          </button>

          {/* Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-neutral-dark">
              Besoin d&apos;aide ?
            </h3>
          </div>

          <p className="text-xs text-neutral-medium mb-4 leading-relaxed">
            Notre &eacute;quipe est disponible 24/7 pour r&eacute;pondre &agrave; vos questions.
          </p>

          <a
            href="mailto:support@lklcloud.fr"
            onClick={dismiss}
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-xs rounded-full py-2.5 px-4 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-300"
          >
            Nous contacter
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
