import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableTableRowProps {
  id: string
  children: ReactNode
  className?: string
}

export function SortableTableRow({ id, children, className }: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <tr ref={setNodeRef} style={style} className={className} {...attributes}>
      <td className="px-5 py-4 text-[var(--admin-text-muted)]">
        <button {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-0.5 rounded hover:bg-[var(--admin-surface)] transition-colors">
          <GripVertical size={14} />
        </button>
      </td>
      {children}
    </tr>
  )
}
