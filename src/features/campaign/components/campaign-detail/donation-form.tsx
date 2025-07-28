"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard } from "lucide-react";
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

  const handleWalletDonate = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Silakan masukkan jumlah donasi yang valid.");
      return;
    }

    donate(
      {
        campaignAddress: campaign.address,
        amount: donationAmount,
      },
      {
        onSuccess: (txHash) => {
          alert(`Donasi berhasil! Hash Transaksi: ${txHash}`);
          setDonationAmount("");
        },
        onError: (error) => {
          alert(`Gagal berdonasi: ${error.message}`);
        },
      },
    );
  };

  // Handler for off-chain donation via payment gateway
  const handleIDRXPayment = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Silakan masukkan jumlah donasi yang valid.");
      return;
    }
    if (!donorEmail) {
      alert("Silakan masukkan email Anda untuk konfirmasi.");
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
        // Open the payment gateway link in a new tab
        window.open(result.paymentUrl, "_blank");
        alert(
          `Link pembayaran telah dibuat! Silakan selesaikan pembayaran. Referensi: ${result.reference}`,
        );

        // Reset form state
        setDonationAmount("");
        setDonorEmail("");
        setShowIDRXPayment(false);
      } else {
        throw new Error(result.error || "Gagal membuat link pembayaran.");
      }
    } catch (error) {
      console.error("IDRX Payment Error:", error);
      alert(`Terjadi kesalahan: ${(error as Error).message}`);
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
          Donasi Sekarang
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="amount">Jumlah Donasi (IDRX)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Masukkan jumlah donasi"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-foreground mb-2">Pilih Metode Pembayaran:</p>

          <Button
            className="w-full"
            onClick={handleWalletDonate}
            disabled={!donationAmount || isProcessing}
          >
            {isDonating ? "Memproses..." : "Bayar dengan Wallet"}
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setShowIDRXPayment(!showIDRXPayment)}
            disabled={isProcessing}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Bayar (Tanpa Wallet)
          </Button>
        </div>

        {showIDRXPayment && (
          <div className="p-4 bg-muted rounded-lg border space-y-3">
            <Label htmlFor="email">Email untuk Konfirmasi</Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              disabled={idrxPaymentLoading}
            />
            <Button
              className="w-full"
              onClick={handleIDRXPayment}
              disabled={!donationAmount || !donorEmail || idrxPaymentLoading}
            >
              {idrxPaymentLoading ? "Membuat Link..." : "Buat Link Pembayaran"}
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          <p>• Donasi menggunakan token IDRX.</p>
          <p>• Biaya gas (jika via wallet) dibayar dengan LSK.</p>
          <p>• Dana masuk ke smart contract yang aman.</p>
          <p>• transparan dan dapat dilacak di blockchain.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
