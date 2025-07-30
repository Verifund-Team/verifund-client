"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Download, RotateCcw, ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { CampaignDetail } from "../../api/get-campaign-detail";
import { useWithdrawFromCampaign, useRefundFromCampaign } from "../../api/campaign-fund-actions";

interface CampaignActionsProps {
  campaign: CampaignDetail;
}

const CampaignActions = ({ campaign }: CampaignActionsProps) => {
  const { address: userWallet } = useAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFromCampaign();
  const { mutate: refund, isPending: isRefunding } = useRefundFromCampaign();

  const isOwner = userWallet && userWallet.toLowerCase() === campaign.owner.toLowerCase();
  const hasDonated = parseFloat(campaign.userDonation) > 0;

  const canWithdraw =
    isOwner &&
    campaign.timeRemaining === 0 &&
    (campaign.status === 1 || (campaign.status === 2 && campaign.isOwnerVerified));

  const canRefund =
    hasDonated &&
    campaign.timeRemaining === 0 &&
    campaign.status === 2 &&
    !campaign.isOwnerVerified;

  const showVerifiedOwnerPrivilege = isOwner && campaign.status === 2 && campaign.isOwnerVerified;

  const handleWithdraw = () => {
    withdraw(
      { campaignAddress: campaign.address },
      {
        onSuccess: (txHash) => alert(`Withdrawal successful! Hash: ${txHash}`),
        onError: (error) => alert(`Withdrawal failed: ${error.message}`),
      },
    );
  };

  const handleRefund = () => {
    refund(
      { campaignAddress: campaign.address },
      {
        onSuccess: (txHash) => alert(`Refund successful! Hash: ${txHash}`),
        onError: (error) => alert(`Refund failed: ${error.message}`),
      },
    );
  };

  if (
    !canWithdraw &&
    !canRefund &&
    !(hasDonated && campaign.status === 2 && campaign.isOwnerVerified)
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
          Campaign Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canWithdraw && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {campaign.status === 1
                ? "Campaign was successful! You can now withdraw the funds."
                : "As a verified owner, you can withdraw funds even though the target was not met."}
            </p>
            <Button className="w-full" onClick={handleWithdraw} disabled={isWithdrawing}>
              <Download className="w-4 h-4 mr-2" />
              {isWithdrawing ? "Processing..." : "Withdraw Funds"}
            </Button>
          </div>
        )}

        {showVerifiedOwnerPrivilege && (
          <Alert variant="default" className="border-purple-200 bg-purple-50 text-purple-800">
            <ShieldCheck className="h-4 w-4 !text-purple-800" />
            <AlertTitle>Verified Owner Privilege</AlertTitle>
            <AlertDescription className="text-xs text-purple-700">
              As a verified owner, you can withdraw the funds even if the campaign fails.
            </AlertDescription>
          </Alert>
        )}

        {canRefund && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              This campaign did not meet its target. You can get a refund for your donation.
            </p>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleRefund}
              disabled={isRefunding}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isRefunding ? "Processing..." : "Refund Donation"}
            </Button>
          </div>
        )}

        {hasDonated && !canRefund && campaign.status === 2 && campaign.isOwnerVerified && (
          <Alert variant="destructive">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Refunds Not Available</AlertTitle>
            <AlertDescription className="text-xs">
              The owner of this campaign is verified and is eligible to withdraw the funds even
              though the target was not met. Refunds are not available.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignActions;
