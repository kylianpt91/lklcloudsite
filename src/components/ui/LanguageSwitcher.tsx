import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Language = 'fr' | 'en'

interface LangOption {
  code: Language
  label: string
  flag: string
}

const STORAGE_KEY = 'lkl_lang'

const languages: LangOption[] = [
  { code: 'fr', label: 'Fran\u00e7ais', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'en', label: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
]

function getStoredLang(): Language {
  if (typeof window === 'undefined') return 'fr'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en') return 'en'
  } catch {
    // ignore
  }
  return 'fr'
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('fr')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLang(getStoredLang())
  }, [])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function selectLang(code: Language) {
    setLang(code)
    setOpen(false)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, code)
      } catch {
        // ignore
      }
    }
  }

  const current = languages.find((l) => l.code === lang) ?? languages[0]

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm font-medium text-neutral-dark hover:bg-white/60 transition-colors duration-200 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Changer de langue"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="text-xs uppercase font-semibold">{current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' as const }}
            className="absolute top-full right-0 mt-2 glass-strong rounded-xl shadow-lg shadow-black/5 overflow-hidden min-w-[140px]"
            role="listbox"
            aria-label="Langues disponibles"
          >
            {languages.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => selectLang(option.code)}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors duration-100 cursor-pointer text-left ${
                  option.code === lang
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-neutral-dark hover:bg-black/5'
                }`}
                role="option"
                aria-selected={option.code === lang}
              >
                <span aria-hidden="true">{option.flag}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
