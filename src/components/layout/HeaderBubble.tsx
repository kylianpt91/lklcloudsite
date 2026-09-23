import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Search, ArrowRight, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { useBridgeProductGroups, useBridgeAnnonce, useBridgeSettings } from '@/hooks/useBridge'
import type { NavItem } from '@/types'
import CmdKSearch from '@/components/ui/CmdKSearch'
import AnnouncementBar from '@/components/ui/AnnouncementBar'
import DeployModal from '@/components/ui/DeployModal'

export default function HeaderBubble() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [deployModalOpen, setDeployModalOpen] = useState(false)
  const closeDeployModal = useCallback(() => setDeployModalOpen(false), [])
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setMobileExpandedGroup(null)
    setActiveDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleDropdownEnter = useCallback((label: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current)
    setActiveDropdown(label)
  }, [])

  const handleDropdownLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setActiveDropdown(null), 150)
  }, [])

  const productGroups = useBridgeProductGroups()
  const annonce = useBridgeAnnonce()
  const settings = useBridgeSettings()
  const { theme, toggleTheme } = useTheme()

  // Groups (title, color, order) come from the "Navigation" admin page;
  // which gammes land in which group comes from each gamme's own
  // "Catégorie" field — same source of truth as the homepage "Nos
  // solutions" section, the footer and the "Découvrir nos offres" modal.
  const categoryGroups: NavItem[] = productGroups.map((g) => ({
    label: g.label,
    href: '#',
    children: g.items,
  }))

  const navigation: NavItem[] = [
    { label: 'Accueil', href: '/' },
    ...categoryGroups,
    { label: 'Contact', href: 'mailto:support@lklcloud.fr' },
  ]

  const groupColors: Record<string, string> = Object.fromEntries(productGroups.map((g) => [g.label, g.color]))

  return (
    <>
      <div className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/80 backdrop-blur-xl border-b border-hairline'
          : 'bg-transparent border-b border-transparent'
      }`}>
        {announcementVisible && annonce && (
          <AnnouncementBar
            message={annonce.message}
            link={annonce.linkText ? {
              label: annonce.linkText,
              onClick: annonce.linkAction === 'deploy-modal' ? () => setDeployModalOpen(true) : undefined,
              href: annonce.linkAction !== 'deploy-modal' ? annonce.linkAction : undefined
            } : undefined}
            dismissible
            variant="primary"
            onDismiss={() => setAnnouncementVisible(false)}
          />
        )}

        <header className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center relative">
              {/* Logo + Search — left */}
              <div className="flex-1 flex items-center gap-2">
                <Logo size="xl" variant="header" />
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex p-2.5 rounded-full hover:bg-[var(--color-tint-2)] transition-colors text-text-dim hover:text-text cursor-pointer"
                  aria-label="Rechercher (Ctrl+K)"
                  title="Ctrl+K"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop: centered navigation links */}
              <nav className="hidden lg:flex">
                <div className="flex items-center gap-1">
                  {navigation.map((item) => (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => {
                        if (item.children) handleDropdownEnter(item.label)
                      }}
                      onMouseLeave={() => {
                        if (item.children) handleDropdownLeave()
                      }}
                    >
                      {item.children ? (
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-text-dim hover:text-text rounded-lg hover:bg-[var(--color-tint-2)] transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveDropdown((v) => v === item.label ? null : item.label)
                          }}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                      ) : item.href.startsWith('mailto:') ? (
                        <a
                          href={item.href}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-text-dim hover:text-text rounded-lg hover:bg-[var(--color-tint-2)] transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-text-dim hover:text-text rounded-lg hover:bg-[var(--color-tint-2)] transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Desktop CTA — right */}
              <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full hover:bg-[var(--color-tint-2)] transition-colors text-text-dim hover:text-text cursor-pointer"
                  aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                  title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <a
                  href={`${settings.whmcsBaseUrl}/auth/login`}
                  className="px-4 py-2 text-[13px] font-semibold text-text-dim hover:text-text transition-colors whitespace-nowrap"
                >
                  Espace Client
                </a>
                <a
                  href={`${settings.whmcsBaseUrl}/auth/register`}
                  className="px-5 py-2.5 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary-light transition-colors duration-300 whitespace-nowrap"
                >
                  Rejoignez-nous
                </a>
              </div>

              {/* Mobile */}
              <div className="lg:hidden flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-[var(--color-tint-2)] transition-colors"
                  aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                  {theme === 'dark' ? <Sun className="w-[18px] h-[18px] text-text-dim" /> : <Moon className="w-[18px] h-[18px] text-text-dim" />}
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-[var(--color-tint-2)] transition-colors"
                  aria-label="Rechercher"
                >
                  <Search className="w-[18px] h-[18px] text-text-dim" />
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 rounded-full hover:bg-[var(--color-tint-2)] transition-colors text-text"
                  aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden absolute left-0 right-0 top-full bg-canvas/95 backdrop-blur-2xl border-t border-hairline shadow-xl shadow-black/40"
              >
                <div className="max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain">
                  <div className="px-5 pt-4 pb-6 space-y-1">
                    {navigation.map((item) =>
                      item.children ? (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() => setMobileExpandedGroup((v) => v === item.label ? null : item.label)}
                            className="flex items-center justify-between w-full px-3 py-3 text-[15px] font-semibold text-text rounded-xl hover:bg-[var(--color-tint-2)] active:bg-[var(--color-tint-3)] transition-colors cursor-pointer"
                          >
                            {item.label}
                            <ChevronDown
                              className={`w-4 h-4 text-text-faint transition-transform duration-300 ${mobileExpandedGroup === item.label ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileExpandedGroup === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pt-1 pb-2 px-1">
                                  <div className="grid grid-cols-2 gap-1">
                                    {item.children.map((sub) => (
                                      <Link
                                        key={sub.href + sub.label}
                                        to={sub.href}
                                        onClick={() => {
                                          setMobileOpen(false)
                                          setMobileExpandedGroup(null)
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-colors ${
                                          sub.comingSoon
                                            ? 'text-text-faint hover:bg-[var(--color-tint-2)]'
                                            : 'text-text-dim hover:bg-primary/10 hover:text-primary active:bg-primary/15'
                                        }`}
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${sub.comingSoon ? 'bg-text-faint/50' : (groupColors[item.label] ?? 'bg-text-faint')}`}
                                          aria-hidden="true"
                                        />
                                        <span className="truncate">{sub.label.replace('Serveur ', '')}</span>
                                        {sub.comingSoon && (
                                          <span className="ml-1 text-[9px] font-semibold text-primary border border-primary/30 rounded-full px-1.5 py-0.5 leading-none whitespace-nowrap shrink-0">
                                            Bientôt
                                          </span>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : item.href.startsWith('mailto:') ? (
                        <a
                          key={item.label}
                          href={item.href}
                          className="flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-text rounded-xl hover:bg-[var(--color-tint-2)] active:bg-[var(--color-tint-3)] transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-text rounded-xl hover:bg-[var(--color-tint-2)] active:bg-[var(--color-tint-3)] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>

                  {/* CTA area */}
                  <div className="px-5 pb-6 pt-2 border-t border-hairline">
                    <div className="flex flex-col gap-2.5">
                      <a
                        href={`${settings.whmcsBaseUrl}/auth/register`}
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl transition-colors duration-300 active:scale-[0.98]"
                      >
                        Commencer maintenant
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <a
                        href={`${settings.whmcsBaseUrl}/auth/login`}
                        className="flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-text-dim rounded-xl border border-hairline hover:bg-[var(--color-tint-2)] transition-colors active:scale-[0.98]"
                      >
                        Espace Client
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Dropdown for active category */}
        <AnimatePresence>
          {activeDropdown && (() => {
            const activeItem = navigation.find((n) => n.label === activeDropdown)
            if (!activeItem?.children) return null
            return (
              <motion.div
                key={activeDropdown}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' as const }}
                className="absolute left-0 right-0 z-[49] pt-2"
                role="menu"
                aria-label={`Menu ${activeDropdown}`}
                onMouseEnter={() => handleDropdownEnter(activeDropdown)}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="max-w-2xl mx-auto px-4">
                  <div className="bg-surface border border-hairline rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-6">
                    <h3 className="eyebrow text-text-faint mb-3">
                      {activeDropdown}
                    </h3>
                    <ul className="grid grid-cols-2 gap-1" role="none">
                      {activeItem.children.map((sub) => (
                        <li key={sub.href + sub.label} role="none">
                          <Link
                            to={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                              sub.comingSoon
                                ? 'text-text-faint hover:bg-[var(--color-tint-2)]'
                                : 'text-text hover:bg-primary/10 hover:text-primary'
                            }`}
                            role="menuitem"
                          >
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${sub.comingSoon ? 'bg-text-faint/50' : (groupColors[activeDropdown] ?? 'bg-text-faint')}`}
                              aria-hidden="true"
                            />
                            {sub.label}
                            {sub.comingSoon && (
                              <span className={`${activeDropdown === 'Serveurs Games' ? 'ml-auto' : 'ml-1.5'} text-[10px] font-semibold text-primary border border-primary/30 rounded-full px-2 py-0.5 leading-none whitespace-nowrap`}>
                                Prochainement
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>

      <CmdKSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <DeployModal open={deployModalOpen} onClose={closeDeployModal} />
    </>
  )
}
