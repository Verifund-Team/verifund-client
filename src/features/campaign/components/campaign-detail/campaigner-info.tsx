import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@radix-ui/react-avatar'
import { TCampaign } from './campaign-detail-page'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'
import { formatAddress, formatIDRX } from '@/lib/utils'

const CampaignerInfo = ({ data }: { data: TCampaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tentang Campaigner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={data.campaigner.avatar || '/placeholder.svg'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {data.campaigner.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground">{data.campaigner.name}</h4>
              {data.campaigner.isVerified && (
                <Badge variant="outline" className="text-primary border-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  Terverifikasi
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {formatAddress(data.campaigner.address)}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kampanye:</span>
                <span className="font-medium">{data.campaigner.campaignsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Terkumpul:</span>
                <span className="font-medium">{formatIDRX(data.campaigner.totalRaised)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignerInfo
