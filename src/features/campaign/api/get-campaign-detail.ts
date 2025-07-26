import { useQuery } from "@tanstack/react-query";
import { Campaign, CampaignMetadata } from "./get-campaigns";
import { web3Service } from "@/lib/web3";
import { getMetadataFromIPFS } from "@/lib/ipfs";

export function useGetCampaignDetail(campaignAddress: string) {
  return useQuery<Campaign, Error>({
    queryKey: ["get-campaign-detail", campaignAddress],

    queryFn: async () => {
      const details = await web3Service.getCampaignDetails(campaignAddress);

      let metadata: CampaignMetadata | null = null;
      if (details.ipfsHash) {
        try {
          metadata = await getMetadataFromIPFS(details.ipfsHash);
        } catch (ipfsError) {
          console.warn(`Could not load IPFS metadata for campaign ${campaignAddress}:`, ipfsError);
        }
      }

      return {
        ...details,
        metadata,
      } as Campaign;
    },
    enabled: !!campaignAddress,
  });
}
