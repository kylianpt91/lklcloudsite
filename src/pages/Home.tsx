import useDocumentTitle from '@/hooks/useDocumentTitle'
import SEOHead from '@/components/SEOHead'
import Hero from '@/components/sections/Hero'
import Benefits from '@/components/sections/Benefits'
import Solutions from '@/components/sections/Solutions'
import About from '@/components/sections/About'
import TeamSection from '@/components/sections/TeamSection'
import HomeFAQ from '@/components/sections/HomeFAQ'
import CTASection from '@/components/sections/CTASection'
import RevealSection from '@/components/ui/RevealSection'

export default function Home() {
  useDocumentTitle('Accueil')

  return (
    <>
      <SEOHead pageSlug="home" fallbackTitle="LKLCloud — Hébergeur français haute performance" />

      <div id="hero">
        <Hero />
      </div>

      <div id="solutions">
        <Solutions />
      </div>

      <RevealSection animation="fadeUp">
        <div id="benefits">
          <Benefits />
        </div>
      </RevealSection>

      <RevealSection animation="fadeUp">
        <div id="about">
          <About />
        </div>
      </RevealSection>

      <RevealSection animation="fadeUp">
        <div id="team">
          <TeamSection />
        </div>
      </RevealSection>

      <RevealSection animation="fadeUp">
        <div id="faq">
          <HomeFAQ />
        </div>
      </RevealSection>

      <div id="cta">
        <CTASection />
      </div>
    </>
  )
}
