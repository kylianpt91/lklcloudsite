import { Link, useLocation } from 'react-router-dom'
import { Home, Package, Headset, User } from 'lucide-react'

interface Tab {
  label: string
  href: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { label: 'Accueil', href: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Produits', href: '/produits', icon: <Package className="w-5 h-5" /> },
  { label: 'Support', href: '/contact', icon: <Headset className="w-5 h-5" /> },
  { label: 'Compte', href: '/compte', icon: <User className="w-5 h-5" /> },
]

export default function MobileTabBar() {
  const location = useLocation()

  function isActive(href: string) {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-strong border-t border-neutral-gray/30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href)

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200 min-w-[60px] ${
                active ? 'text-primary' : 'text-neutral-medium'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
