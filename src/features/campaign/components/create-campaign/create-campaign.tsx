"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stepper, Step } from "@/components/ui/stepper";
import StepOneBasicInfo from "./step-1-basic-info";
import StepTwoTargetDana from "./step-2-target-dana";
import StepThreePreview from "./step-3-preview";
import {
  campaignFormSchema,
  CampaignFormSchema,
  useCreateCampaign,
} from "../../api/create-campaign";
import { useQueryClient } from "@tanstack/react-query";
import AuthGuard from "@/components/auth-guard";

const stepFields: (keyof CampaignFormSchema)[][] = [
  ["creatorName", "name", "description", "category", "image"],
  ["targetAmount", "durationInDays"],
  [], // No validation needed for the preview step
];

const CreateCampaignPage = () => {
  const queryClient = useQueryClient();

  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<CampaignFormSchema>({
    resolver: zodResolver(campaignFormSchema),
    mode: "onChange",
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
    // console.log("Form data submitted:", data);

    createCampaign(data, {
      onSuccess: (txHash) => {
        queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
        alert(`Kampanye berhasil dibuat! Hash Transaksi: ${txHash}`);
        methods.reset();
        setActiveStep(0);
      },
      onError: (error) => {
        alert(`Gagal membuat kampanye: ${error.message}`);
      },
    });
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[activeStep];
    const isValid = await methods.trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Buat Kampanye Baru
          </h1>
          <p className="text-xl text-muted-foreground">
            Buat kampanye crowdfunding yang transparan dan terpercaya
          </p>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stepper
              activeStep={activeStep}
              onStepClick={handleStepClick}
              onPrevClick={handlePrev}
              onNextClick={handleNext}
              onFinalStepCompleted={methods.handleSubmit(onSubmit)}
              backButtonText="Kembali"
              nextButtonText="Selanjutnya"
              finalStepButtonText={isPending ? "Membuat kampanye..." : "Buat Kampanye"}
              nextButtonProps={{ disabled: isPending }}
              backButtonProps={{ disabled: isPending }}
              stepCircleContainerClassName="max-w-4xl"
            >
              <Step>
                <StepOneBasicInfo />
              </Step>
              <Step>
                <StepTwoTargetDana />
              </Step>
              <Step>
                <StepThreePreview />
              </Step>
            </Stepper>
          </form>
        </FormProvider>
      </div>
    </AuthGuard>
  );
};

export default CreateCampaignPage;
