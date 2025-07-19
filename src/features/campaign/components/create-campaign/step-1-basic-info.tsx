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
import { Textarea } from '@/components/ui/textarea'
import { CampaignForm } from './create-campaign'
import { Button } from '@/components/ui/button'
import { Trash2, Upload } from 'lucide-react'
import { createInputChangeHandler } from '@/lib/utils'

const MOCK_CATEGORIES = [
  'Pendidikan',
  'Kesehatan',
  'Keagamaan',
  'Kemanusiaan',
  'Teknologi',
  'Ekonomi',
  'Lingkungan',
  'Olahraga',
  'Seni & Budaya',
]

const StepOneBasicInfo = ({
  formData,
  setFormData,
}: {
  formData: CampaignForm
  setFormData: React.Dispatch<React.SetStateAction<CampaignForm>>
}) => {
  const handleInputChange = createInputChangeHandler<CampaignForm>(setFormData)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5), // Max 5 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <Step>
      <CardTitle>Informasi Dasar Kampanye</CardTitle>
      <CardDescription>Masukkan informasi dasar tentang kampanye Anda</CardDescription>
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="title">Judul Kampanye *</Label>
          <Input
            id="title"
            placeholder="Masukkan judul kampanye yang menarik"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Deskripsi Kampanye *</Label>
          <Textarea
            id="description"
            placeholder="Ceritakan detail kampanye Anda, tujuan, dan dampak yang ingin dicapai..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-1 min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Minimal 100 karakter ({formData.description.length}/100)
          </p>
        </div>

        <div>
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih kategori kampanye" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gambar Kampanye</Label>
          <div className="mt-2 space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop gambar atau klik untuk upload (Max 5 gambar)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button variant="outline" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  Pilih Gambar
                </label>
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image) || '/placeholder.svg'}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Step>
  )
}

export default StepOneBasicInfo
