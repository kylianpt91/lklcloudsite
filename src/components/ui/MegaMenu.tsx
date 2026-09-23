import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useBridgeProductGroups } from '@/hooks/useBridge'

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

const groupColors: Record<string, string> = {
  'Hébergement Web': 'bg-blue-500',
  'VPS': 'bg-emerald-500',
  'Applications': 'bg-violet-500',
  'Jeux': 'bg-primary',
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const groups = useBridgeProductGroups()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' as const }}
          className="absolute top-full left-0 right-0 z-50 mt-2"
          role="menu"
          aria-label="Menu produits"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-strong rounded-2xl shadow-xl shadow-black/5 p-8">
              <div className="grid grid-cols-4 gap-8">
                {groups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-medium mb-4">
                      {group.label}
                    </h3>
                    <ul className="space-y-1" role="none">
                      {group.items.map((item) => (
                        <li key={item.href} role="none">
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors duration-200"
                            role="menuitem"
                          >
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${groupColors[group.label] ?? 'bg-neutral-medium'}`}
                              aria-hidden="true"
                            />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
