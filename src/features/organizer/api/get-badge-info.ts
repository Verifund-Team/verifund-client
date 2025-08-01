import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";

export type IBadgeInfo = {
  hasWhitelistPermission: boolean;
  isCurrentlyVerified: boolean;
  tokenId: string;
  metadataURI: string;
};

export const useBadgeInfo = (address: `0x${string}` | undefined, isConnected: boolean) => {
  return useQuery<IBadgeInfo>({
    queryKey: ["badge-info", address],
    queryFn: () => {
      if (!address) throw new Error("Wallet not connected");
      return web3Service.getBadgeInfo(address);
    },
    enabled: !!address && isConnected,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
