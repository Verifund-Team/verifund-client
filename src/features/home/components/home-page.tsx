'use client'

import SectionHero from './section-hero'
import SectionStats from './section-stats'
import SectionFeaturedCampaigns from './section-featured-campaigns'
import SectionHowItWorks from './section-how-it-works'
import SectionCallToAction from './section-call-to-action'

export default function HomePage() {
  return (
    <>
      <SectionHero />
      <SectionStats />
      <SectionFeaturedCampaigns />
      <SectionHowItWorks />
      <SectionCallToAction />
    </>
  )
}
