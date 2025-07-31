import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";
import { useGetWithdrawalTimestamp } from "./get-withdrawal-timestamp";

export function useGetSpendingHistory(campaignAddress?: string, ownerAddress?: string) {
  const { data: withdrawalTimestamp } = useGetWithdrawalTimestamp(campaignAddress);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<any[], Error>({
    queryKey: ["spending-history", ownerAddress, campaignAddress],
    queryFn: () => web3Service.getSpendingHistory(ownerAddress!, withdrawalTimestamp!),

    enabled: !!ownerAddress && withdrawalTimestamp !== null && withdrawalTimestamp !== undefined,
  });
}
