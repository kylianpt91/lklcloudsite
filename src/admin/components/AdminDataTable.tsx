import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AdminEmptyState } from './AdminEmptyState'

interface Column<T> {
  key: string
  label: string
  render: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface AdminDataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  emptyIcon?: ReactNode
  loading?: boolean
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="admin-skeleton h-4 w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyTitle = 'Aucun élément',
  emptyDescription,
  emptyAction,
  emptyIcon,
  loading,
}: AdminDataTableProps<T>) {
  if (loading) {
    return (
      <div className="admin-card overflow-hidden !p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--admin-border)]">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--admin-text-muted)] ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="admin-card">
        <AdminEmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          icon={emptyIcon}
        />
      </div>
    )
  }

  return (
    <div className="admin-card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--admin-border)]">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--admin-text-muted)] ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onRowClick?.(item)}
                className={`admin-table-row border-b border-[var(--admin-border)] last:border-b-0 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-[var(--admin-text-primary)] ${col.className ?? ''}`}>
                    {col.render(item)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
