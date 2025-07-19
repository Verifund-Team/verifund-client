import { Button } from '@/components/ui/button'
import { Calendar, Eye, Plus, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatIDRX } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_CAMPAIGNS } from '@/features/campaign/components/campaign-list/campaign-list-page'

const CampaignsTab = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Kampanye Saya</h3>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Buat Kampanye Baru
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_CAMPAIGNS.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden pt-0">
            <div className="relative">
              <div className="relative w-full h-48">
                <Image
                  src={campaign.image || '/placeholder.svg'}
                  alt={campaign.title}
                  className="object-cover"
                  fill
                />
              </div>

              <Badge
                variant={campaign.status === 'completed' ? 'secondary' : 'default'}
                className="absolute top-2 right-2"
              >
                {campaign.status === 'completed' ? 'Selesai' : 'Aktif'}
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{campaign.title}</CardTitle>
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
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {campaign.daysLeft > 0 ? `${campaign.daysLeft} hari` : 'Selesai'}
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/campaign/${campaign.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default CampaignsTab
