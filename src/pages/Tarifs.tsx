import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Server,
  Globe,
  Code,
  Braces,
  Link as LinkIcon,
  MonitorSmartphone,
  Package,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import SEOHead from '@/components/SEOHead'
import { useBridgeProducts } from '@/hooks/useBridge'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Card from '@/components/ui/Card'

const iconMap: Record<string, LucideIcon> = {
  Server,
  Globe,
  Code,
  Braces,
  Link: LinkIcon,
  MonitorSmartphone,
}

export default function Tarifs() {
  useDocumentTitle('Tarifs')
  const products = useBridgeProducts()

  return (
    <>
      <SEOHead
        pageSlug="tarifs"
        fallbackTitle="Tarifs — LKLCloud"
        fallbackDescription="Comparez tous nos tarifs : VPS Linux, hébergement web, bots Discord. Prix transparents, sans frais caché."
      />

      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Tarifs' }]} />
          <div className="mt-6 sm:mt-8">
            <h1 className="display text-3xl sm:text-4xl lg:text-[3.5rem] text-neutral-dark">
              Nos tarifs
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-neutral-medium max-w-2xl">
              Des prix transparents, sans frais caché. Comparez nos offres et choisissez celle
              qui correspond à votre projet.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, i) => {
              const Icon = iconMap[product.icon] || Package
              const cheapest = product.plans.length
                ? product.plans.reduce((min, p) => (p.price < min.price ? p : min), product.plans[0])
                : null

              return (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <Card variant="default" hoverable className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-dark/[0.04] text-neutral-dark">
                        <Icon className="w-5 h-5" />
                      </div>
                      {product.comingSoon && (
                        <span className="eyebrow text-[11px] text-neutral-dark/45">
                          Prochainement
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-neutral-dark">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-medium flex-1">
                      {product.description}
                    </p>

                    <div className="mt-5 pt-5 border-t border-line flex items-center justify-between gap-3">
                      <div>
                        {cheapest ? (
                          <>
                            <p className="text-xs text-neutral-medium">À partir de</p>
                            <p className="text-xl font-extrabold text-neutral-dark">
                              {cheapest.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                              <span className="text-sm font-normal text-neutral-medium">
                                /{cheapest.period}
                              </span>
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-neutral-medium">Bientôt disponible</p>
                        )}
                      </div>
                      <Link
                        to={`/produits/${product.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
                      >
                        Voir l’offre
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="rounded-3xl bg-surface border border-hairline text-text p-8 sm:p-14 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              aria-hidden="true"
              className="warm-glow pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full opacity-70"
            />
            <div className="relative">
              <h2 className="display text-2xl sm:text-[2.5rem] text-text">
                Une question sur nos{' '}
                <span className="font-accent font-normal text-primary">tarifs&nbsp;?</span>
              </h2>
              <p className="mt-4 text-text-dim max-w-md">
                Notre équipe vous répond en moyenne en 25 minutes, 7j/7.
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 text-sm rounded-xl font-semibold hover:bg-primary-light transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nous contacter
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
