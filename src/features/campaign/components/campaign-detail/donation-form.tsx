import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet } from 'lucide-react'
import { useState } from 'react'

const DonationForm = () => {
  const [donationAmount, setDonationAmount] = useState('')
  const [donationMessage, setDonationMessage] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isDonating, setIsDonating] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    // Simulate approval transaction
    setTimeout(() => {
      setIsApproving(false)
    }, 2000)
  }

  const handleDonate = async () => {
    setIsDonating(true)
    // Simulate donation transaction
    setTimeout(() => {
      setIsDonating(false)
      setDonationAmount('')
      setDonationMessage('')
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-primary" />
          Donasi Sekarang
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="amount">Jumlah Donasi (IDRX)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Masukkan jumlah donasi"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="message">Pesan (Opsional)</Label>
          <Input
            id="message"
            placeholder="Tinggalkan pesan untuk campaigner"
            value={donationMessage}
            onChange={(e) => setDonationMessage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Button
            className="w-full bg-transparent"
            variant="outline"
            onClick={handleApprove}
            disabled={!donationAmount || isApproving}
          >
            {isApproving ? 'Menyetujui...' : '1. Setujui IDRX'}
          </Button>
          <Button
            className="w-full bg-primary"
            onClick={handleDonate}
            disabled={!donationAmount || isDonating}
          >
            {isDonating ? 'Mengirim Donasi...' : '2. Kirim Donasi'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Donasi menggunakan token IDRX</p>
          <p>• Biaya gas dibayar dengan LSK</p>
          <p>• Dana langsung masuk ke smart contract</p>
          <p>• 100% transparan dan dapat dilacak</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DonationForm
