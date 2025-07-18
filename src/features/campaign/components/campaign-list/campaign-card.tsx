// components/campaigns/CampaignCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatIDRX } from '@/lib/utils'
import Image from 'next/image'
import { TCampaign } from '../campaign-detail/campaign-detail-page'
import Link from 'next/link'

const CampaignCard = ({ campaign }: { campaign: TCampaign }) => {
  return (
    <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 pt-0">
        <div className="relative">
          <div className="relative w-full h-48">
            <Image src={campaign.image} alt={campaign.title} className="object-cover" fill />
          </div>

          <Badge className="absolute top-3 left-3" variant="secondary">
            {campaign.category}
          </Badge>
          {campaign.campaigner?.isVerified && (
            <Badge variant="default" className="absolute top-3 right-3">
              <Shield className="w-3 h-3 mr-1" />
              Terverifikasi
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-primary">{formatIDRX(campaign.raised)}</span>
              <span className="text-muted-foreground">dari {formatIDRX(campaign.target)}</span>
            </div>
            <Progress value={(campaign.raised / campaign.target) * 100} className="h-2" />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {campaign.donors} donatur
            </div>
            <div>{campaign.daysLeft} hari tersisa</div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-3">oleh {campaign.campaigner?.name}</p>
            <Button className="w-full bg-primary">Donasi Sekarang</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CampaignCard
