import { useMutation, useQueryClient } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3"; // Assuming this is your web3 service path

export function useUpdatePeakBalance() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { campaignAddress: string }>({
    mutationFn: async ({ campaignAddress }) => {
      const txHash = await web3Service.updatePeakBalance(campaignAddress);
      return txHash;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-campaign-detail", variables.campaignAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
    },
    onError: (error: Error) => {
      console.error("Error updating peak balance:", error);
    },
  });
}
