import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";
import { CampaignMetadata, getMetadataFromIPFS } from "@/lib/ipfs";

type Campaign = {
  address: string;
  owner: string;
  name: string;
  target: string;
  raised: string;
  timeRemaining: number;
  status: number;
  ipfsHash: string;
  isOwnerVerified: boolean;
  metadata: CampaignMetadata;
};

export function useGetCampaigns() {
  return useQuery<Campaign[], Error>({
    queryKey: ["get-campaigns"], // Unique key for this query
    queryFn: async () => {
      const campaignAddresses = await web3Service.getAllCampaigns();

      const campaignDataPromises = campaignAddresses.map(async (address) => {
        const details = await web3Service.getCampaignDetails(address);
        let metadata: CampaignMetadata | null = null;
        if (details.ipfsHash) {
          try {
            metadata = await getMetadataFromIPFS(details.ipfsHash);
          } catch (ipfsError) {
            console.warn(
              `Could not load IPFS metadata for ${details.name} (hash: ${details.ipfsHash}):`,
              ipfsError,
            );
            // Optionally, handle this error more gracefully, e.g., show a placeholder
          }
        }
        return {
          ...details,
          metadata, // Attach the fetched metadata
        } as Campaign; // Cast to ensure type safety
      });

      const campaignsWithMetadata = await Promise.all(campaignDataPromises);
      return campaignsWithMetadata;
    },
  });
}
