'use client'

import CampaignImage from './campaign-image'
import CampaignDescriptionInfo from './campaign-description-info'
import NewestDonation from './newest-donation'
import DonationForm from './donation-form'
import CampaignerInfo from './campaigner-info'

const MOCK_CAMPAIGN_DATA = {
  id: 1,
  title: 'Bantuan Pendidikan Anak Yatim',
  description: `Assalamualaikum warahmatullahi wabarakatuh,

Kami dari Yayasan Peduli Anak mengajak Anda untuk berpartisipasi dalam program bantuan pendidikan untuk 50 anak yatim di Jakarta Timur. Program ini bertujuan untuk memberikan akses pendidikan yang layak bagi anak-anak yang kurang beruntung.

**Mengapa Program Ini Penting?**
- 50 anak yatim membutuhkan bantuan biaya sekolah
- Banyak dari mereka memiliki potensi akademik yang tinggi
- Pendidikan adalah kunci untuk memutus rantai kemiskinan
- Investasi terbaik adalah investasi untuk masa depan anak-anak

**Penggunaan Dana:**
- 60% untuk biaya sekolah dan seragam
- 25% untuk buku dan alat tulis
- 10% untuk program bimbingan belajar
- 5% untuk kegiatan ekstrakurikuler

**Target Penerima:**
Anak yatim usia 6-17 tahun di wilayah Jakarta Timur yang berasal dari keluarga kurang mampu namun memiliki semangat belajar yang tinggi.

Mari bersama-sama memberikan harapan dan masa depan yang cerah untuk mereka. Setiap donasi Anda, sekecil apapun, sangat berarti bagi mereka.

Jazakallahu khairan atas kebaikan Anda.`,
  image: 'https://picsum.photos/id/3/1000',
  raised: 45000000,
  target: 100000000,
  donors: 234,
  daysLeft: 15,
  createdAt: '2024-01-15',
  category: 'Pendidikan',
  campaigner: {
    name: 'Yayasan Peduli Anak',
    address: '0x1234...5678',
    isVerified: true,
    avatar: '/placeholder.svg?height=40&width=40',
    campaignsCount: 12,
    totalRaised: 850000000,
  },
  allowedVendors: [
    {
      name: 'SD Negeri 01 Jakarta Timur',
      address: '0xabcd...efgh',
      purpose: 'Biaya sekolah dan seragam',
    },
    {
      name: 'Toko Buku Pendidikan',
      address: '0x9876...5432',
      purpose: 'Buku dan alat tulis',
    },
    {
      name: 'Lembaga Bimbel Cerdas',
      address: '0xdef0...1234',
      purpose: 'Program bimbingan belajar',
    },
  ],
}
export type TCampaign = typeof MOCK_CAMPAIGN_DATA

const MOCK_RECENT_DONATIONS = [
  {
    id: 1,
    donor: '0x1a2b...3c4d',
    amount: 500000,
    timestamp: '2024-01-20T10:30:00Z',
    message: 'Semoga bermanfaat untuk adik-adik',
  },
  {
    id: 2,
    donor: '0x5e6f...7g8h',
    amount: 1000000,
    timestamp: '2024-01-20T09:15:00Z',
    message: 'Untuk masa depan anak-anak Indonesia',
  },
  {
    id: 3,
    donor: '0x9i0j...1k2l',
    amount: 250000,
    timestamp: '2024-01-20T08:45:00Z',
    message: '',
  },
  {
    id: 4,
    donor: '0x3m4n...5o6p',
    amount: 750000,
    timestamp: '2024-01-19T16:20:00Z',
    message: 'Barakallahu fiikum',
  },
  {
    id: 5,
    donor: '0x7q8r...9s0t',
    amount: 2000000,
    timestamp: '2024-01-19T14:10:00Z',
    message: 'Semoga berkah dan bermanfaat',
  },
]
export type TDonation = {
  id: number
  donor: string
  amount: number
  timestamp: string
  message: string
}

export default function CampaignDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CampaignImage data={MOCK_CAMPAIGN_DATA} />
          <CampaignDescriptionInfo data={MOCK_CAMPAIGN_DATA} />
          <NewestDonation data={MOCK_RECENT_DONATIONS} />
        </div>

        <div className="space-y-6">
          <DonationForm />
          <CampaignerInfo data={MOCK_CAMPAIGN_DATA} />
        </div>
      </div>
    </div>
  )
}
