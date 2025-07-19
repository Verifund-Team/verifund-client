import { CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Step } from '@/components/ui/stepper'
import { CampaignForm } from './create-campaign'
import { AlertCircle } from 'lucide-react'
import { createInputChangeHandler, formatIDRX } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

const DURATIONS = [
  { value: '30', label: '30 Hari' },
  { value: '60', label: '60 Hari' },
  { value: '90', label: '90 Hari' },
  { value: '120', label: '120 Hari' },
]

const StepTwoTargetDana = ({
  formData,
  setFormData,
}: {
  formData: CampaignForm
  setFormData: React.Dispatch<React.SetStateAction<CampaignForm>>
}) => {
  const handleInputChange = createInputChangeHandler<CampaignForm>(setFormData)

  return (
    <Step>
      <CardTitle>Informasi Dasar Kampanye</CardTitle>
      <CardDescription>Masukkan informasi dasar tentang kampanye Anda</CardDescription>
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="target">Target Dana (IDRX) *</Label>
          <Input
            id="target"
            type="number"
            placeholder="1000000"
            value={formData.target}
            onChange={(e) => handleInputChange('target', e.target.value)}
            className="mt-1"
          />
          {formData.target && (
            <p className="text-sm text-muted-foreground mt-1">
              Target: {formatIDRX(Number.parseInt(formData.target) || 0)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="duration">Durasi Kampanye *</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleInputChange('duration', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih durasi kampanye" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Penting:</strong> Target dana dan durasi tidak dapat diubah setelah kampanye
            dibuat. Pastikan informasi yang Anda masukkan sudah benar.
          </AlertDescription>
        </Alert>
      </div>
    </Step>
  )
}

export default StepTwoTargetDana
