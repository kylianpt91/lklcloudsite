import { Helmet } from 'react-helmet-async'
import { useSEO } from '@/hooks/useSEO'

interface SEOHeadProps {
  pageSlug: string
  fallbackTitle?: string
  fallbackDescription?: string
}

export default function SEOHead({ pageSlug, fallbackTitle, fallbackDescription }: SEOHeadProps) {
  const seo = useSEO(pageSlug)

  // If no SEO config from Firestore, use fallback or nothing
  const title = seo?.title || fallbackTitle
  const description = seo?.description || fallbackDescription

  if (!title && !description && !seo) return null

  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const ogImage = seo?.ogImage || 'https://lklcloud.fr/images/og.png'
  const canonical = seo?.canonicalUrl || (pageSlug === 'home' ? 'https://lklcloud.fr' : `https://lklcloud.fr/${pageSlug}`)

  const robotsDirectives: string[] = []
  if (seo?.noIndex) robotsDirectives.push('noindex')
  if (seo?.noFollow) robotsDirectives.push('nofollow')
  const robots = robotsDirectives.length > 0 ? robotsDirectives.join(', ') : undefined

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {seo?.keywords && seo.keywords.length > 0 && (
        <meta name="keywords" content={seo.keywords.join(', ')} />
      )}
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="LKLCloud" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {seo?.jsonLd && (
        <script type="application/ld+json">{seo.jsonLd}</script>
      )}
    </Helmet>
  )
}
