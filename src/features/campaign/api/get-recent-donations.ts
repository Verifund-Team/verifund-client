import { useQuery } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";

export interface WalletTransaction {
  type: "wallet" | "transfer";
  donor: string;
  amount: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  method: "donate" | "transfer";
}

export interface IDRXTransaction {
  type: "idrx";
  id: number;
  donor: string;
  email: string;
  amount: string;
  paymentAmount: number;
  timestamp: number;
  paymentStatus: string;
  userMintStatus: string;
  reference: string;
  txHash: string;
  merchantOrderId: string;
}

interface IDRXTransactionRaw {
  id: number;
  customerVaName: string;
  email: string;
  toBeMinted: string;
  paymentAmount: number;
  createdAt: string;
  paymentStatus: string;
  userMintStatus: string;
  reference: string;
  txHash: string;
  merchantOrderId: string;
}

export type CombinedTransaction = WalletTransaction | IDRXTransaction;

export function useGetRecentDonations(campaignAddress: string) {
  return useQuery<CombinedTransaction[], Error>({
    queryKey: ["get-recent-donations", campaignAddress],

    queryFn: async () => {
      const [walletTxs, idrxTxs] = await Promise.all([
        web3Service.getWalletTransactions(campaignAddress),
        fetchIDRXTransactions(campaignAddress),
      ]);

      // Combine and sort all transactions by timestamp, newest first
      const allTxs = [...walletTxs, ...idrxTxs].sort((a, b) => b.timestamp - a.timestamp);

      return allTxs;
    },
    enabled: !!campaignAddress,
  });
}

async function fetchIDRXTransactions(campaignAddress: string): Promise<IDRXTransaction[]> {
  try {
    const response = await fetch(
      `/api/idrx/transaction-history?transactionType=MINT&campaignAddress=${campaignAddress}&page=1&take=1000`,
    );
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.map((tx: IDRXTransactionRaw) => ({
        type: "idrx" as const,
        id: tx.id,
        donor: tx.customerVaName || "Anonymous",
        email: tx.email,
        amount: tx.toBeMinted,
        paymentAmount: tx.paymentAmount,
        timestamp: new Date(tx.createdAt).getTime() / 1000,
        paymentStatus: tx.paymentStatus,
        userMintStatus: tx.userMintStatus,
        reference: tx.reference,
        txHash: tx.txHash,
        merchantOrderId: tx.merchantOrderId,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching IDRX transactions:", error);
    return [];
  }
}
