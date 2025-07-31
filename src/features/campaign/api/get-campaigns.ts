import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";
import { getMetadataFromIPFS } from "@/lib/ipfs";
import { GuardianAnalysisData } from "./get-guardian-analysis";

export type CampaignMetadata = {
  name: string;
  description: string;
  category: string;
  creatorName: string;
  image?: string;
  guardianAnalysis?: GuardianAnalysisData | null;
};

export type Campaign = {
  address: string;
  owner: string;
  name: string;
  target: string;
  raised: string;
  actualBalance: string;
  peakBalance: string;
  isPeakBalanceUpdated: boolean;
  timeRemaining: number;
  status: number;
  ipfsHash: string;
  isOwnerVerified: boolean;
  metadata: CampaignMetadata | null | undefined;
  totalRaised: string;
};

export function useGetCampaigns() {
  return useQuery<Campaign[], Error>({
    queryKey: ["get-campaigns"],
    queryFn: async () => {
      const campaignAddresses = await web3Service.getAllCampaigns();

      const campaignDataPromises = campaignAddresses.map(async (address) => {
        const details = await web3Service.getCampaignDetails(address);

        const totalRaised = Math.max(
          parseFloat(details.raised || "0"),
          parseFloat(details.actualBalance || "0"),
          parseFloat(details.peakBalance || "0"),
        ).toString();

        let metadata: CampaignMetadata | null = null;
        if (details.ipfsHash) {
          try {
            metadata = await getMetadataFromIPFS(details.ipfsHash);
          } catch (ipfsError) {
            console.warn(
              `Could not load IPFS metadata for ${details.name} (hash: ${details.ipfsHash}):`,
              ipfsError,
            );
          }
        }
        return {
          ...details,
          metadata,
          totalRaised,
        };
      });

      const campaignsWithMetadata = await Promise.all(campaignDataPromises);
      return campaignsWithMetadata as Campaign[];
    },
  });
}
