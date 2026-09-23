import { useState, useCallback } from 'react'

function getStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const item = sessionStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item) as T
    }
  } catch {
    // Invalid JSON or sessionStorage not available
  }
  return initialValue
}

export function useSessionPersistence<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => T] {
  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue(key, initialValue))

  const setValue = useCallback(
    (value: T): T => {
      setStoredValue(value)
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch {
        // sessionStorage not available or quota exceeded
      }
      return value
    },
    [key],
  )

  return [storedValue, setValue]
}
