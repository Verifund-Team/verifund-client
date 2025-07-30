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
    | "address"
    | "name"
    | "totalRaised"
    | "target"
    | "timeRemaining"
    | "isOwnerVerified"
    | "metadata"
    | "status"
  >;
};

export const getStatusProps = (status: number) => {
  switch (status) {
    case 0:
      return { text: "Active", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" };
    case 1:
      return { text: "Successful", className: "bg-green-100 text-green-800 hover:bg-green-100" };
    case 2:
      return { text: "Failed", className: "bg-red-100 text-red-800 hover:bg-red-100" };
    default:
      return { text: "Unknown", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" };
  }
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

  const raisedAmount = parseFloat(campaign.totalRaised);
  const targetAmount = parseFloat(campaign.target);
  const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;
  const statusProps = getStatusProps(campaign.status);

  const title = campaign.name;
  const description = campaign.metadata?.description || "No description available.";
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
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline" className={statusProps.className}>
              {statusProps.text}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3 h-[120px]">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex flex-col flex-grow">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-primary">{formatIDRX(raisedAmount)}</span>
                <span className="text-muted-foreground">of {formatIDRX(targetAmount)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex justify-end text-sm text-muted-foreground">
              <div>{formatTimeRemaining(campaign.timeRemaining)}</div>
            </div>
          </div>

          <div className="">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">
                by {campaign.metadata?.creatorName}
              </span>
              {campaign.isOwnerVerified && (
                <Badge variant="default">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <Button onClick={handleDonateClick} className="w-full">
              Donate Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CampaignCard;
