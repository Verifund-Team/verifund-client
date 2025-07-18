import { Button } from '@/components/ui/button'
import CampaignCard from '@/features/campaign/components/campaign-card'

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: 'Bantuan Pendidikan Anak Yatim',
    description: 'Membantu biaya pendidikan untuk 50 anak yatim di Jakarta Timur',
    image: 'https://picsum.photos/id/3/1000',
    raised: 45000000,
    target: 100000000,
    donors: 234,
    daysLeft: 15,
    campaigner: 'Yayasan Peduli Anak',
    isVerified: true,
    category: 'Pendidikan',
  },
  {
    id: 2,
    title: 'Renovasi Masjid Al-Ikhlas',
    description: 'Perbaikan atap dan fasilitas masjid untuk jamaah di Bandung',
    image: 'https://picsum.photos/id/23/1000',
    raised: 78000000,
    target: 150000000,
    donors: 156,
    daysLeft: 22,
    campaigner: 'Takmir Masjid Al-Ikhlas',
    isVerified: true,
    category: 'Keagamaan',
  },
  {
    id: 3,
    title: 'Bantuan Korban Bencana Alam',
    description: 'Bantuan darurat untuk korban banjir di Kalimantan Selatan',
    image: 'https://picsum.photos/id/5/1000',
    raised: 125000000,
    target: 200000000,
    donors: 445,
    daysLeft: 8,
    campaigner: 'PMI Kalimantan Selatan',
    isVerified: true,
    category: 'Kemanusiaan',
  },
  {
    id: 4,
    title: 'Startup Teknologi Pertanian',
    description: 'Mengembangkan aplikasi untuk membantu petani lokal',
    image: 'https://picsum.photos/id/7/1000',
    raised: 25000000,
    target: 500000000,
    donors: 89,
    daysLeft: 45,
    campaigner: 'AgriTech Indonesia',
    isVerified: false,
    category: 'Teknologi',
  },
]

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
          {MOCK_CAMPAIGNS.map((campaign) => (
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
