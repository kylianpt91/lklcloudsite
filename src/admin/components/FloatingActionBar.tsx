import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface FloatingActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  children: ReactNode
}

export function FloatingActionBar({ selectedCount, onClearSelection, children }: FloatingActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]/95 backdrop-blur-xl shadow-lg shadow-black/10"
        >
          {/* Count badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-lg bg-[var(--admin-primary)] text-white text-xs font-bold">
              {selectedCount}
            </span>
            <span className="text-sm font-medium text-[var(--admin-text-secondary)] whitespace-nowrap">
              sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-[var(--admin-border)]" />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {children}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-[var(--admin-border)]" />

          {/* Clear button */}
          <button
            onClick={onClearSelection}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface)] transition-colors"
            title="Désélectionner tout"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
