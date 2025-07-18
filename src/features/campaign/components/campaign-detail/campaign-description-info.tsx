import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TCampaign } from './campaign-detail-page'
import { formatIDRX } from '@/lib/utils'
import { Shield } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const CampaignDescriptionInfo = ({ data }: { data: TCampaign }) => {
  const progressPercentage = (data.raised / data.target) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{data.category}</Badge>
              {data.campaigner?.isVerified && (
                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Terverifikasi
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl md:text-3xl">{data.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatIDRX(data.raised)}</div>
            <div className="text-sm text-muted-foreground">Terkumpul</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{data.donors}</div>
            <div className="text-sm text-muted-foreground">Donatur</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{data.daysLeft}</div>
            <div className="text-sm text-muted-foreground">Hari Tersisa</div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Target: {formatIDRX(data.target)}</span>
            <span className="text-muted-foreground">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={33} className="h-3" />
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-muted-foreground">{data.description}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignDescriptionInfo
