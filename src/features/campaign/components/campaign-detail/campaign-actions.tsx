"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download, RotateCcw } from "lucide-react";
import { useAccount } from "wagmi";
import { Campaign } from "../../api/get-campaigns";
import { useWithdrawFromCampaign, useRefundFromCampaign } from "../../api/campaign-fund-actions";
import { useGetUserDonation } from "../../api/get-user-donation"; // Import the new hook

interface CampaignActionsProps {
  data: Campaign;
}

const CampaignActions = ({ data }: CampaignActionsProps) => {
  const { address: userWallet } = useAccount();

  const { data: userDonation, isLoading: isDonationLoading } = useGetUserDonation(data.address);

  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFromCampaign();
  const { mutate: refund, isPending: isRefunding } = useRefundFromCampaign();

  const isOwner = userWallet && data && userWallet.toLowerCase() === data.owner.toLowerCase();
  const hasDonated = userDonation ? parseFloat(userDonation) > 0 : false;

  const canWithdraw = isOwner && data.timeRemaining === 0 && data.status === 1;
  const canRefund = hasDonated && data.timeRemaining === 0 && data.status === 2;

  const handleWithdraw = () => {
    withdraw(
      { campaignAddress: data.address },
      {
        onSuccess: (txHash) => alert(`Penarikan dana berhasil! Hash: ${txHash}`),
        onError: (error) => alert(`Gagal melakukan penarikan: ${error.message}`),
      },
    );
  };

  const handleRefund = () => {
    refund(
      { campaignAddress: data.address },
      {
        onSuccess: (txHash) => alert(`Refund berhasil! Hash: ${txHash}`),
        onError: (error) => alert(`Gagal melakukan refund: ${error.message}`),
      },
    );
  };

  // Don't render the card if there are no actions available or if donation data is still loading
  if (isDonationLoading || (!canWithdraw && !canRefund)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
          Aksi Kampanye
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canWithdraw && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Sebagai pemilik, Anda dapat menarik dana yang terkumpul.
            </p>
            <Button className="w-full" onClick={handleWithdraw} disabled={isWithdrawing}>
              <Download className="w-4 h-4 mr-2" />
              {isWithdrawing ? "Memproses..." : "Tarik Dana"}
            </Button>
          </div>
        )}
        {canRefund && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Kampanye ini tidak mencapai target. Anda dapat menarik kembali donasi Anda.
            </p>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleRefund}
              disabled={isRefunding}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isRefunding ? "Memproses..." : "Refund Donasi"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignActions;
