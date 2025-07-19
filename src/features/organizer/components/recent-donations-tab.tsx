import { Card, CardContent } from '@/components/ui/card'
import { formatAddress, formatDate, formatIDRX } from '@/lib/utils'

const MOCK_RECENT_DONATIONS = [
  {
    id: 1,
    campaignTitle: 'Bantuan Pendidikan Anak Yatim',
    donor: '0x1a2b...3c4d',
    amount: 500000,
    timestamp: '2024-01-20T10:30:00Z',
    message: 'Semoga bermanfaat untuk adik-adik',
  },
  {
    id: 2,
    campaignTitle: 'Program Beasiswa Mahasiswa',
    donor: '0x5e6f...7g8h',
    amount: 1000000,
    timestamp: '2024-01-20T09:15:00Z',
    message: 'Untuk masa depan anak-anak Indonesia',
  },
  {
    id: 3,
    campaignTitle: 'Bantuan Pendidikan Anak Yatim',
    donor: '0x9i0j...1k2l',
    amount: 250000,
    timestamp: '2024-01-20T08:45:00Z',
    message: '',
  },
]

const RecentDonationsTab = () => {
  return (
    <>
      <h3 className="text-xl font-semibold">Donasi Terbaru</h3>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {MOCK_RECENT_DONATIONS.map((donation, index) => (
              <div
                key={donation.id}
                className={`p-4 ${index !== MOCK_RECENT_DONATIONS.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{formatAddress(donation.donor)}</span>
                      <span className="text-primary font-semibold">
                        {formatIDRX(donation.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{donation.campaignTitle}</p>
                    {donation.message && (
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{donation.message}&quot;
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(donation.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default RecentDonationsTab
