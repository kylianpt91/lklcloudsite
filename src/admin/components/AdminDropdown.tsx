import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface AdminDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  searchable?: boolean
  error?: string
  required?: boolean
  placeholder?: string
}

export function AdminDropdown({ label, value, onChange, options, searchable = false, error, required, placeholder }: AdminDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.value === value)

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search when opened
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
    if (open) {
      const idx = filtered.findIndex(o => o.value === value)
      setHighlightIndex(idx >= 0 ? idx : 0)
    }
  }, [open, searchable, filtered, value])

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightIndex < 0 || !listRef.current) return
    const el = listRef.current.children[highlightIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex, open])

  const handleSelect = useCallback((val: string) => {
    onChange(val)
    setOpen(false)
    setSearch('')
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex(prev => (prev + 1) % filtered.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex(prev => (prev - 1 + filtered.length) % filtered.length)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          handleSelect(filtered[highlightIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setSearch('')
        break
    }
  }, [open, filtered, highlightIndex, handleSelect])

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[var(--admin-text-secondary)]">
        {label}
        {required && <span className="text-[var(--admin-primary)] ml-0.5">*</span>}
      </label>

      <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className={`w-full flex items-center justify-between rounded-xl border bg-[var(--admin-input-bg)] px-4 py-2.5 text-sm outline-none transition-all duration-200 cursor-pointer ${
            open
              ? 'border-[var(--admin-primary)]/50 ring-1 ring-[var(--admin-input-focus)]'
              : 'border-[var(--admin-input-border)] hover:border-[var(--admin-border-strong)]'
          }`}
        >
          <span className={selected ? 'text-[var(--admin-text-primary)]' : 'text-[var(--admin-text-muted)]'}>
            {selected?.label ?? placeholder ?? 'Sélectionner...'}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--admin-text-muted)]"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        {/* Popover */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1.5 w-full admin-glass-strong rounded-xl shadow-lg overflow-hidden"
            >
              {/* Search */}
              {searchable && (
                <div className="px-3 pt-3 pb-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={e => { setSearch(e.target.value); setHighlightIndex(0) }}
                      placeholder="Rechercher..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none focus:border-[var(--admin-primary)]/50"
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              <div ref={listRef} className="max-h-56 overflow-y-auto py-1.5">
                {filtered.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--admin-text-muted)] text-center">Aucun résultat</div>
                ) : (
                  filtered.map((option, i) => {
                    const isSelected = option.value === value
                    const isHighlighted = i === highlightIndex

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        onMouseEnter={() => setHighlightIndex(i)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-100 ${
                          isHighlighted
                            ? 'bg-[var(--admin-surface-hover)] text-[var(--admin-text-primary)]'
                            : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)]'
                        } ${isSelected ? 'font-semibold text-[var(--admin-primary)] !text-[var(--admin-primary)]' : ''}`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={14} className="text-[var(--admin-primary)] shrink-0" />}
                      </button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-[var(--admin-danger)] font-medium">{error}</p>}
    </div>
  )
}
