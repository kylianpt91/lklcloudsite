import { useEffect, useRef } from 'react'

type ShortcutMap = Record<string, () => void>

interface ParsedShortcut {
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  key: string
}

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.toLowerCase().split('+')
  const key = parts[parts.length - 1]
  return {
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta'),
    key,
  }
}

function matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const eventKey = event.key.toLowerCase()

  if (eventKey !== parsed.key) return false
  if (event.ctrlKey !== parsed.ctrl) return false
  if (event.shiftKey !== parsed.shift) return false
  if (event.altKey !== parsed.alt) return false
  if (event.metaKey !== parsed.meta) return false

  return true
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  useEffect(() => {
    const parsedEntries: Array<{ parsed: ParsedShortcut; key: string }> = Object.keys(
      shortcutsRef.current,
    ).map(shortcutKey => ({
      parsed: parseShortcut(shortcutKey),
      key: shortcutKey,
    }))

    function handleKeyDown(event: KeyboardEvent) {
      for (const entry of parsedEntries) {
        if (matchesShortcut(event, entry.parsed)) {
          event.preventDefault()
          shortcutsRef.current[entry.key]()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
