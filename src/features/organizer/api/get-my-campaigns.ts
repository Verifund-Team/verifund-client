import { Campaign } from "@/features/campaign/api/get-campaigns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export function useGetMyCampaigns() {
  const { address: currentAddress, isConnected } = useAccount();
  const queryClient = useQueryClient();

  return useQuery<Campaign[], Error>({
    queryKey: ["my-campaigns", currentAddress],
    queryFn: () => {
      const allCampaigns = queryClient.getQueryData<Campaign[]>(["get-campaigns"]);

      if (!allCampaigns || !currentAddress) {
        return [];
      }

      return allCampaigns.filter(
        (campaign) => campaign.owner.toLowerCase() === currentAddress.toLowerCase(),
      );
    },
    enabled:
      isConnected && !!currentAddress && queryClient.getQueryData(["get-campaigns"]) !== undefined,
  });
}
