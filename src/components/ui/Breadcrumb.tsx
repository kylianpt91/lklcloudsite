import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Fil d'Ariane"
      className="flex items-center gap-2 text-sm text-neutral-medium"
    >
      <ol className="flex items-center gap-2 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <motion.li
              key={`${item.label}-${index}`}
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <span className="text-neutral-gray select-none" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-neutral-dark font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </motion.nav>
  )
}
