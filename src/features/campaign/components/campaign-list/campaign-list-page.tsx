'use client'
import { useMemo, useState, useEffect } from 'react' 
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Target } from 'lucide-react'
import { formatIDRX } from '@/lib/utils'
import CampaignCard from './campaign-card'
import { TCampaign } from '../campaign-detail/campaign-detail-page'

export const MOCK_CAMPAIGNS: TCampaign[] = [
  {
    id: 1,
    title: 'Bantuan Pendidikan Anak Yatim',
    description:
      'Membantu biaya pendidikan untuk 50 anak yatim di Jakarta Timur dengan program beasiswa penuh',
    image: 'https://picsum.photos/seed/campaign1/1000',
    raised: 45000000,
    target: 100000000,
    donors: 234,
    daysLeft: 15,
    createdAt: '2024-07-15',
    campaigner: {
      name: 'Yayasan Peduli Anak',
      address: '0x1234...5678',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 12,
      totalRaised: 850000000,
    },
    category: 'Pendidikan',
    status: 'ongoing',
  },
  {
    id: 2,
    title: 'Renovasi Masjid Al-Ikhlas',
    description:
      'Perbaikan atap dan fasilitas masjid untuk jamaah di Bandung yang sudah rusak akibat cuaca',
    image: 'https://picsum.photos/seed/campaign2/1000',
    raised: 78000000,
    target: 150000000,
    donors: 156,
    daysLeft: 22,
    createdAt: '2024-07-10',
    campaigner: {
      name: 'Takmir Masjid Al-Ikhlas',
      address: '0xabcd...7890',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 8,
      totalRaised: 320000000,
    },
    category: 'Keagamaan',
    status: 'ongoing',
  },
  {
    id: 3,
    title: 'Bantuan Korban Bencana Alam',
    description:
      'Bantuan darurat untuk korban banjir di Kalimantan Selatan berupa makanan dan tempat tinggal',
    image: 'https://picsum.photos/seed/campaign3/1000',
    raised: 125000000,
    target: 200000000,
    donors: 445,
    daysLeft: 8,
    createdAt: '2024-07-20',
    campaigner: {
      name: 'PMI Kalimantan Selatan',
      address: '0x7890...abcd',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 20,
      totalRaised: 2100000000,
    },
    category: 'Kemanusiaan',
    status: 'ongoing',
  },
  {
    id: 4,
    title: 'Startup Teknologi Pertanian',
    description: 'Mengembangkan aplikasi untuk membantu petani lokal meningkatkan hasil panen',
    image: 'https://picsum.photos/seed/campaign4/1000',
    raised: 25000000,
    target: 500000000,
    donors: 89,
    daysLeft: 45,
    createdAt: '2024-07-05',
    campaigner: {
      name: 'AgriTech Indonesia',
      address: '0x4567...cdef',
      isVerified: false,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 5,
      totalRaised: 90000000,
    },
    category: 'Teknologi',
    status: 'ongoing',
  },
  {
    id: 5,
    title: 'Beasiswa Mahasiswa Berprestasi',
    description: 'Program beasiswa untuk mahasiswa berprestasi dari keluarga kurang mampu',
    image: 'https://picsum.photos/seed/campaign5/1000',
    raised: 67000000,
    target: 120000000,
    donors: 178,
    daysLeft: 30,
    createdAt: '2024-07-12',
    campaigner: {
      name: 'Universitas Nusantara',
      address: '0x9876...abcd',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 18,
      totalRaised: 740000000,
    },
    category: 'Pendidikan',
    status: 'ongoing',
  },
  {
    id: 6,
    title: 'Operasi Jantung Anak',
    description:
      'Bantuan biaya operasi jantung untuk anak berusia 8 tahun dari keluarga tidak mampu',
    image: 'https://picsum.photos/seed/campaign6/1000',
    raised: 150000000,
    target: 150000000,
    donors: 267,
    daysLeft: 0,
    createdAt: '2024-06-18',
    campaigner: {
      name: 'RS Jantung Harapan',
      address: '0xdead...beef',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 7,
      totalRaised: 360000000,
    },
    category: 'Kesehatan',
    status: 'completed',
  },
  {
    id: 7,
    title: 'Pembangunan Perpustakaan Desa',
    description: 'Membangun perpustakaan untuk anak-anak di desa terpencil Sumatra Barat',
    image: 'https://picsum.photos/seed/campaign7/1000',
    raised: 34000000,
    target: 80000000,
    donors: 123,
    daysLeft: 25,
    createdAt: '2024-07-08',
    campaigner: {
      name: 'Komunitas Literasi Desa',
      address: '0xbeef...cafe',
      isVerified: false,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 4,
      totalRaised: 150000000,
    },
    category: 'Pendidikan',
    status: 'ongoing',
  },
  {
    id: 8,
    title: 'Bantuan UMKM Terdampak Banjir',
    description: 'Modal usaha untuk UMKM yang terdampak banjir di Jakarta untuk bangkit kembali',
    image: 'https://picsum.photos/seed/campaign8/1000',
    raised: 300000000,
    target: 300000000,
    donors: 389,
    daysLeft: 0,
    createdAt: '2024-06-16',
    campaigner: {
      name: 'Kadin Jakarta',
      address: '0xface...feed',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 10,
      totalRaised: 1250000000,
    },
    category: 'Ekonomi',
    status: 'completed',
  },
  {
    id: 9,
    title: 'Penanaman 10.000 Pohon Mangrove',
    description: 'Restorasi ekosistem pesisir pantai utara Jawa melalui penanaman mangrove.',
    image: 'https://picsum.photos/seed/campaign9/1000',
    raised: 88000000,
    target: 120000000,
    donors: 312,
    daysLeft: 40,
    createdAt: '2025-07-01',
    campaigner: {
      name: 'Yayasan Lestari Alam',
      address: '0xcafe...babe',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 3,
      totalRaised: 250000000,
    },
    category: 'Lingkungan',
    status: 'ongoing',
  },
  {
    id: 10,
    title: 'Rumah Singgah Pasien Kanker',
    description: 'Menyediakan tempat tinggal sementara bagi pasien kanker dan keluarga dari luar kota.',
    image: 'https://picsum.photos/seed/campaign10/1000',
    raised: 180000000,
    target: 250000000,
    donors: 450,
    daysLeft: 55,
    createdAt: '2025-06-25',
    campaigner: {
      name: 'Harapan Sehat Foundation',
      address: '0xfeed...face',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 9,
      totalRaised: 950000000,
    },
    category: 'Kesehatan',
    status: 'ongoing',
  },
  {
    id: 11,
    title: 'Pelatihan Digital untuk Lansia',
    description: 'Program pelatihan penggunaan smartphone dan internet untuk para lansia di Surakarta.',
    image: 'https://picsum.photos/seed/campaign11/1000',
    raised: 25000000,
    target: 75000000,
    donors: 95,
    daysLeft: 60,
    createdAt: '2025-07-22',
    campaigner: {
      name: 'Komunitas Digital Senior',
      address: '0x1337...c0de',
      isVerified: false,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 2,
      totalRaised: 45000000,
    },
    category: 'Pendidikan',
    status: 'ongoing',
  },
  {
    id: 12,
    title: 'Pengadaan Air Bersih NTT',
    description: 'Pembangunan sumur bor untuk mengatasi kekeringan di desa terpencil Nusa Tenggara Timur.',
    image: 'https://picsum.photos/seed/campaign12/1000',
    raised: 450000000,
    target: 450000000,
    donors: 1204,
    daysLeft: 0,
    createdAt: '2025-05-10',
    campaigner: {
      name: 'Aksi Cepat Tanggap',
      address: '0xbeef...dead',
      isVerified: true,
      avatar: '/placeholder.svg?height=40&width=40',
      campaignsCount: 35,
      totalRaised: 5100000000,
    },
    category: 'Kemanusiaan',
    status: 'completed',
  },
]
const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'ongoing', label: 'Sedang Berjalan' },
  { value: 'completed', label: 'Selesai' },
]

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  ...[...new Set(MOCK_CAMPAIGNS.map((c) => c.category))].map((category) => ({
    value: category,
    label: category,
  })),
]

const sortOptions = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'endingSoon', label: 'Segera Berakhir' },
  { value: 'mostFunded', label: 'Paling Terkumpul' },
  { value: 'leastFunded', label: 'Paling Sedikit Terkumpul' },
]

const formatCompactNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} M` 
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)} Jt` 
  }
  return num.toString()
}
const INITIAL_ITEMS = 8;

export default function CampaignsListPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    sortBy: 'latest',
  })
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS)
  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }))
  }

  const filteredAndSortedCampaigns = useMemo(() => {
    let campaigns = [...MOCK_CAMPAIGNS]
    campaigns = campaigns.filter((campaign) => {
      const statusMatch = filters.status === 'all' || campaign.status === filters.status
      const categoryMatch = filters.category === 'all' || campaign.category === filters.category
      return statusMatch && categoryMatch
    })
    switch (filters.sortBy) {
      case 'latest':
        campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'endingSoon':
        campaigns.sort((a, b) => {
          if (a.status !== 'ongoing') return 1
          if (b.status !== 'ongoing') return -1
          return a.daysLeft - b.daysLeft
        })
        break
      case 'mostFunded':
        campaigns.sort((a, b) => b.raised - a.raised)
        break
      case 'leastFunded':
        campaigns.sort((a, b) => a.raised - b.raised)
        break
      default:
        break
    }

    return campaigns
  }, [filters])
  
  // NEW: Reset visible count setiap kali hasil filter berubah
  useEffect(() => {
    setVisibleCount(INITIAL_ITEMS);
  }, [filteredAndSortedCampaigns]);

  // NEW: Buat array baru yang hanya berisi item yang akan ditampilkan
  const displayedCampaigns = useMemo(() => {
    return filteredAndSortedCampaigns.slice(0, visibleCount);
  }, [filteredAndSortedCampaigns, visibleCount]);

  const stats = useMemo(() => ({
    total: MOCK_CAMPAIGNS.length,
    ongoing: MOCK_CAMPAIGNS.filter((c) => c.status === 'ongoing').length,
    completed: MOCK_CAMPAIGNS.filter((c) => c.status === 'completed').length,
    totalRaised: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0),
  }), []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Semua Kampanye</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Temukan dan dukung kampanye yang Anda pedulikan dengan transparansi penuh
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Kampanye</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.ongoing}</div>
              <div className="text-sm text-muted-foreground">Sedang Berjalan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Selesai</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCompactNumber(stats.totalRaised)}
              </div>
              <div className="text-sm text-muted-foreground">Total Terkumpul</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-muted-foreground">
          Menampilkan {displayedCampaigns.length} dari {filteredAndSortedCampaigns.length} kampanye
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {displayedCampaigns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Tidak ada kampanye ditemukan
          </h3>
          <p className="text-muted-foreground mb-4">Coba ubah filter atau pilihan urutan Anda.</p>
          <Button
            variant="outline"
            onClick={() => setFilters({ status: 'all', category: 'all', sortBy: 'latest' })}
          >
            Reset Semua Filter
          </Button>
        </div>
      )}
      {visibleCount < filteredAndSortedCampaigns.length && (
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setVisibleCount(prevCount => prevCount + INITIAL_ITEMS)}
          >
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  )
}