import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ArrowRight, FileText, Package, Zap, X } from 'lucide-react'
import { useBridgeProducts, useBridgeNavigation } from '@/hooks/useBridge'
import type { ProductCategory, NavItem } from '@/types'

interface CmdKSearchProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  label: string
  href: string
  category: 'Produits' | 'Pages' | 'Actions'
}

const categoryIcons: Record<string, React.ReactNode> = {
  Produits: <Package className="w-4 h-4" aria-hidden="true" />,
  Pages: <FileText className="w-4 h-4" aria-hidden="true" />,
  Actions: <Zap className="w-4 h-4" aria-hidden="true" />,
}

function buildIndex(products: ProductCategory[], navigation: NavItem[]): SearchResult[] {
  const results: SearchResult[] = []

  products.forEach((product) => {
    results.push({
      id: `product-${product.slug}`,
      label: product.name,
      href: `/produits/${product.slug}`,
      category: 'Produits',
    })
  })

  navigation.forEach((nav) => {
    if (!nav.children) {
      results.push({
        id: `page-${nav.href}`,
        label: nav.label,
        href: nav.href,
        category: 'Pages',
      })
    }
  })

  results.push(
    { id: 'action-contact', label: 'Contacter le support', href: '/contact', category: 'Actions' },
    { id: 'action-pricing', label: 'Comparer les tarifs', href: '/tarifs', category: 'Actions' },
  )

  return results
}

export default function CmdKSearch({ isOpen, onClose }: CmdKSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const products = useBridgeProducts()
  const navigation = useBridgeNavigation()

  const allResults = useMemo(() => buildIndex(products, navigation), [products, navigation])

  const filtered = useMemo(() => {
    if (!query.trim()) return allResults
    const lower = query.toLowerCase()
    return allResults.filter((r) => r.label.toLowerCase().includes(lower))
  }, [query, allResults])

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of filtered) {
      const arr = map.get(r.category) ?? []
      arr.push(r)
      map.set(r.category, arr)
    }
    return map
  }, [filtered])

  const flatList = useMemo(() => filtered, [filtered])

  const selectResult = useCallback(
    (result: SearchResult) => {
      onClose()
      setQuery('')
      navigate(result.href)
    },
    [navigate, onClose],
  )

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
      }
    }
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      // Delay to allow animation
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = flatList[selectedIndex]
        if (item) selectResult(item)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatList, selectedIndex, selectResult, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector('[data-selected="true"]')
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    function handleTab(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  let currentFlatIndex = -1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche rapide"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative w-full max-w-xl bg-paper border border-line rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-gray/30">
              <Search className="w-5 h-5 text-neutral-medium shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une page..."
                className="flex-1 bg-transparent text-sm text-neutral-dark placeholder:text-neutral-medium outline-none"
                aria-label="Rechercher"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-neutral-medium" />
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2" role="listbox">
              {flatList.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-medium">
                  Aucun résultat pour &laquo; {query} &raquo;
                </div>
              )}

              {Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category} role="group" aria-label={category}>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-medium">
                    {categoryIcons[category]}
                    {category}
                  </div>
                  {items.map((result) => {
                    currentFlatIndex++
                    const idx = currentFlatIndex
                    const isSelected = idx === selectedIndex

                    return (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        data-selected={isSelected}
                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm transition-colors duration-100 cursor-pointer text-left ${
                          isSelected
                            ? 'bg-primary/10 text-primary'
                            : 'text-neutral-dark hover:bg-black/5'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="font-medium">{result.label}</span>
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-gray/30 text-xs text-neutral-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-light text-[10px] font-mono font-semibold">
                    &uarr;&darr;
                  </kbd>
                  naviguer
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-light text-[10px] font-mono font-semibold">
                    &crarr;
                  </kbd>
                  ouvrir
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-light text-[10px] font-mono font-semibold">
                  esc
                </kbd>
                fermer
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
