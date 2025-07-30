"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Wallet, CreditCard, Info, ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@xellar/kit";
import { useDonateToCampaign } from "../../api/donate-to-campaign";
import { Campaign } from "../../api/get-campaigns";
import { formatIDRX } from "@/lib/utils";

interface DonationFormProps {
  campaign: Campaign;
}

const DonationForm = ({ campaign }: DonationFormProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const { isConnected } = useAccount();
  const { open: openConnectModal } = useConnectModal();
  const { mutate: donate, isPending: isDonating } = useDonateToCampaign();

  const [showIDRXPayment, setShowIDRXPayment] = useState(false);
  const [idrxPaymentLoading, setIDRXPaymentLoading] = useState(false);
  const [donorEmail, setDonorEmail] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    txHash: "",
    status: "success" as "success" | "error",
  });

  const isCampaignActive = campaign.status === 0;

  const handleWalletDonate = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setDialogContent({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        status: "error",
        txHash: "",
      });
      setIsDialogOpen(true);
      return;
    }
    donate(
      { campaignAddress: campaign.address, amount: donationAmount },
      {
        onSuccess: (txHash) => {
          setDialogContent({
            title: "Donation Successful",
            description: "Your donation has been successfully processed.",
            txHash,
            status: "success",
          });
          setIsDialogOpen(true);
          setDonationAmount("");
        },
        onError: (error) => {
          setDialogContent({
            title: "Donation Failed",
            description: error.message,
            status: "error",
            txHash: "",
          });
          setIsDialogOpen(true);
        },
      },
    );
  };

  const handleIDRXPayment = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setDialogContent({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        status: "error",
        txHash: "",
      });
      setIsDialogOpen(true);
      return;
    }
    if (!donorEmail) {
      setDialogContent({
        title: "Email Required",
        description: "Please enter your email for confirmation.",
        status: "error",
        txHash: "",
      });
      setIsDialogOpen(true);
      return;
    }

    setIDRXPaymentLoading(true);
    try {
      const response = await fetch("/api/idrx/mint-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          campaignAddress: campaign.address,
          donorEmail,
        }),
      });
      const result = await response.json();
      if (result.success && result.paymentUrl) {
        window.open(result.paymentUrl, "_blank");
        setDialogContent({
          title: "Payment Link Created",
          description: `Please complete the payment. Your reference is: ${result.reference}`,
          status: "success",
          txHash: "",
        });
        setIsDialogOpen(true);
        setDonationAmount("");
        setDonorEmail("");
        setShowIDRXPayment(false);
      } else {
        throw new Error(result.error || "Failed to create payment link.");
      }
    } catch (error) {
      setDialogContent({
        title: "An Error Occurred",
        description: (error as Error).message,
        status: "error",
        txHash: "",
      });
      setIsDialogOpen(true);
    } finally {
      setIDRXPaymentLoading(false);
    }
  };

  const isProcessing = isDonating || idrxPaymentLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-primary" />
            Donate Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCampaignActive ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="amount">Donation Amount (IDRX)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter donation amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  disabled={isProcessing}
                />
                {donationAmount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatIDRX(Number.parseInt(donationAmount) || 0)}
                  </p>
                )}
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-foreground mb-2">Select Payment Method:</p>
                <Button
                  className="w-full"
                  onClick={handleWalletDonate}
                  disabled={!donationAmount || isProcessing}
                >
                  {isDonating ? "Processing..." : "Pay with Wallet"}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowIDRXPayment(!showIDRXPayment)}
                  disabled={isProcessing}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay (Without Wallet)
                </Button>
              </div>
              {showIDRXPayment && (
                <div className="p-4 bg-muted rounded-lg border space-y-3">
                  <Label htmlFor="email">Email for Confirmation</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    disabled={idrxPaymentLoading}
                  />
                  <Button
                    className="w-full"
                    onClick={handleIDRXPayment}
                    disabled={!donationAmount || !donorEmail || idrxPaymentLoading}
                  >
                    {idrxPaymentLoading ? "Creating Link..." : "Create Payment Link"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg">
              <Info className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Donations are Closed</p>
              <p className="text-sm text-muted-foreground">
                This campaign is no longer active and is not accepting new donations.
              </p>
            </div>
          )}
          {isCampaignActive && (
            <Alert variant={campaign.isOwnerVerified ? "default" : "destructive"}>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>
                {campaign.isOwnerVerified ? "Verified Campaigner" : "Unverified Campaigner"}
              </AlertTitle>
              <AlertDescription className="text-xs">
                {campaign.isOwnerVerified
                  ? "This campaigner is verified. If the campaign target is not met, they can still withdraw the funds, and refunds will not be available to donors."
                  : "This campaigner is not verified. If the campaign target is not met, you will be able to refund your donation."}
              </AlertDescription>
            </Alert>
          )}
          <div className="text-xs text-muted-foreground space-y-1 pt-2">
            <p>• Donations use the IDRX token.</p>
            <p>• Gas fees (if using wallet) are paid with LSK.</p>
            <p>• Funds go directly to a secure smart contract.</p>
            <p>• 100% transparent and traceable on the blockchain.</p>
          </div>
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

export default DonationForm;
