import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gamepad2, Cloud, Globe, Server, Package, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useBridgeProducts, useBridgeProductGroups } from '@/hooks/useBridge'

const iconMap: Record<string, LucideIcon> = { Gamepad2, Cloud, Globe, Server, Package }

const highlights = [
  'Déploiement en quelques minutes',
  'Support technique français, 7j/7',
  'Anti-DDoS inclus sur toutes les offres',
  'Infrastructure hébergée en France',
]

function cheapestPrice(prices: number[]): string | undefined {
  if (prices.length === 0) return undefined
  const min = Math.min(...prices)
  return `${min.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/mois`
}

export default function Solutions() {
  const products = useBridgeProducts()
  const productGroups = useBridgeProductGroups()

  // Groups (title, icon, order) come from the "Navigation" admin page;
  // which gammes land in which group comes from each gamme's own
  // "Catégorie" — same source of truth as the header, the footer and the
  // "Découvrir nos offres" modal.
  const categories = productGroups.map((g) => {
    const hrefs = new Set(g.items.map((i) => i.href))
    const groupProducts = products.filter((p) => hrefs.has(`/produits/${p.slug}`))
    return {
      label: g.label,
      icon: iconMap[g.icon] || Package,
      tag: cheapestPrice(groupProducts.filter((p) => !p.comingSoon).flatMap((p) => p.plans.map((pl) => pl.price))),
      items: g.items,
    }
  })

  return (
    <section className="relative border-t border-hairline bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow inline-flex items-center gap-2 text-text-faint mb-5">
            <span className="font-mono text-primary">01</span>
            <span className="h-px w-6 bg-hairline-strong" />
            Nos solutions
          </span>
          <h2 className="display text-3xl sm:text-4xl lg:text-[3.25rem] text-text">
            Le cloud, pour{' '}
            <span className="font-accent font-normal text-primary">chaque projet</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-dim">
            VPS, hébergement web ou bot Discord — une infrastructure française,
            rapide et sécurisée pour ce que vous construisez.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="surface-card flex h-full flex-col p-6"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-tint-2)] text-text">
                  <c.icon className="h-5 w-5" />
                </span>
                {c.tag && <span className="font-mono text-xs font-medium text-text-faint">{c.tag}</span>}
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-text">{c.label}</h3>

              <ul className="mt-5 flex-1 space-y-1.5 border-t border-hairline pt-4">
                {c.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={`group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 -mx-2 text-sm transition-colors ${
                        item.comingSoon
                          ? 'text-text-faint hover:bg-[var(--color-tint-1)]'
                          : 'text-text-dim hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {item.label}
                      {item.comingSoon ? (
                        <span className="text-[10px] font-semibold text-primary border border-primary/30 rounded-full px-1.5 py-0.5 leading-none whitespace-nowrap">
                          Bientôt
                        </span>
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-text-faint opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-primary" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.ul
          className="mt-10 grid gap-x-6 gap-y-3 border-t border-hairline pt-8 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-text-dim">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
