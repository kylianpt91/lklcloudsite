import { useState, useCallback, useMemo } from 'react'

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleOne = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelected(prev => {
      if (prev.size === items.length) return new Set()
      return new Set(items.map(i => i.id))
    })
  }, [items])

  const isSelected = useCallback((id: string) => selected.has(id), [selected])

  const clearSelection = useCallback(() => setSelected(new Set()), [])

  const selectedCount = selected.size
  const allSelected = items.length > 0 && selected.size === items.length

  const selectedItems = useMemo(
    () => items.filter(i => selected.has(i.id)),
    [items, selected],
  )

  return { selected, selectedItems, toggleOne, toggleAll, isSelected, clearSelection, selectedCount, allSelected }
}
