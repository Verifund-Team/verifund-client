"use client";

import { useState, useEffect } from "react";
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
import { ActionDialog } from "@/components/ui/action-dialog";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { web3Service } from "@/lib/web3";
import { GuardianAnalysisData } from "../../api/get-guardian-analysis";

const stepFields: (keyof CampaignFormSchema)[][] = [
  ["creatorName", "name", "description", "category", "image"],
  ["targetAmount", "durationInDays"],
  [],
];

const CreateCampaignPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { mutate: createCampaign, isPending: isSubmitting } = useCreateCampaign();
  const [activeStep, setActiveStep] = useState(0);
  const [isStepValidating, setIsStepValidating] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState<GuardianAnalysisData | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    txHash: "",
    status: "success" as "success" | "error",
  });

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

  useEffect(() => {
    const checkVerification = async () => {
      if (isConnected && address) {
        const verified = await web3Service.checkVerificationStatus(address);
        setIsVerified(verified);
      } else {
        setIsVerified(false);
      }
    };
    checkVerification();
  }, [isConnected, address]);

  const onSubmit = (data: CampaignFormSchema) => {
    createCampaign(
      { ...data, guardianAnalysis: finalAnalysis },
      {
        onSuccess: (txHash) => {
          queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
          setDialogContent({
            title: "Campaign Created Successfully!",
            description: "Your new campaign is now live.",
            txHash,
            status: "success",
          });
          setIsDialogOpen(true);
          methods.reset();
          setActiveStep(0);
        },
        onError: (error) => {
          setDialogContent({
            title: "Failed to Create Campaign",
            description: error.message,
            txHash: "",
            status: "error",
          });
          setIsDialogOpen(true);
        },
      },
    );
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[activeStep];
    setIsStepValidating(true);
    const isValid = await methods.trigger(fieldsToValidate);
    setIsStepValidating(false);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setActiveStep((prev) => prev - 1);
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < activeStep) setActiveStep(stepIndex);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Create a New Campaign
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a transparent and trustworthy crowdfunding campaign
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
              backButtonText="Back"
              nextButtonText={isStepValidating ? "Validating..." : "Next"}
              finalStepButtonText={isSubmitting ? "Creating Campaign..." : "Create Campaign"}
              nextButtonProps={{ disabled: isSubmitting || isStepValidating }}
              backButtonProps={{ disabled: isSubmitting || isStepValidating }}
              stepCircleContainerClassName="max-w-4xl"
            >
              <Step>
                <StepOneBasicInfo isVerified={isVerified} setFinalAnalysis={setFinalAnalysis} />
              </Step>
              <Step>
                <StepTwoTargetDana />
              </Step>
              <Step>
                <StepThreePreview finalAnalysis={finalAnalysis} />
              </Step>
            </Stepper>
          </form>
        </FormProvider>
      </div>
      <ActionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        status={dialogContent.status}
        title={dialogContent.title}
        description={dialogContent.description}
        txHash={dialogContent.txHash}
        primaryAction={{ text: "View Campaigns", onClick: () => router.push("/campaigns") }}
        secondaryAction={{ text: "Close", onClick: () => setIsDialogOpen(false) }}
      />
    </AuthGuard>
  );
};

export default CreateCampaignPage;
