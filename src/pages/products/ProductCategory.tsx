import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react'
import { useBridgeProductBySlug } from '@/hooks/useBridge'
import PricingCard from '@/components/ui/PricingCard'
import SectionTitle from '@/components/ui/SectionTitle'
import Accordion from '@/components/ui/Accordion'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ShareButtons from '@/components/ui/ShareButtons'
import { trackProductView } from '@/components/ui/RecentlyViewed'
import ComparisonTable from '@/components/product/ComparisonTable'
import FloatingTOC from '@/components/ui/FloatingTOC'

const productSections = [
  { id: 'product-hero', label: 'Présentation' },
  { id: 'product-pricing', label: 'Tarifs' },
  { id: 'product-comparison', label: 'Comparaison' },
  { id: 'product-usecases', label: 'Cas d\'utilisation' },
  { id: 'product-faq', label: 'FAQ' },
  { id: 'product-cta', label: 'Contact' },
]

export default function ProductCategory() {
  const { category } = useParams<{ category: string }>()
  const product = useBridgeProductBySlug(category ?? '')
  useDocumentTitle(product?.name)

  useEffect(() => {
    if (product) {
      trackProductView({ slug: product.slug, name: product.name, shortName: product.shortName })
    }
  }, [product])

  if (product?.comingSoon) {
    return <Navigate to="/coming-soon" replace />
  }

  if (!product) {
    return (
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-dark">
            Produit introuvable
          </h1>
          <p className="mt-4 text-lg text-neutral-medium">
            La catégorie de produit demandée n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-neutral-dark text-white px-6 py-3 text-sm rounded-xl font-semibold hover:bg-primary transition-colors duration-300"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    )
  }

  const planCount = product.plans.length
  const gridCols =
    planCount <= 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : planCount === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      <SEOHead
        pageSlug={`produits/${category}`}
        fallbackTitle={`${product.name} — LKLCloud`}
        fallbackDescription={product.heroDescription}
      />
      <FloatingTOC sections={productSections} />

      {/* Hero */}
      <section id="product-hero" className="pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Produits' },
              { label: product.name },
            ]}
          />

          <div className="mt-6 sm:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {product.comingSoon && (
                <span className="eyebrow inline-flex items-center gap-2 mb-4 text-neutral-dark/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Prochainement
                </span>
              )}
              <h1 className="display text-3xl sm:text-4xl lg:text-[3.5rem] text-neutral-dark">
                {product.heroTitle}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 sm:mt-4 text-base sm:text-xl text-neutral-medium max-w-2xl"
            >
              {product.heroDescription}
            </motion.p>
          </div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ShareButtons />
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="product-pricing" className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`grid ${gridCols} gap-4 sm:gap-6 lg:gap-8`}>
            {product.plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <PricingCard
                  plan={plan.name}
                  price={plan.price}
                  priceQuarterly={plan.priceQuarterly}
                  priceYearly={plan.priceYearly}
                  period={plan.period}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  badge={plan.badge}
                  specs={plan.specs}
                  ctaLink={plan.orderUrl}
                  originalPrice={plan.originalPrice}
                  originalPriceQuarterly={plan.originalPriceQuarterly}
                  originalPriceYearly={plan.originalPriceYearly}
                  promoPercent={plan.promoPercent}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="product-comparison" className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            eyebrow="Comparatif"
            title="Comparaison détaillée"
            subtitle="Trouvez le plan qui correspond à vos besoins"
          />
          <div className="mt-8">
            <ComparisonTable plans={
              product.slug === 'fivem'
                ? [product.plans[2], product.plans[1], product.plans[0], ...product.plans.slice(3)]
                : product.plans
            } />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="product-usecases" className="py-12 sm:py-20 bg-paper-deep">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTitle
            eyebrow="Cas d'usage"
            title="Exemples d'utilisation"
            subtitle={`Découvrez comment ${product.name} répond à vos besoins`}
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.useCases.map((useCase) => (
              <motion.div
                key={useCase}
                className="flex items-start gap-3 bg-paper border border-line rounded-xl px-5 py-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-neutral-dark text-sm font-medium">{useCase}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="product-faq" className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle eyebrow="FAQ" title="Questions fréquentes" />
          <div className="mt-8 max-w-3xl mx-auto">
            <Accordion items={product.faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="product-cta" className="py-12 sm:py-20">
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
                Besoin d&apos;aide pour{' '}
                <span className="font-accent font-normal text-primary">choisir&nbsp;?</span>
              </h2>
              <p className="mt-4 text-text-dim max-w-md">
                Notre équipe est là pour vous conseiller la solution la plus
                adaptée à votre projet.
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <a
                  href="mailto:support@lklcloud.fr"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 text-sm rounded-xl font-semibold hover:bg-primary-light transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nous contacter
                </a>
                <a
                  href="https://clients.lklcloud.fr"
                  className="inline-flex items-center gap-2 border border-hairline text-text px-6 py-3.5 text-sm rounded-xl font-semibold hover:border-hairline-strong transition-colors duration-300"
                >
                  Espace client
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
