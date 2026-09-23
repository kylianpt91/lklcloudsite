import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Eye } from 'lucide-react'
import type { ReactNode } from 'react'

type ViewportMode = 'desktop' | 'mobile'

interface LivePreviewProps {
  children: ReactNode
  className?: string
}

export function LivePreview({ children, className = '' }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]  rounded-t-2xl">
        <div className="flex items-center gap-1.5">
          <Eye size={14} className="text-[var(--admin-primary)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">Aperçu</span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--admin-surface-strong)] rounded-lg p-0.5">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md transition-all ${
              viewport === 'desktop'
                ? 'bg-[var(--admin-bg-elevated)] text-[var(--admin-primary)] shadow-sm'
                : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]'
            }`}
            title="Bureau"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md transition-all ${
              viewport === 'mobile'
                ? 'bg-[var(--admin-bg-elevated)] text-[var(--admin-primary)] shadow-sm'
                : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]'
            }`}
            title="Mobile"
          >
            <Smartphone size={14} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-[var(--admin-surface)] rounded-b-2xl border border-t-0 border-[var(--admin-border)] p-4 flex items-start justify-center">
        <motion.div
          animate={{
            width: viewport === 'mobile' ? 375 : '100%',
            maxWidth: viewport === 'mobile' ? 375 : '100%',
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="public-preview-container rounded-xl overflow-hidden border border-neutral-gray/30 shadow-lg bg-white"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
