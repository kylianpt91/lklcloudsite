import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { getNavigation } from '@/lib/bridge'
import CmdKSearch from '@/components/ui/CmdKSearch'
import AnnouncementBar from '@/components/ui/AnnouncementBar'
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY = useRef(0)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setMobileExpandedGroup(null)
    setActiveDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY

      setScrolled(currentScrollY > 20)

      // Hide header on scroll down, show on scroll up
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderVisible(false)
        setActiveDropdown(null) // Close dropdown when hiding header
      }

      lastScrollY.current = currentScrollY
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

  const groupColors: Record<string, string> = {
    'Serveur Games': 'bg-primary',
    'Web Hosting': 'bg-blue-500',
    'Cloud Hosting': 'bg-emerald-500',
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar
          message="Offre de lancement : -20% sur toutes nos offres avec le code LKLCLOUD2026 jusqu'au 28 février 2026"
          link={{ label: 'En profiter', href: '/produits/vps-linux' }}
          dismissible
          variant="primary"
          onDismiss={() => setAnnouncementVisible(false)}
        />

        <header
          className={`transition-all duration-300 ${
            scrolled
              ? 'py-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm shadow-black/5'
              : 'py-4'
          } ${
            !headerVisible ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center relative">
              {/* Logo — left */}
              <div className="flex-1">
                <Logo size={scrolled ? 'lg' : 'xl'} variant="header" />
              </div>

              {/* Desktop: glass badge with navigation links — absolute center */}
              <nav className="hidden lg:flex absolute left-1/2 -translate-x-[52%]">
                <div className="flex items-center gap-0.5 bg-white/90 backdrop-blur-xl rounded-full px-1.5 py-1 border border-neutral-200/40">
                  {getNavigation().map((item) => (
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
                          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-neutral-dark/70 hover:text-neutral-dark rounded-full hover:bg-black/5 transition-colors cursor-pointer"
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
                          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-neutral-dark/70 hover:text-neutral-dark rounded-full hover:bg-black/5 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-neutral-dark/70 hover:text-neutral-dark rounded-full hover:bg-black/5 transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Desktop CTA — right */}
              <div className="hidden lg:flex flex-1 justify-end items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-black/5 transition-colors text-neutral-dark/50 hover:text-neutral-dark cursor-pointer"
                  aria-label="Rechercher (Ctrl+K)"
                  title="Ctrl+K"
                >
                  <Search className="w-4 h-4" />
                </button>

                <a
                  href="https://client.lklcloud.fr/clientarea.php"
                  className="px-5 py-2 text-[13px] font-semibold text-neutral-dark/70 hover:text-neutral-dark rounded-full hover:bg-black/5 transition-all duration-300"
                >
                  Espace Client
                </a>
                <Link
                  to="https://client.lklcloud.fr/register.php"
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-[13px] font-bold rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-[0.97]"
                >
                  Rejoignez-nous
                </Link>
              </div>

              {/* Mobile */}
              <div className="lg:hidden flex items-center gap-1">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Rechercher"
                >
                  <Search className="w-[18px] h-[18px] text-neutral-dark/70" />
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu — Modern full-width overlay */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-2xl border-t border-neutral-gray/10 shadow-xl shadow-black/5"
              >
                <div className="max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain">
                  <div className="px-5 pt-4 pb-6 space-y-1">
                    {getNavigation().map((item) =>
                      item.children ? (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() => setMobileExpandedGroup((v) => v === item.label ? null : item.label)}
                            className="flex items-center justify-between w-full px-3 py-3 text-[15px] font-semibold text-neutral-dark rounded-xl hover:bg-neutral-light/60 active:bg-neutral-light transition-colors cursor-pointer"
                          >
                            {item.label}
                            <ChevronDown
                              className={`w-4 h-4 text-neutral-medium transition-transform duration-300 ${mobileExpandedGroup === item.label ? 'rotate-180' : ''}`}
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
                                        key={sub.href}
                                        to={sub.href}
                                        onClick={() => {
                                          setMobileOpen(false)
                                          setMobileExpandedGroup(null)
                                        }}
                                        className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium text-neutral-dark/80 rounded-xl hover:bg-primary/5 hover:text-primary active:bg-primary/10 transition-colors"
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${groupColors[item.label] ?? 'bg-neutral-medium'}`}
                                          aria-hidden="true"
                                        />
                                        {sub.label.replace('Serveur ', '')}
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
                          className="flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-neutral-dark rounded-xl hover:bg-neutral-light/60 active:bg-neutral-light transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-neutral-dark rounded-xl hover:bg-neutral-light/60 active:bg-neutral-light transition-colors"
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>

                  {/* CTA area */}
                  <div className="px-5 pb-6 pt-2 border-t border-neutral-gray/10">
                    <div className="flex flex-col gap-2.5">
                      <a
                        href="https://client.lklcloud.fr/register.php"
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
                      >
                        Commencer maintenant
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <a
                        href="https://client.lklcloud.fr/clientarea.php"
                        className="flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-neutral-dark/70 rounded-xl border border-neutral-gray/20 hover:bg-neutral-light/40 transition-colors active:scale-[0.98]"
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
      </div>

      {/* Dropdown for active category */}
      <AnimatePresence>
        {activeDropdown && (() => {
          const activeItem = getNavigation().find((n) => n.label === activeDropdown)
          if (!activeItem?.children) return null
          return (
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className="fixed left-0 right-0 z-[49] pt-2"
              style={{ top: announcementVisible ? '100px' : '64px' }}
              role="menu"
              aria-label={`Menu ${activeDropdown}`}
              onMouseEnter={() => handleDropdownEnter(activeDropdown)}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="max-w-2xl mx-auto px-4">
                <div className="glass-strong rounded-2xl shadow-xl shadow-black/5 p-6 ring-1 ring-white/20 ring-offset-1 ring-offset-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-medium mb-3">
                    {activeDropdown}
                  </h3>
                  <ul className="grid grid-cols-2 gap-1" role="none">
                    {activeItem.children.map((sub) => (
                      <li key={sub.href} role="none">
                        <Link
                          to={sub.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors duration-200"
                          role="menuitem"
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${groupColors[activeDropdown] ?? 'bg-neutral-medium'}`}
                            aria-hidden="true"
                          />
                          {sub.label}
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

      <CmdKSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
