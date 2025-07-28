import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";
import { useAccount } from "wagmi";

export function useGetUserDonation(campaignAddress: string) {
  const { address: userWalletAddress, isConnected } = useAccount();

  return useQuery<string, Error>({
    queryKey: ["get-user-donation", campaignAddress, userWalletAddress],

    queryFn: async () => {
      if (!userWalletAddress) {
        return "0";
      }
      const donation = await web3Service.getDirectTransfers(campaignAddress, userWalletAddress);
      return donation;
    },
    enabled: !!campaignAddress && isConnected,
  });
}
