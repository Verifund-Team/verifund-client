import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { copyToClipboard, formatAddress } from '@/lib/utils'
import { AlertCircle, CheckCircle, Copy, Shield } from 'lucide-react'
import { useState } from 'react'
import { MOCK_USER_DATA } from './organizer-dashboard'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const ProfileCard = () => {
  const [isClaimingSBT, setIsClaimingSBT] = useState(false)

  const handleClaimSBT = async () => {
    setIsClaimingSBT(true)
    setTimeout(() => {
      setIsClaimingSBT(false)
    }, 3000)
  }

  return (
    <Card className="h-fit">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={MOCK_USER_DATA.avatar || '/placeholder.svg'} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {MOCK_USER_DATA.publicName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <CardTitle className="text-lg">{MOCK_USER_DATA.publicName}</CardTitle>
            {MOCK_USER_DATA.isVerified && (
              <Badge className="bg-primary text-primary-foreground">
                <Shield className="w-3 h-3 mr-1" />
                Terverifikasi
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {formatAddress(MOCK_USER_DATA.address)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(MOCK_USER_DATA.address)}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Bergabung {format(new Date(MOCK_USER_DATA.joinedDate), 'd MMMM yyyy', { locale: id })}
        </div>

        {/* Verification Status */}
        {!MOCK_USER_DATA.isVerified && MOCK_USER_DATA.isWhitelisted && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Anda sudah disetujui untuk verifikasi! Klaim lencana SBT Anda sekarang.
              <Button
                className="w-full mt-2 bg-primary"
                onClick={handleClaimSBT}
                disabled={isClaimingSBT}
              >
                {isClaimingSBT ? 'Mengklaim...' : 'Klaim Lencana Verifikasi'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!MOCK_USER_DATA.isVerified && !MOCK_USER_DATA.isWhitelisted && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Belum terverifikasi. Ajukan verifikasi untuk mendapatkan lencana kepercayaan.
              <Button variant="outline" className="w-full mt-2 bg-transparent">
                Ajukan Verifikasi
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileCard
