import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import VerifundSBTABI from "@/app/contracts/VerifundSBT.json";

export function useClaimSBT() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  return useMutation({
    mutationFn: async () => {
      return await writeContractAsync({
        address: process.env.NEXT_PUBLIC_VERIFUND_SBT_ADDRESS as `0x${string}`,
        abi: VerifundSBTABI.abi,
        functionName: "klaimLencanaSaya",
      });
    },
    onSuccess: () => {
      toast.success("SBT successfully claimed!");
      queryClient.invalidateQueries({ queryKey: ["badge-info", address] });
    },
    onError(error) {
      toast.error("Failed to claim SBT, try again later! \n" + error.message);
    },
  });
}
