import { useMutation, useQueryClient } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";

interface DonationData {
  campaignAddress: string;
  amount: string;
}

export function useDonateToCampaign() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, DonationData>({
    mutationFn: async ({ campaignAddress, amount }: DonationData) => {
      const txHash = await web3Service.donateToCampaign(campaignAddress, amount);
      return txHash;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-campaign-detail", variables.campaignAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
      queryClient.invalidateQueries({
        queryKey: ["get-recent-donations", variables.campaignAddress],
      });
    },
    onError: (error: Error) => {
      console.error("Error donating to campaign:", error);
    },
  });
}
