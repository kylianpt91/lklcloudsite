const STORAGE_PREFIX = 'lkl_ab_'

/**
 * Gets or assigns a variant for a given experiment.
 * The assignment is persisted in localStorage so the same user
 * always sees the same variant.
 */
export function getVariant(experimentId: string, variants: string[]): string {
  if (variants.length === 0) {
    throw new Error(`No variants provided for experiment "${experimentId}"`)
  }

  const storageKey = `${STORAGE_PREFIX}${experimentId}`

  // Check for existing assignment
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null && variants.includes(stored)) {
      return stored
    }
  } catch {
    // localStorage not available
  }

  // Assign a random variant
  const randomIndex = Math.floor(Math.random() * variants.length)
  const assigned = variants[randomIndex]

  // Persist the assignment
  try {
    localStorage.setItem(storageKey, assigned)
  } catch {
    // localStorage not available
  }

  return assigned
}

/**
 * Tracks an event for a given experiment.
 * Currently logs to console as a placeholder for analytics integration.
 */
export function trackEvent(experimentId: string, eventName: string): void {
  const storageKey = `${STORAGE_PREFIX}${experimentId}`
  let variant = 'unknown'

  try {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      variant = stored
    }
  } catch {
    // localStorage not available
  }

  if (import.meta.env.DEV) {
    console.log(
      `[A/B Test] Experiment: ${experimentId} | Variant: ${variant} | Event: ${eventName}`,
    )
  }
}
