import { motion } from 'framer-motion'
import {
  Layers, Package, HelpCircle, Navigation2, Megaphone,
  Users, Layout, Shield, Settings, Bell, Globe,
} from 'lucide-react'
import { useAdmin } from '../lib/context'
import type { AdminNotification } from '../lib/types'

const entityIcons: Record<string, typeof Layers> = {
  gamme: Layers,
  offre: Package,
  faq: HelpCircle,
  navigation: Navigation2,
  annonce: Megaphone,
  equipe: Users,
  hero: Layout,
  maintenance: Shield,
  settings: Settings,
  seo: Globe,
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function NotificationItem({ notification, onRead }: { notification: AdminNotification; onRead: (id: string) => void }) {
  const Icon = (notification.entityType && entityIcons[notification.entityType]) ?? Bell
  const isUnread = !notification.read

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => { if (isUnread) onRead(notification.id) }}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ${
        isUnread
          ? 'bg-[var(--admin-primary-surface)]/50 hover:bg-[var(--admin-primary-surface)]'
          : 'hover:bg-[var(--admin-surface-hover)]'
      }`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUnread ? 'bg-[var(--admin-primary)]/10' : 'bg-[var(--admin-surface)]'
      }`}>
        <Icon size={14} className={isUnread ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-text-muted)]'} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-tight ${isUnread ? 'font-semibold text-[var(--admin-text-primary)]' : 'font-medium text-[var(--admin-text-secondary)]'}`}>
          {notification.title}
        </p>
        <p className="text-[11px] text-[var(--admin-text-muted)] truncate mt-0.5">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[var(--admin-text-muted)]">
            {formatRelative(notification.createdAt)}
          </span>
          {notification.createdByName && (
            <>
              <span className="text-[10px] text-[var(--admin-text-muted)]">·</span>
              <span className="text-[10px] text-[var(--admin-text-muted)]">
                {notification.createdByName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-[var(--admin-primary)] shrink-0 mt-2" />
      )}
    </motion.button>
  )
}

interface ActivityFeedProps {
  onClose?: () => void
}

export function ActivityFeed({ onClose: _onClose }: ActivityFeedProps) {
  const { notifications, markNotificationRead } = useAdmin()

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <Bell size={28} className="mx-auto text-[var(--admin-text-muted)] mb-3" />
        <p className="text-xs font-medium text-[var(--admin-text-secondary)]">Aucune notification</p>
        <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5">
          Les actions des autres admins apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="max-h-80 overflow-y-auto divide-y divide-[var(--admin-border)]">
      {notifications.map(n => (
        <NotificationItem
          key={n.id}
          notification={n}
          onRead={markNotificationRead}
        />
      ))}
    </div>
  )
}
