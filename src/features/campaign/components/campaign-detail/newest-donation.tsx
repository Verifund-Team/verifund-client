"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatAddress, formatIDRX } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useGetRecentDonations, CombinedTransaction } from "../../api/get-recent-donations";
import { Skeleton } from "@/components/ui/skeleton";

interface NewestDonationProps {
  campaignAddress: string;
}

const NewestDonation = ({ campaignAddress }: NewestDonationProps) => {
  const { data: donations, isLoading } = useGetRecentDonations(campaignAddress);

  const renderDonation = (donation: CombinedTransaction) => {
    const key = donation.type === "wallet" ? donation.txHash : donation.id;
    const donorName = donation.type === "wallet" ? formatAddress(donation.donor) : donation.donor;
    const initial = donorName.slice(0, 2).toUpperCase();

    return (
      <div key={key} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground truncate">{donorName}</p>
            <p className="text-sm font-semibold text-primary whitespace-nowrap">
              {formatIDRX(parseFloat(donation.amount))}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(donation.timestamp * 1000), "d MMMM yyyy HH:mm", { locale: id })}
          </p>
          {/* Message is not available in the combined transaction type, can be added if needed */}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 mr-2 text-primary" />
          Donasi Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : donations && donations.length > 0 ? (
          <div className="space-y-4">{donations.slice(0, 5).map(renderDonation)}</div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Jadilah donatur pertama untuk kampanye ini!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NewestDonation;
