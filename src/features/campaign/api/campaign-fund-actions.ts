import { useMutation, useQueryClient } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";

// Hook for the campaign owner to withdraw funds
export function useWithdrawFromCampaign() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { campaignAddress: string }>({
    mutationFn: async ({ campaignAddress }) => {
      const txHash = await web3Service.withdrawFromCampaign(campaignAddress);
      return txHash;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-campaign-detail", variables.campaignAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
    },
    onError: (error: Error) => {
      console.error("Error withdrawing from campaign:", error);
    },
  });
}

// Hook for a donor to get a refund from a failed campaign
export function useRefundFromCampaign() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { campaignAddress: string }>({
    mutationFn: async ({ campaignAddress }) => {
      const txHash = await web3Service.refundFromCampaign(campaignAddress);
      return txHash;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-campaign-detail", variables.campaignAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["get-campaigns"] });
    },
    onError: (error: Error) => {
      console.error("Error refunding from campaign:", error);
    },
  });
}
