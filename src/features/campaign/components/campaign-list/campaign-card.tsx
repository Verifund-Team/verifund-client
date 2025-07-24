'use client' 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatIDRX } from '@/lib/utils'
import Image from 'next/image'
import { TCampaign } from '../campaign-detail/campaign-detail-page'
import Link from 'next/link'

import { useAccount } from 'wagmi'
import { useConnectModal } from '@xellar/kit'

const CampaignCard = ({ campaign }: { campaign: TCampaign }) => {

  const { isConnected } = useAccount()
  const { open } = useConnectModal()

  const handleDonateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected) {
      e.preventDefault() 
      open() 
    }
  }

  return (
    <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 pt-0 h-full flex flex-col">
        <div className="relative">
          <div className="relative w-full h-48">
            <Image src={campaign.image} alt={campaign.title} className="object-cover" fill />
          </div>

          <Badge className="absolute top-3 left-3 bg-white text-black" variant="secondary">
          {campaign.category}
            </Badge>

          {campaign.campaigner?.isVerified && (
          <Badge className="absolute top-3 right-3 bg-white text-black" variant="default">
          <Shield className="w-3 h-3 mr-1" />
          Terverifikasi
          </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex flex-col flex-grow">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">{formatIDRX(campaign.raised)}</span>
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
          </div>

          <div className="pt-2 mt-auto">
            <p className="text-sm text-muted-foreground mb-3">oleh {campaign.campaigner?.name}</p>
            <Button 
              onClick={handleDonateClick} 
              className="hover:cursor-pointer w-full bg-white text-gray-900 font-bold hover:bg-gray-200 transition-colors duration-200"
            >
              Donasi Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CampaignCard