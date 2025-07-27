"use client";

import { Stepper } from "@/components/ui/stepper";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StepOneBasicInfo from "./step-1-basic-info";
import StepTwoTargetDana from "./step-2-target-dana";
import StepThreePreview from "./step-3-preview";
import {
  campaignFormSchema,
  CampaignFormSchema,
  useCreateCampaign,
} from "../../api/create-campaign";

export interface CampaignForm {
  title: string;
  description: string;
  category: string;
  target: string;
  duration: string;
  images: File[];
}

const CreateCampaignPage = () => {
  const { mutate: createCampaign } = useCreateCampaign();

  const methods = useForm<CampaignFormSchema>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      creatorName: "",
      name: "",
      description: "",
      category: "",
      targetAmount: "",
      durationInDays: "30",
      image: undefined,
    },
  });

  const onSubmit = (data: CampaignFormSchema) => {
    createCampaign(data, {
      onSuccess: (txHash) => {
        alert(`Kampanye berhasil dibuat! Hash Transaksi: ${txHash}`);
        methods.reset();
        // router.push(`/campaigns/${newCampaignAddress}`);
      },
      onError: (error) => {
        alert(`Gagal membuat kampanye: ${error.message}`);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Buat Kampanye Baru</h1>
        <p className="text-xl text-muted-foreground">
          Buat kampanye crowdfunding yang transparan dan terpercaya
        </p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stepper
            stepCircleContainerClassName="max-w-7xl"
            initialStep={1}
            onFinalStepCompleted={methods.handleSubmit(onSubmit)}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <StepOneBasicInfo />
            <StepTwoTargetDana />
            <StepThreePreview />
          </Stepper>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateCampaignPage;
