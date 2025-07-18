import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TDonation } from './campaign-detail-page'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback } from '@/components/ui/avatar'
import { Heart } from 'lucide-react'
import { formatAddress, formatIDRX } from '@/lib/utils'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const NewestDonation = ({ data }: { data: TDonation[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 mr-2 text-primary" />
          Donasi Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((donation) => (
            <div key={donation.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {donation.donor.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {formatAddress(donation.donor)}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatIDRX(donation.amount)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(donation.timestamp), 'd MMMM yyyy HH:mm', { locale: id })}
                </p>
                {donation.message && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    &quot;{donation.message}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default NewestDonation
