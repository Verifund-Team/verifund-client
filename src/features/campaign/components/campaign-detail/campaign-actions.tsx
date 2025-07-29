"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download, RotateCcw, ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { CampaignDetail } from "../../api/get-campaign-detail";
import { useWithdrawFromCampaign, useRefundFromCampaign } from "../../api/campaign-fund-actions";

interface CampaignActionsProps {
  data: CampaignDetail;
}

const CampaignActions = ({ data }: CampaignActionsProps) => {
  const { address: userWallet } = useAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFromCampaign();
  const { mutate: refund, isPending: isRefunding } = useRefundFromCampaign();

  const isOwner = userWallet && userWallet.toLowerCase() === data.owner.toLowerCase();
  const hasDonated = parseFloat(data.userDonation) > 0;

  const canWithdraw =
    isOwner &&
    data.timeRemaining === 0 &&
    (data.status === 1 || (data.status === 2 && data.isOwnerVerified));

  const canRefund =
    hasDonated && data.timeRemaining === 0 && data.status === 2 && !data.isOwnerVerified;

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

  if (!canWithdraw && !canRefund) {
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
              {data.status === 1
                ? "Kampanye berhasil! Anda dapat menarik dana yang terkumpul."
                : "Sebagai pemilik terverifikasi, Anda dapat menarik dana meskipun target tidak tercapai."}
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
        {hasDonated && !canRefund && data.status === 2 && data.isOwnerVerified && (
          <div className="p-3 bg-muted rounded-md text-center">
            <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">
              Refund tidak tersedia karena pemilik kampanye ini terverifikasi dan berhak menarik
              dana yang terkumpul.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignActions;
