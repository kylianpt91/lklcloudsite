import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Accessibility, X } from 'lucide-react'

interface Preferences {
  fontSize: 'small' | 'normal' | 'large'
  highContrast: boolean
  reduceAnimations: boolean
  focusMode: boolean
}

const STORAGE_KEY = 'lkl_preferences'

const defaultPreferences: Preferences = {
  fontSize: 'normal',
  highContrast: false,
  reduceAnimations: false,
  focusMode: false,
}

function getStoredPreferences(): Preferences {
  if (typeof window === 'undefined') return defaultPreferences
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPreferences
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return { ...defaultPreferences, ...parsed }
  } catch {
    return defaultPreferences
  }
}

function savePreferences(prefs: Preferences) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

function applyPreferences(prefs: Preferences) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Font size
  const fontSizeMap: Record<Preferences['fontSize'], string> = {
    small: '14px',
    normal: '16px',
    large: '20px',
  }
  root.style.fontSize = fontSizeMap[prefs.fontSize]

  // High contrast
  if (prefs.highContrast) {
    root.classList.add('high-contrast')
  } else {
    root.classList.remove('high-contrast')
  }

  // Reduce animations
  if (prefs.reduceAnimations) {
    root.classList.add('reduce-motion')
  } else {
    root.classList.remove('reduce-motion')
  }

  // Focus mode
  if (prefs.focusMode) {
    root.classList.add('focus-mode')
  } else {
    root.classList.remove('focus-mode')
  }
}

const fontSizeOptions: { value: Preferences['fontSize']; label: string }[] = [
  { value: 'small', label: 'Petit' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grand' },
]

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences)
  const panelRef = useRef<HTMLDivElement>(null)

  // Load preferences on mount
  useEffect(() => {
    const stored = getStoredPreferences()
    setPrefs(stored)
    applyPreferences(stored)
  }, [])

  const updatePref = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPrefs((prev) => {
        const updated = { ...prev, [key]: value }
        savePreferences(updated)
        applyPreferences(updated)
        return updated
      })
    },
    [],
  )

  // Close on outside click
  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
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

  return (
    <div ref={panelRef} className="fixed bottom-6 left-6 z-50">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="glass-strong rounded-full p-3 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-300 cursor-pointer text-neutral-dark hover:text-primary"
        aria-expanded={open}
        aria-label="Accessibilit\u00e9"
      >
        <Accessibility className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="absolute bottom-full left-0 mb-3 w-72 glass-strong rounded-2xl shadow-xl shadow-black/10 p-5"
            role="dialog"
            aria-label="Param\u00e8tres d'accessibilit\u00e9"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-dark">
                Accessibilit&eacute;
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-neutral-medium" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Font size */}
              <fieldset>
                <legend className="text-xs font-semibold text-neutral-medium uppercase tracking-wider mb-2">
                  Taille du texte
                </legend>
                <div className="flex gap-2">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updatePref('fontSize', option.value)}
                      className={`flex-1 text-xs font-medium py-2 rounded-xl transition-colors duration-150 cursor-pointer ${
                        prefs.fontSize === option.value
                          ? 'bg-primary text-white'
                          : 'bg-neutral-light text-neutral-dark hover:bg-neutral-gray/50'
                      }`}
                      role="radio"
                      aria-checked={prefs.fontSize === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Toggles */}
              <ToggleOption
                label="Contraste \u00e9lev\u00e9"
                description="Am\u00e9liore la lisibilit\u00e9 du texte"
                checked={prefs.highContrast}
                onChange={(v) => updatePref('highContrast', v)}
              />

              <ToggleOption
                label="R\u00e9duire les animations"
                description="D\u00e9sactive les animations visuelles"
                checked={prefs.reduceAnimations}
                onChange={(v) => updatePref('reduceAnimations', v)}
              />

              <ToggleOption
                label="Mode focus"
                description="Att\u00e9nue les \u00e9l\u00e9ments non essentiels"
                checked={prefs.focusMode}
                onChange={(v) => updatePref('focusMode', v)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-neutral-dark cursor-pointer">
          {label}
        </label>
        <p className="text-[11px] text-neutral-medium mt-0.5">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
          checked ? 'bg-primary' : 'bg-neutral-gray'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
