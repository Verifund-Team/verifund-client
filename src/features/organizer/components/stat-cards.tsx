import { Card, CardContent } from '@/components/ui/card'
import { MOCK_CAMPAIGNS } from '@/features/campaign/components/campaign-list/campaign-list-page'
import { formatIDRX } from '@/lib/utils'

const StatCards = () => {
  const totalRaised = MOCK_CAMPAIGNS.reduce((sum, campaign) => sum + campaign.raised, 0)
  const totalDonors = MOCK_CAMPAIGNS.reduce((sum, campaign) => sum + campaign.donors, 0)
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'ongoing').length

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{formatIDRX(totalRaised)}</div>
          <div className="text-sm text-muted-foreground">Total Terkumpul</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalDonors}</div>
          <div className="text-sm text-muted-foreground">Total Donatur</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{activeCampaigns}</div>
          <div className="text-sm text-muted-foreground">Kampanye Aktif</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{MOCK_CAMPAIGNS.length}</div>
          <div className="text-sm text-muted-foreground">Total Kampanye</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatCards
