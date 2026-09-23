import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../lib/context'
import { AdminBadge } from './AdminBadge'
import {
  Search, LayoutDashboard, Layers, Package, HelpCircle,
  Settings, Navigation2, Megaphone, Users, Layout, Shield,
  History, X, ArrowRight, Plus, MessageSquare, UserCircle, CalendarClock, Globe,
} from 'lucide-react'
import type { ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────

interface CommandItem {
  id: string
  label: string
  href: string
  icon: ReactNode
  section: string
  subtitle?: string
  badge?: { label: string; variant: 'orange' | 'info' | 'success' | 'warning' | 'neutral' }
}

// ── Static pages & actions ─────────────────────────────────────

const pages: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/apps/management', icon: <LayoutDashboard size={16} />, section: 'Pages' },
  { id: 'gammes', label: 'Gammes', href: '/apps/management/gammes', icon: <Layers size={16} />, section: 'Pages' },
  { id: 'offres', label: 'Offres', href: '/apps/management/offres', icon: <Package size={16} />, section: 'Pages' },
  { id: 'faq', label: 'FAQ Gammes', href: '/apps/management/faq', icon: <HelpCircle size={16} />, section: 'Pages' },
  { id: 'navigation', label: 'Navigation', href: '/apps/management/navigation', icon: <Navigation2 size={16} />, section: 'Pages' },
  { id: 'annonces', label: 'Annonces', href: '/apps/management/annonces', icon: <Megaphone size={16} />, section: 'Pages' },
  { id: 'equipe', label: 'Equipe', href: '/apps/management/equipe', icon: <Users size={16} />, section: 'Pages' },
  { id: 'hero', label: 'Configuration Hero', href: '/apps/management/hero', icon: <Layout size={16} />, section: 'Pages' },
  { id: 'maintenance', label: 'Maintenance', href: '/apps/management/maintenance', icon: <Shield size={16} />, section: 'Pages' },
  { id: 'historique', label: 'Historique', href: '/apps/management/historique', icon: <History size={16} />, section: 'Pages' },
  { id: 'parametres', label: 'Paramètres', href: '/apps/management/parametres', icon: <Settings size={16} />, section: 'Pages' },
  { id: 'planning', label: 'Planning', href: '/apps/management/planning', icon: <CalendarClock size={16} />, section: 'Pages' },
  { id: 'seo', label: 'SEO', href: '/apps/management/seo', icon: <Globe size={16} />, section: 'Pages' },
]

const actions: CommandItem[] = [
  { id: 'new-gamme', label: 'Nouvelle gamme', href: '/apps/management/gammes', icon: <Plus size={16} />, section: 'Actions rapides' },
  { id: 'new-offre', label: 'Nouvelle offre', href: '/apps/management/offres', icon: <Plus size={16} />, section: 'Actions rapides' },
  { id: 'new-annonce', label: 'Nouvelle annonce', href: '/apps/management/annonces', icon: <Plus size={16} />, section: 'Actions rapides' },
]

const staticItems = [...pages, ...actions]

// ── Highlight helper ──────────────────────────────────────────

function highlightMatch(text: string, query: string): ReactNode {
  if (!query.trim()) return text
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--admin-primary)]/20 text-[var(--admin-primary)] font-semibold rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function truncate(text: string, maxLen = 80): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '…'
}

// ── Component ─────────────────────────────────────────────────

interface AdminCommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function AdminCommandPalette({ open, onClose }: AdminCommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { gammes, offres, faq, team, annonces, navItems } = useAdmin()

  // Build entity search results dynamically from admin data
  const entityResults = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const results: CommandItem[] = []

    // Search gammes
    for (const g of gammes) {
      const fields = [g.nom, g.slug, g.description, g.heroTitle]
      const match = fields.find(f => f?.toLowerCase().includes(q))
      if (match) {
        results.push({
          id: `gamme-${g.id}`,
          label: g.nom,
          subtitle: truncate(match !== g.nom ? match : g.description),
          href: '/apps/management/gammes',
          icon: <Layers size={16} />,
          section: 'Gammes',
          badge: { label: g.actif ? 'Actif' : 'Inactif', variant: g.actif ? 'success' : 'neutral' },
        })
      }
    }

    // Search offres
    for (const o of offres) {
      const fields = [o.nom, o.slug, o.tagline, o.description, ...o.features]
      const match = fields.find(f => f?.toLowerCase().includes(q))
      if (match) {
        const gammeName = gammes.find(g => g.id === o.gammeId)?.nom
        results.push({
          id: `offre-${o.id}`,
          label: o.nom,
          subtitle: truncate(gammeName ? `${gammeName} — ${match !== o.nom ? match : o.tagline}` : (match !== o.nom ? match : o.tagline)),
          href: '/apps/management/offres',
          icon: <Package size={16} />,
          section: 'Offres',
          badge: { label: o.statut === 'actif' ? 'Actif' : o.statut === 'brouillon' ? 'Brouillon' : 'Archivé', variant: o.statut === 'actif' ? 'success' : o.statut === 'brouillon' ? 'warning' : 'neutral' },
        })
      }
    }

    // Search FAQ
    for (const f of faq) {
      const fields = [f.question, f.reponse]
      const match = fields.find(v => v?.toLowerCase().includes(q))
      if (match) {
        results.push({
          id: `faq-${f.id}`,
          label: truncate(f.question, 60),
          subtitle: truncate(match !== f.question ? match : f.reponse),
          href: `/apps/management/faq?gamme=${f.gammeId}`,
          icon: <MessageSquare size={16} />,
          section: 'FAQ',
        })
      }
    }

    // Search team
    for (const m of team) {
      const fields = [m.name, m.role, m.bio]
      const match = fields.find(f => f?.toLowerCase().includes(q))
      if (match) {
        results.push({
          id: `team-${m.id}`,
          label: m.name,
          subtitle: match !== m.name ? truncate(match) : m.role,
          href: '/apps/management/equipe',
          icon: <UserCircle size={16} />,
          section: 'Équipe',
        })
      }
    }

    // Search annonces
    for (const a of annonces) {
      if (a.message.toLowerCase().includes(q)) {
        results.push({
          id: `annonce-${a.id}`,
          label: truncate(a.message, 60),
          href: '/apps/management/annonces',
          icon: <Megaphone size={16} />,
          section: 'Annonces',
          badge: { label: a.actif ? 'Actif' : 'Inactif', variant: a.actif ? 'success' : 'neutral' },
        })
      }
    }

    // Search nav items
    for (const n of navItems) {
      if (n.label.toLowerCase().includes(q)) {
        results.push({
          id: `nav-${n.id}`,
          label: n.label,
          subtitle: n.href,
          href: '/apps/management/navigation',
          icon: <Navigation2 size={16} />,
          section: 'Navigation',
        })
      }
    }

    return results
  }, [query, gammes, offres, faq, team, annonces, navItems])

  // Combine: static filtered + entity results
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return staticItems
    const staticFiltered = staticItems.filter(item =>
      item.label.toLowerCase().includes(q) || item.section.toLowerCase().includes(q),
    )
    return [...staticFiltered, ...entityResults]
  }, [query, entityResults])

  const sections = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    for (const item of filtered) {
      const list = map.get(item.section) ?? []
      list.push(item)
      map.set(item.section, list)
    }
    return Array.from(map.entries())
  }, [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onClose()
      navigate(item.href)
    },
    [navigate, onClose],
  )

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) handleSelect(filtered[selectedIndex])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIndex, handleSelect, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const q = query.trim()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-[var(--admin-overlay)] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--admin-border-strong)] bg-[var(--admin-bg-elevated)] shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--admin-border)]">
              <Search size={18} className="text-[var(--admin-text-muted)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher pages, offres, FAQ, membres..."
                className="flex-1 bg-transparent text-sm text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none"
              />
              {query && (
                <span className="text-[10px] text-[var(--admin-text-muted)] whitespace-nowrap">
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
              <button onClick={onClose} className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-[var(--admin-text-muted)] text-center py-8">Aucun résultat pour &laquo; {query} &raquo;</p>
              ) : (
                sections.map(([section, items]) => (
                  <div key={section}>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                      {section}
                    </p>
                    {items.map(item => {
                      const globalIdx = filtered.indexOf(item)
                      const isActive = globalIdx === selectedIndex
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                            isActive
                              ? 'bg-[var(--admin-primary-surface)] text-[var(--admin-primary)]'
                              : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)]'
                          }`}
                        >
                          <span className={`shrink-0 ${isActive ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-text-muted)]'}`}>
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="font-medium block truncate">
                              {q ? highlightMatch(item.label, q) : item.label}
                            </span>
                            {item.subtitle && (
                              <span className="text-xs text-[var(--admin-text-muted)] block truncate">
                                {q ? highlightMatch(item.subtitle, q) : item.subtitle}
                              </span>
                            )}
                          </div>
                          {item.badge && (
                            <AdminBadge variant={item.badge.variant}>{item.badge.label}</AdminBadge>
                          )}
                          {isActive && <ArrowRight size={14} className="text-[var(--admin-primary)] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--admin-border)] text-[10px] text-[var(--admin-text-muted)]">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--admin-surface)] border border-[var(--admin-border)] font-mono">↑↓</kbd>
                <span>naviguer</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--admin-surface)] border border-[var(--admin-border)] font-mono">↵</kbd>
                <span>ouvrir</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--admin-surface)] border border-[var(--admin-border)] font-mono">esc</kbd>
                <span>fermer</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
