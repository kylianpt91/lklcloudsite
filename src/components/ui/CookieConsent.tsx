import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Shield } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface StoredConsent {
  consented: boolean
  preferences: CookiePreferences
  timestamp: number
}

const STORAGE_KEY = 'lkl_cookie_consent'

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

function getStoredConsent(): StoredConsent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as StoredConsent
    }
  } catch {
    // localStorage not available
  }
  return null
}

function saveConsent(preferences: CookiePreferences): void {
  try {
    const consent: StoredConsent = {
      consented: true,
      preferences,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))

    // If user refused non-essential cookies, clear any non-essential storage
    if (!preferences.analytics && !preferences.marketing && !preferences.preferences) {
      // Keep only essential keys
      const essentialKeys = [STORAGE_KEY]
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && !essentialKeys.includes(key)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    }

    // Notify other components that cookies have been resolved
    window.dispatchEvent(new CustomEvent('lkl-cookies-resolved', { detail: preferences }))
  } catch {
    // localStorage not available
  }
}

/** Check if user has given cookie consent */
export function getCookieConsent(): StoredConsent | null {
  return getStoredConsent()
}

/** Check if a specific cookie category is allowed */
export function isCookieAllowed(category: keyof CookiePreferences): boolean {
  const stored = getStoredConsent()
  if (!stored) return false
  return stored.preferences[category]
}

const bannerVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const panelVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeIn' as const,
    },
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

function ToggleSwitch({ enabled, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
        disabled
          ? 'bg-neutral-gray cursor-not-allowed'
          : enabled
            ? 'bg-primary'
            : 'bg-neutral-gray hover:bg-neutral-medium'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [showCustomize, setShowCustomize] = useState<boolean>(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      // Small delay before showing the banner
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    saveConsent(allAccepted)
    setShowBanner(false)
  }, [])

  const refuseAll = useCallback(() => {
    const allRefused: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    saveConsent(allRefused)
    setShowBanner(false)
  }, [])

  const saveCustom = useCallback(() => {
    saveConsent(preferences)
    setShowBanner(false)
  }, [preferences])

  const updatePreference = useCallback(
    (key: keyof Omit<CookiePreferences, 'necessary'>, value: boolean) => {
      setPreferences(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed bottom-0 left-0 right-0 z-[99999] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-paper border border-line rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Main banner */}
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-dark/[0.05] flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-neutral-dark mb-1">
                    Nous respectons votre vie priv&eacute;e
                  </h3>
                  <p className="text-sm text-neutral-medium leading-relaxed">
                    Nous utilisons des cookies pour am&eacute;liorer votre exp&eacute;rience,
                    analyser le trafic et personnaliser le contenu. Vous pouvez choisir les cookies
                    que vous acceptez.
                  </p>
                </div>

                <button
                  onClick={refuseAll}
                  className="flex-shrink-0 text-neutral-medium hover:text-neutral-dark transition-colors p-1"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customize panel */}
              <AnimatePresence>
                {showCustomize && (
                  <motion.div
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-neutral-gray/50 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-neutral-dark">
                          Param&egrave;tres des cookies
                        </span>
                      </div>

                      {/* Necessary */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-dark">
                            N&eacute;cessaires
                          </p>
                          <p className="text-xs text-neutral-medium">
                            Essentiels au fonctionnement du site
                          </p>
                        </div>
                        <ToggleSwitch enabled={true} onChange={() => {}} disabled={true} />
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-dark">Analytiques</p>
                          <p className="text-xs text-neutral-medium">
                            Nous aident &agrave; comprendre comment vous utilisez le site
                          </p>
                        </div>
                        <ToggleSwitch
                          enabled={preferences.analytics}
                          onChange={v => updatePreference('analytics', v)}
                        />
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-dark">Marketing</p>
                          <p className="text-xs text-neutral-medium">
                            Permettent de personnaliser les publicit&eacute;s
                          </p>
                        </div>
                        <ToggleSwitch
                          enabled={preferences.marketing}
                          onChange={v => updatePreference('marketing', v)}
                        />
                      </div>

                      {/* Preferences */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-dark">
                            Pr&eacute;f&eacute;rences
                          </p>
                          <p className="text-xs text-neutral-medium">
                            M&eacute;morisent vos choix et param&egrave;tres
                          </p>
                        </div>
                        <ToggleSwitch
                          enabled={preferences.preferences}
                          onChange={v => updatePreference('preferences', v)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                <button
                  onClick={() => setShowCustomize(prev => !prev)}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-dark border border-neutral-dark/15 rounded-xl hover:border-neutral-dark/40 transition-colors duration-200 cursor-pointer"
                >
                  {showCustomize ? 'Masquer' : 'Personnaliser'}
                </button>

                <button
                  onClick={showCustomize ? saveCustom : refuseAll}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-dark bg-neutral-dark/[0.05] rounded-xl hover:bg-neutral-dark/10 transition-colors duration-200 cursor-pointer"
                >
                  {showCustomize ? 'Enregistrer mes choix' : 'Refuser'}
                </button>

                <button
                  onClick={acceptAll}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-neutral-dark rounded-xl hover:bg-primary transition-colors duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
