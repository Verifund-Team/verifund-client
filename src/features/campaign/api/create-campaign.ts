import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { web3Service } from "@/lib/web3";
import { uploadToIPFS, uploadImageToIPFS } from "@/lib/ipfs";

export const campaignFormSchema = z.object({
  creatorName: z.string().min(1, "Nama kreator harus diisi"),
  name: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  targetAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Target dana harus angka yang valid",
  }),
  durationInDays: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Durasi harus angka yang valid",
  }),
  image: z.instanceof(File, { message: "Gambar kampanye harus diunggah" }),
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
        imageUrl: imageUrl,
      };

      const ipfsHash = await uploadToIPFS(metadata);

      const txHash = await web3Service.createCampaign(
        formData.name,
        formData.targetAmount,
        parseInt(formData.durationInDays),
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
