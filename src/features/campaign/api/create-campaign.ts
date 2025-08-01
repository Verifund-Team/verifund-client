import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { web3Service } from "@/lib/web3";
import { uploadToIPFS, uploadImageToIPFS } from "@/lib/ipfs";

const guardianAnalysisSchema = z
  .object({
    credibilityScore: z.number(),
    riskLevel: z.enum(["Low", "Medium", "High", "Rendah", "Sedang", "Tinggi"]),
    summary: z.string(),
    suggestions: z.array(z.string()),
  })
  .nullable()
  .optional();

export const campaignFormSchema = z.object({
  creatorName: z.string().min(1, "Creator name is required"),
  name: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  targetAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Target amount must be a valid number",
  }),
  durationInDays: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Duration must be a valid number",
  }),
  image: z.instanceof(File, { message: "Campaign image is required" }),
  guardianAnalysis: guardianAnalysisSchema,
});

export type CampaignFormSchema = z.infer<typeof campaignFormSchema>;

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, CampaignFormSchema>({
    mutationFn: async (formData: CampaignFormSchema) => {
      let imageUrl = "";
      if (formData.image) {
        imageUrl = await uploadImageToIPFS(formData.image);
      }

      const metadata = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        creatorName: formData.creatorName,
        image: imageUrl,
        guardianAnalysis: formData.guardianAnalysis,
      };

      const ipfsHash = await uploadToIPFS(metadata);

      const durationInSeconds = Math.round(parseFloat(formData.durationInDays) * 86400);

      const txHash = await web3Service.createCampaign(
        formData.name,
        formData.targetAmount,
        durationInSeconds,
        ipfsHash,
      );

      return txHash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
    },
    onError: (error: Error) => {
      console.error("Error creating campaign:", error);
    },
  });
}
