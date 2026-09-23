import { useState, useCallback } from 'react'

function getStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item) as T
    }
  } catch {
    // Invalid JSON or localStorage not available
  }
  return initialValue
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue(key, initialValue))

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const nextValue = value instanceof Function ? value(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // localStorage not available or quota exceeded
        }
        return nextValue
      })
    },
    [key],
  )

  return [storedValue, setValue]
}
