import { Card, CardContent } from '@/components/ui/card'
import { TCampaign } from './campaign-detail-page'
import Image from 'next/image'

const CampaignImage = ({ data }: { data: Pick<TCampaign, 'image' | 'title'> }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-64 md:h-96 relative"></div>
          <Image
            src={data.image || '/placeholder.svg'}
            alt={data.title}
            className="object-cover rounded-t-lg"
            fill
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignImage
