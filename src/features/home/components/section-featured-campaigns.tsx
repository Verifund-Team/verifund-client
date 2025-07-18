import { Button } from '@/components/ui/button'
import CampaignCard from '@/features/campaign/components/campaign-list/campaign-card'
import { MOCK_CAMPAIGNS } from '@/features/campaign/components/campaign-list/campaign-list-page'

const SectionFeaturedCampaigns = () => {
  return (
    <section id="campaigns" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kampanye Unggulan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dukung kampanye-kampanye yang telah terverifikasi dan transparan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CAMPAIGNS.slice(0, 4).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Lihat Semua Kampanye
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SectionFeaturedCampaigns
