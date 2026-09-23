import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

type FontSize = 'sm' | 'md' | 'lg'

interface Preferences {
  fontSize: FontSize
  highContrast: boolean
  reduceMotion: boolean
  focusMode: boolean
}

interface PreferencesContextValue extends Preferences {
  setFontSize: (size: FontSize) => void
  setHighContrast: (enabled: boolean) => void
  setReduceMotion: (enabled: boolean) => void
  setFocusMode: (enabled: boolean) => void
}

const STORAGE_KEY = 'lkl_preferences'

const fontSizeMap: Record<FontSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
}

const defaultPreferences: Preferences = {
  fontSize: 'md',
  highContrast: false,
  reduceMotion: false,
  focusMode: false,
}

function getStoredPreferences(): Preferences {
  if (typeof window === 'undefined') return defaultPreferences
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Preferences>
      return { ...defaultPreferences, ...parsed }
    }
  } catch {
    // Invalid JSON or localStorage not available
  }
  return defaultPreferences
}

function getSystemReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function applyPreferencesToDOM(prefs: Preferences): void {
  const html = document.documentElement

  // Font size
  html.style.fontSize = fontSizeMap[prefs.fontSize]

  // High contrast
  if (prefs.highContrast) {
    html.classList.add('high-contrast')
  } else {
    html.classList.remove('high-contrast')
  }

  // Reduce motion
  if (prefs.reduceMotion) {
    html.classList.add('reduce-motion')
  } else {
    html.classList.remove('reduce-motion')
  }

  // Focus mode
  if (prefs.focusMode) {
    html.classList.add('focus-mode')
  } else {
    html.classList.remove('focus-mode')
  }
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

interface PreferencesProviderProps {
  children: ReactNode
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const stored = getStoredPreferences()
    // Merge with system preference for reduced motion
    const systemReduceMotion = getSystemReduceMotion()
    return {
      ...stored,
      reduceMotion: stored.reduceMotion || systemReduceMotion,
    }
  })

  // Persist and apply changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // localStorage not available
    }
    applyPreferencesToDOM(preferences)
  }, [preferences])

  // Listen for system prefers-reduced-motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setPreferences(prev => ({ ...prev, reduceMotion: true }))
      }
    }

    mediaQuery.addEventListener('change', handler)
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  const setFontSize = useCallback((size: FontSize) => {
    setPreferences(prev => ({ ...prev, fontSize: size }))
  }, [])

  const setHighContrast = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, highContrast: enabled }))
  }, [])

  const setReduceMotion = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, reduceMotion: enabled }))
  }, [])

  const setFocusMode = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, focusMode: enabled }))
  }, [])

  return (
    <PreferencesContext.Provider
      value={{
        ...preferences,
        setFontSize,
        setHighContrast,
        setReduceMotion,
        setFocusMode,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
