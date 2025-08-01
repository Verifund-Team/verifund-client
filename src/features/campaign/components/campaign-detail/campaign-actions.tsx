"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ActionDialog } from "@/components/ui/action-dialog";
import {
  AlertTriangle,
  Download,
  RotateCcw,
  ShieldCheck,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { useAccount } from "wagmi";
import { CampaignDetail } from "../../api/get-campaign-detail";
import { useWithdrawFromCampaign, useRefundFromCampaign } from "../../api/campaign-fund-actions";
import { useUpdatePeakBalance } from "../../api/update-peak-balance";

interface CampaignActionsProps {
  campaign: CampaignDetail;
}

const CampaignActions = ({ campaign }: CampaignActionsProps) => {
  const { address: userWallet } = useAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFromCampaign();
  const { mutate: refund, isPending: isRefunding } = useRefundFromCampaign();
  const { mutate: updatePeakBalance, isPending: isUpdatingPeak } = useUpdatePeakBalance();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    txHash: "",
    status: "success" as "success" | "error",
  });

  const isOwner = userWallet && userWallet.toLowerCase() === campaign.owner.toLowerCase();
  const hasDonated = parseFloat(campaign.userDonation) > 0;

  const hasExternalTransfers =
    parseFloat(campaign.actualBalance || "0") > parseFloat(campaign.raised || "0");

  const canUpdatePeakBalance =
    isOwner &&
    campaign.timeRemaining === 0 &&
    !campaign.isPeakBalanceUpdated &&
    hasExternalTransfers &&
    parseFloat(campaign.actualBalance || "0") > 0;

  const canWithdraw =
    isOwner &&
    !campaign.isWithdrawn &&
    campaign.timeRemaining === 0 &&
    (campaign.isPeakBalanceUpdated || !hasExternalTransfers) &&
    (campaign.status === 1 || (campaign.status === 2 && campaign.isOwnerVerified));

  const canRefund =
    hasDonated &&
    campaign.timeRemaining === 0 &&
    campaign.status === 2 &&
    !campaign.isOwnerVerified;

  const isProcessing = isWithdrawing || isRefunding || isUpdatingPeak;

  const handleUpdatePeakBalance = () => {
    updatePeakBalance(
      { campaignAddress: campaign.address },
      {
        onSuccess: (txHash) => {
          setDialogContent({
            title: "Peak Balance Updated",
            description: "The final raised amount has been successfully recorded on-chain.",
            txHash,
            status: "success",
          });
          setIsDialogOpen(true);
        },
        onError: (error) => {
          setDialogContent({
            title: "Update Peak Balance Failed",
            description: error.message,
            txHash: "",
            status: "error",
          });
          setIsDialogOpen(true);
        },
      },
    );
  };

  const handleWithdraw = () => {
    withdraw(
      { campaignAddress: campaign.address },
      {
        onSuccess: (txHash) => {
          setDialogContent({
            title: "Withdrawal Successful",
            description: "The campaign funds have been successfully withdrawn.",
            txHash,
            status: "success",
          });
          setIsDialogOpen(true);
        },
        onError: (error) => {
          setDialogContent({
            title: "Withdrawal Failed",
            description: error.message,
            txHash: "",
            status: "error",
          });
          setIsDialogOpen(true);
        },
      },
    );
  };

  const handleRefund = () => {
    refund(
      { campaignAddress: campaign.address },
      {
        onSuccess: (txHash) => {
          setDialogContent({
            title: "Refund Successful",
            description: "Your donation has been successfully refunded.",
            txHash,
            status: "success",
          });
          setIsDialogOpen(true);
        },
        onError: (error) => {
          setDialogContent({
            title: "Refund Failed",
            description: error.message,
            txHash: "",
            status: "error",
          });
          setIsDialogOpen(true);
        },
      },
    );
  };

  if (
    !canWithdraw &&
    !canRefund &&
    !canUpdatePeakBalance &&
    !(hasDonated && campaign.status === 2 && campaign.isOwnerVerified)
  ) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
            Campaign Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {canUpdatePeakBalance && (
            <Alert variant="default" className="border-yellow-200 bg-yellow-50 text-yellow-800">
              <BarChart2 className="h-4 w-4 !text-yellow-800" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription className="text-xs text-yellow-700 space-y-3">
                <p>
                  Direct transfers were detected. Before withdrawing, you must update the peak
                  balance to record the final donation total.
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleUpdatePeakBalance}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Update Peak Balance"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {canWithdraw && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {campaign.status === 1
                  ? "Campaign was successful! You can now withdraw the funds."
                  : "As a verified owner, you can withdraw funds even though the target was not met."}
              </p>
              <Button className="w-full" onClick={handleWithdraw} disabled={isProcessing}>
                <Download className="w-4 h-4 mr-2" />
                {isWithdrawing ? "Processing..." : "Withdraw Funds"}
              </Button>
            </div>
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
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isRefunding ? "Processing..." : "Refund Donation"}
              </Button>
            </div>
          )}

          {hasDonated && !canRefund && campaign.status === 2 && campaign.isOwnerVerified && (
            <Alert variant="destructive">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Campaign Failed - Refunds Not Available</AlertTitle>
              <AlertDescription className="text-xs">
                The owner of this campaign is verified and is eligible to withdraw the funds even
                though the target was not met. Refunds are not available.
              </AlertDescription>
            </Alert>
          )}

          {campaign.isWithdrawn && (
            <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 !text-green-800" />
              <AlertTitle>Funds Withdrawn</AlertTitle>
              <AlertDescription className="text-xs text-green-700">
                The funds for this campaign have been successfully withdrawn by the owner.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <ActionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        status={dialogContent.status}
        title={dialogContent.title}
        description={dialogContent.description}
        txHash={dialogContent.txHash}
      />
    </>
  );
};

export default CampaignActions;
