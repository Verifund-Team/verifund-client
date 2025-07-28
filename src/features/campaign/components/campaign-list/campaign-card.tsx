"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDRX, formatTimeRemaining } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { useAccount } from "wagmi";
import { useConnectModal } from "@xellar/kit";
import { Campaign } from "../../api/get-campaigns";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";

type Props = {
  campaign: Pick<
    Campaign,
    "address" | "name" | "raised" | "target" | "timeRemaining" | "isOwnerVerified" | "metadata"
  >;
};

const CampaignCard = ({ campaign }: Props) => {
  const { isConnected } = useAccount();
  const { open } = useConnectModal();

  const handleDonateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected) {
      e.preventDefault();
      open();
    }
  };

  const raisedAmount = parseFloat(campaign.raised);
  const targetAmount = parseFloat(campaign.target);
  const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;

  const title = campaign.name;
  const description = campaign.metadata?.description || "Tidak ada deskripsi tersedia.";
  const imageUrl = campaign.metadata?.image || IMAGE_PLACEHOLDER;
  const category = campaign.metadata?.category || "Uncategorized";

  return (
    <Link href={`/campaigns/${campaign.address}`} passHref>
      <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full flex flex-col pt-0">
        <div className="relative">
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Badge className="absolute top-3 left-3" variant="secondary">
            {category}
          </Badge>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-2 h-10">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex flex-col flex-grow">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-primary">{formatIDRX(raisedAmount)}</span>
                <span className="text-muted-foreground">dari {formatIDRX(targetAmount)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex justify-end text-sm text-muted-foreground">
              <div>{formatTimeRemaining(campaign.timeRemaining)}</div>
            </div>
          </div>

          <div className="pt-2 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">
                oleh {campaign.metadata.creatorName}
              </span>
              {campaign.isOwnerVerified && (
                <Badge variant="default">
                  <Shield className="w-3 h-3 mr-1" />
                  Terverifikasi
                </Badge>
              )}
            </div>

            <Button onClick={handleDonateClick} className="w-full">
              Donasi Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CampaignCard;
