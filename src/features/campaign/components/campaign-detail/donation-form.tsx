"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
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
  const { mutate: donate, isPending } = useDonateToCampaign();

  const handleDonate = () => {
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
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          {isConnected ? (
            <Button
              className="w-full bg-primary"
              onClick={handleDonate}
              disabled={!donationAmount || isPending}
            >
              {isPending ? "Memproses Donasi..." : "Kirim Donasi"}
            </Button>
          ) : (
            <Button className="w-full bg-primary" onClick={() => openConnectModal()}>
              Hubungkan Wallet untuk Donasi
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Donasi menggunakan token IDRX</p>
          <p>• Biaya gas dibayar dengan LSK</p>
          <p>• Dana langsung masuk ke smart contract</p>
          <p>• 100% transparan dan dapat dilacak</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
