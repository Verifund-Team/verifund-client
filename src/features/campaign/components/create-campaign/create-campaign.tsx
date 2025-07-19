'use client'

import { Step, Stepper } from '@/components/ui/stepper'
import { useState } from 'react'
import StepOneBasicInfo from './step-1-basic-info'
import StepTwoTargetDana from './step-2-target-dana'
import StepThreePreview from './step-3-preview'

export interface CampaignForm {
  title: string
  description: string
  category: string
  target: string
  duration: string
  images: File[]
}

const CreateCampaignPage = () => {
  const [formData, setFormData] = useState<CampaignForm>({
    title: '',
    description: '',
    category: '',
    target: '',
    duration: '',
    images: [],
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Buat Kampanye Baru</h1>
        <p className="text-xl text-muted-foreground">
          Buat kampanye crowdfunding yang transparan dan terpercaya
        </p>
      </div>

      <Stepper
        stepCircleContainerClassName="max-w-7xl"
        initialStep={1}
        onStepChange={(step) => {
          console.log(step)
        }}
        onFinalStepCompleted={() => console.log('All steps completed!')}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <StepOneBasicInfo formData={formData} setFormData={setFormData} />
        <StepTwoTargetDana formData={formData} setFormData={setFormData} />
        <StepThreePreview formData={formData} />
      </Stepper>
    </div>
  )
}

export default CreateCampaignPage
