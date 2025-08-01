import { useQuery } from "@tanstack/react-query";
import { Campaign, CampaignMetadata } from "./get-campaigns";
import { web3Service } from "@/lib/web3";
import { getMetadataFromIPFS } from "@/lib/ipfs";

export type CampaignDetail = Campaign & { userDonation: string; isWithdrawn: boolean };

export function useGetCampaignDetail(campaignAddress: string, userWalletAddress?: string) {
  return useQuery<CampaignDetail, Error>({
    queryKey: ["get-campaign-detail", campaignAddress, userWalletAddress],

    queryFn: async () => {
      const [details, userDonation] = await Promise.all([
        web3Service.getCampaignDetails(campaignAddress),
        userWalletAddress
          ? web3Service.getDirectTransfers(campaignAddress, userWalletAddress)
          : Promise.resolve("0"),
      ]);

      const totalRaised = Math.max(
        parseFloat(details.raised || "0"),
        parseFloat(details.actualBalance || "0"),
      ).toString();

      let metadata: CampaignMetadata | null = null;
      if (details.ipfsHash) {
        try {
          metadata = await getMetadataFromIPFS(details.ipfsHash);
        } catch (ipfsError) {
          console.warn(`Could not load IPFS metadata for ${campaignAddress}:`, ipfsError);
        }
      }

      return {
        ...details,
        metadata,
        userDonation,
        totalRaised,
      } as CampaignDetail;
    },
    enabled: !!campaignAddress,
  });
}
