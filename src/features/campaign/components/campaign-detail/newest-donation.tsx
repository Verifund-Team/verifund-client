"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { formatAddress, formatIDRX } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useGetRecentDonations, CombinedTransaction } from "../../api/get-recent-donations";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface NewestDonationProps {
  campaignAddress: string;
}

const NewestDonation = ({ campaignAddress }: NewestDonationProps) => {
  const { data: donations, isLoading } = useGetRecentDonations(campaignAddress);

  const filteredDonations = useMemo(() => {
    if (!donations) return [];
    return donations.filter((donation) => {
      if (donation.type === "wallet" || donation.type === "transfer") {
        return true;
      }
      if (donation.type === "idrx") {
        const excludedStatuses = ["WAITING_FOR_PAYMENT", "EXPIRED", "FAILED"];
        return !excludedStatuses.includes(donation.paymentStatus.toUpperCase());
      }
      return false;
    });
  }, [donations]);

  const renderDonation = (donation: CombinedTransaction) => {
    const donorName =
      donation.type === "idrx" && donation.donor === "BAGAS RIZKI GUNARDI"
        ? "IDRX Gateway"
        : donation.type === "wallet"
          ? formatAddress(donation.donor)
          : donation.donor;

    return (
      // @ts-expect-error: id is not in type
      <div key={donation.txHash ?? donation.id} className="border border-border rounded-lg p-4">
        {/* Top Section: Donor Info and Amount */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-foreground">{donorName}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">
              {formatIDRX(parseFloat(donation.amount))}
            </p>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="text-xs text-muted-foreground space-y-1">
          {donation.type === "idrx" && (
            <>
              <p>Reference: {donation.reference}</p>
              <p>Order ID: {donation.merchantOrderId}</p>
            </>
          )}
          {donation.type === "wallet" && <p>Block: #{donation.blockNumber}</p>}
          <p>
            Date:{" "}
            {format(new Date(donation.timestamp * 1000), "d MMMM yyyy, HH:mm:ss", { locale: id })}
          </p>
          {donation.txHash && (
            <p>
              Tx Hash:
              <Link
                href={`https://sepolia-blockscout.lisk.com/tx/${donation.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {`${donation.txHash.slice(0, 10)}...${donation.txHash.slice(-8)}`}
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 mr-2 text-primary" />
          Donation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredDonations && filteredDonations.length > 0 ? (
          <div className="space-y-4">{filteredDonations.slice(0, 5).map(renderDonation)}</div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Be the first to donate to this campaign!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NewestDonation;
