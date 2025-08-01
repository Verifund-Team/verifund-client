import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";

export function useGetWithdrawalTimestamp(campaignAddress?: string) {
  return useQuery<number | null, Error>({
    queryKey: ["withdrawal-timestamp", campaignAddress],
    queryFn: () => web3Service.getWithdrawalTimestamp(campaignAddress!),
    enabled: !!campaignAddress,
  });
}
