import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Layers, Package, HelpCircle, Settings,
  Menu, X, LogOut, Navigation2, Megaphone, Users, Layout,
  Shield, History, Sun, Moon, Search, ChevronLeft, ChevronRight,
  ShieldCheck, UserCircle, CalendarClock, Globe,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { signOut } from '../lib/auth'
import { useAdminTheme } from '../lib/theme'
import { useAdmin } from '../lib/context'
import { ToastContainer } from '../components/ToastContainer'
import { AdminCommandPalette } from '../components/AdminCommandPalette'
import { NotificationBell } from '../components/NotificationBell'
import { useSchedulePoller } from '../hooks/useSchedulePoller'
import '../admin.css'

// ── Navigation structure ─────────────────────────────────────────────

interface NavSection {
  label: string
  items: NavItemDef[]
}

interface NavItemDef {
  to: string
  icon: typeof LayoutDashboard
  label: string
  end?: boolean
}

const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { to: '/apps/management', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/apps/management/gammes', icon: Layers, label: 'Gammes' },
      { to: '/apps/management/offres', icon: Package, label: 'Offres' },
      { to: '/apps/management/faq', icon: HelpCircle, label: 'FAQ Gammes' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { to: '/apps/management/navigation', icon: Navigation2, label: 'Navigation' },
      { to: '/apps/management/annonces', icon: Megaphone, label: 'Annonces' },
      { to: '/apps/management/equipe', icon: Users, label: 'Equipe' },
      { to: '/apps/management/hero', icon: Layout, label: 'Hero' },
      { to: '/apps/management/planning', icon: CalendarClock, label: 'Planning' },
      { to: '/apps/management/seo', icon: Globe, label: 'SEO' },
    ],
  },
  {
    label: 'Système',
    items: [
      { to: '/apps/management/maintenance', icon: Shield, label: 'Maintenance' },
      { to: '/apps/management/historique', icon: History, label: 'Historique' },
      { to: '/apps/management/parametres', icon: Settings, label: 'Paramètres' },
      { to: '/apps/management/administration', icon: ShieldCheck, label: 'Administration' },
    ],
  },
]

const pageTitles: Record<string, string> = {
  '/apps/management': 'Dashboard',
  '/apps/management/gammes': "Gammes d'hébergement",
  '/apps/management/offres': "Offres d'hébergement",
  '/apps/management/faq': 'FAQ Gammes',
  '/apps/management/navigation': 'Navigation',
  '/apps/management/annonces': 'Annonces',
  '/apps/management/equipe': 'Equipe',
  '/apps/management/hero': 'Configuration Hero',
  '/apps/management/maintenance': 'Mode Maintenance',
  '/apps/management/historique': 'Historique',
  '/apps/management/parametres': 'Paramètres',
  '/apps/management/administration': 'Administration',
  '/apps/management/profil': 'Profil',
  '/apps/management/planning': 'Planning',
  '/apps/management/seo': 'SEO',
}

const SIDEBAR_KEY = 'lkl_admin_sidebar'

// ── Sidebar animation variants ───────────────────────────────────────

const mobileSidebarVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

// ── Main component ───────────────────────────────────────────────────

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useAdminTheme()
  const { currentUser, adminRoles } = useAdmin()
  useSchedulePoller()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_KEY) === 'collapsed'
  })
  const [cmdOpen, setCmdOpen] = useState(false)

  const pageTitle = pageTitles[location.pathname]
    ?? (location.pathname.startsWith('/apps/management/utilisateur/') ? 'Profil utilisateur' : 'Admin')

  // Document title
  useEffect(() => {
    document.title = `LKLCloud Management — ${pageTitle}`
  }, [pageTitle])

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded')
  }, [collapsed])

  // Global keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      navigate('/apps/management/auth')
    } catch {
      // silently fail
    }
  }, [navigate])

  // Build breadcrumbs
  const breadcrumbs = (() => {
    const parts = [{ label: 'Admin', href: '/apps/management' }]
    if (location.pathname !== '/apps/management') {
      parts.push({ label: pageTitle, href: location.pathname })
    }
    return parts
  })()

  return (
    <div className="admin-root flex h-screen overflow-hidden" data-admin-theme={isDark ? 'dark' : 'light'}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[var(--admin-overlay)] backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex h-full bg-[var(--admin-sidebar-bg)] backdrop-blur-xl border-r border-[var(--admin-border)] flex-col overflow-hidden shrink-0"
      >
        <SidebarContent
          onClose={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
          showClose={false}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(prev => !prev)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          currentUser={currentUser}
          roleName={adminRoles.find(r => r.id === currentUser?.roleId)?.name}
        />
      </motion.aside>

      {/* ── Mobile Sidebar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            variants={mobileSidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed lg:hidden top-0 left-0 z-50 h-screen w-64 bg-[var(--admin-sidebar-bg)] backdrop-blur-xl border-r border-[var(--admin-border)] flex flex-col"
          >
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
              showClose
              collapsed={false}
              onToggleCollapse={() => {}}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              currentUser={currentUser}
              roleName={adminRoles.find(r => r.id === currentUser?.roleId)?.name}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[var(--admin-border)] bg-[var(--admin-topbar-bg)] backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[var(--admin-text-muted)]">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-[var(--admin-text-primary)]">{crumb.label}</span>
                  ) : (
                    <NavLink
                      to={crumb.href}
                      className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] transition-colors"
                    >
                      {crumb.label}
                    </NavLink>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:border-[var(--admin-border-strong)] transition-all text-sm"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Rechercher</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-[var(--admin-surface-strong)] border border-[var(--admin-border)] font-mono ml-1">⌘K</kbd>
            </motion.button>

            {/* Notification bell */}
            <NotificationBell />

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface)] transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* User avatar — links to profile */}
            <NavLink to="/apps/management/profil" className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-[var(--admin-surface)] transition-all group">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.displayName} className="w-8 h-8 rounded-full object-cover border border-[var(--admin-border)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-dark)] flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {currentUser?.displayName?.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() ?? '?'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[var(--admin-text-primary)] leading-tight group-hover:text-[var(--admin-primary)] transition-colors">{currentUser?.displayName ?? 'Chargement...'}</p>
                <p className="text-[10px] text-[var(--admin-text-muted)] leading-tight">{adminRoles.find(r => r.id === currentUser?.roleId)?.name ?? ''}</p>
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Overlays */}
      <ToastContainer />
      <AdminCommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}

// ── Sidebar Content ──────────────────────────────────────────────────

interface SidebarContentProps {
  onClose: () => void
  onSignOut: () => void
  showClose: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  isDark: boolean
  onToggleTheme: () => void
  currentUser: { displayName: string; avatar?: string } | null
  roleName?: string
}

function SidebarContent({
  onClose,
  onSignOut,
  showClose,
  collapsed,
  onToggleCollapse,
  isDark,
  onToggleTheme,
  currentUser,
  roleName,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--admin-border)] shrink-0">
        <img
          src={isDark ? 'https://lklcloud.fr/images/logos/logo_w_color_no_cloud.png' : 'https://lklcloud.fr/images/logos/logo_b_no_cloud.png'}
          alt="LKL Cloud"
          className="h-9 w-auto shrink-0"
        />
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-bold text-[var(--admin-text-primary)] tracking-tight">LKL CLOUD</p>
            <p className="text-[10px] text-[var(--admin-text-muted)] font-semibold uppercase tracking-wider">Web Management</p>
          </motion.div>
        )}
        {showClose && (
          <button className="ml-auto p-1.5 text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] transition-colors" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 min-h-0 py-2 px-2 overflow-y-auto space-y-0.5">
        {navSections.map((section, si) => (
          <div key={section.label}>
            {/* Section label */}
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: si * 0.05 }}
                className="admin-nav-section"
              >
                {section.label}
              </motion.p>
            )}
            {collapsed && si > 0 && (
              <div className="mx-3 my-2 border-t border-[var(--admin-border)]" />
            )}

            {/* Section items */}
            {section.items.map((item, ii) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (si * section.items.length + ii) * 0.02, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `admin-nav-link flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      collapsed ? 'justify-center px-2 py-2 mx-1' : 'px-3 py-[7px]'
                    } ${
                      isActive
                        ? 'active bg-[var(--admin-primary-surface)] text-[var(--admin-primary)]'
                        : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)]'
                    }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </motion.div>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-2 border-t border-[var(--admin-border)] shrink-0 space-y-0.5">
        {/* Connected as */}
        {currentUser && (
          <NavLink
            to="/apps/management/profil"
            onClick={onClose}
            title={collapsed ? `${currentUser.displayName} — ${roleName ?? ''}` : undefined}
            className={`flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:bg-[var(--admin-surface-hover)] ${
              collapsed ? 'justify-center px-2 py-2 mx-1' : 'px-3 py-2'
            }`}
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.displayName} className="w-7 h-7 rounded-full object-cover border border-[var(--admin-border)] shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--admin-primary)]/20 to-[var(--admin-primary-dark)]/10 border border-[var(--admin-primary)]/20 flex items-center justify-center shrink-0">
                <UserCircle size={14} className="text-[var(--admin-primary)]" />
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--admin-text-primary)] truncate leading-tight">{currentUser.displayName}</p>
                {roleName && <p className="text-[10px] text-[var(--admin-text-muted)] truncate leading-tight">{roleName}</p>}
              </div>
            )}
          </NavLink>
        )}

        {/* Theme toggle (in sidebar) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleTheme}
          title={isDark ? 'Mode clair' : 'Mode sombre'}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)] transition-all duration-200 ${
            collapsed ? 'justify-center px-2 py-2 mx-1' : 'px-3 py-[7px]'
          }`}
        >
          {isDark ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
          {!collapsed && <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>}
        </motion.button>

        {/* Collapse toggle (desktop only) */}
        {!showClose && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleCollapse}
            title={collapsed ? 'Développer' : 'Réduire'}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-hover)] transition-all duration-200 ${
              collapsed ? 'justify-center px-2 py-2 mx-1' : 'px-3 py-[7px]'
            }`}
          >
            {collapsed ? <ChevronRight size={16} className="shrink-0" /> : <ChevronLeft size={16} className="shrink-0" />}
            {!collapsed && <span>Réduire</span>}
          </motion.button>
        )}

        {/* Sign out */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSignOut}
          title="Déconnexion"
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all duration-200 ${
            collapsed ? 'justify-center px-2 py-2 mx-1' : 'px-3 py-[7px]'
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </motion.button>
      </div>
    </>
  )
}
