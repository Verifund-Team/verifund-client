import { Step } from '@/components/ui/stepper'
import { CampaignForm } from './create-campaign'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Shield, Users } from 'lucide-react'
import { formatIDRX } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

const StepThreePreview = ({ formData }: { formData: CampaignForm }) => {
  return (
    <Step>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Preview Kampanye</h3>

        <Card className="pt-0">
          <div className="relative">
            {formData.images.length > 0 ? (
              <img
                src={URL.createObjectURL(formData.images[0]) || '/placeholder.svg'}
                alt="Campaign preview"
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                <p className="text-muted-foreground">Tidak ada gambar</p>
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-card/90 text-foreground" variant="secondary">
              {formData.category}
            </Badge>
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              <Shield className="w-3 h-3 mr-1" />
              Terverifikasi
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="text-xl">{formData.title || 'Judul Kampanye'}</CardTitle>
            <CardDescription>{formData.description || 'Deskripsi kampanye...'}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-primary">IDRX 0</span>
                <span className="text-muted-foreground">
                  dari {formatIDRX(Number.parseInt(formData.target) || 0)}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />0 donatur
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formData.duration} hari
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">oleh Yayasan Peduli Anak</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Kampanye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Dana:</span>
              <span className="font-medium">
                {formatIDRX(Number.parseInt(formData.target) || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durasi:</span>
              <span className="font-medium">{formData.duration} hari</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kategori:</span>
              <span className="font-medium">{formData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gambar:</span>
              <span className="font-medium">{formData.images.length} gambar</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Step>
  )
}

export default StepThreePreview
