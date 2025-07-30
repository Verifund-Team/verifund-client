"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, Info } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@xellar/kit";
import { useDonateToCampaign } from "../../api/donate-to-campaign";
import { Campaign } from "../../api/get-campaigns";

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

  const isCampaignActive = campaign.status === 0;

  const handleWalletDonate = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    donate(
      {
        campaignAddress: campaign.address,
        amount: donationAmount,
      },
      {
        onSuccess: (txHash) => {
          alert(`Donation successful! Transaction Hash: ${txHash}`);
          setDonationAmount("");
        },
        onError: (error) => {
          alert(`Donation failed: ${error.message}`);
        },
      },
    );
  };

  const handleIDRXPayment = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    if (!donorEmail) {
      alert("Please enter your email for confirmation.");
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
        alert(`Payment link created! Please complete the payment. Reference: ${result.reference}`);

        setDonationAmount("");
        setDonorEmail("");
        setShowIDRXPayment(false);
      } else {
        throw new Error(result.error || "Failed to create payment link.");
      }
    } catch (error) {
      console.error("IDRX Payment Error:", error);
      alert(`An error occurred: ${(error as Error).message}`);
    } finally {
      setIDRXPaymentLoading(false);
    }
  };

  const isProcessing = isDonating || idrxPaymentLoading;

  return (
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

        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          <p>• Donations use the IDRX token.</p>
          <p>• Gas fees (if using wallet) are paid with LSK.</p>
          <p>• Funds go directly to a secure smart contract.</p>
          <p>• 100% transparent and traceable on the blockchain.</p>
          <p>* We recommend using the payment gateway only when supporting verified campaigns.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
