"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { web3Service } from "@/lib/web3";
import { formatIDRX, formatTimeRemaining } from "@/lib/utils";
import { useAccount } from "wagmi";
import { Campaign } from "@/features/campaign/api/get-campaigns";
import { CAMPAIGN_STATUS_CONFIG } from "@/lib/constants";
import { toast } from "sonner";

const fetchIpfsMetadata = async (ipfsHash: string) => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get IPFS metadata: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error("Failed to get IPFS metadata: " + error);
    return {};
  }
};

const CampaignsTab = () => {
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address: currentAddress, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !currentAddress) {
      setIsLoading(false);
      setMyCampaigns([]);
      return;
    }

    const fetchMyCampaigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allCampaignAddresses = await web3Service.getAllCampaigns();
        const allCampaignDetailsPromises = allCampaignAddresses.map((address) =>
          web3Service.getCampaignDetails(address),
        );
        const allCampaigns = await Promise.all(allCampaignDetailsPromises);

        const filteredCampaigns = allCampaigns.filter(
          (campaign) => campaign.owner.toLowerCase() === currentAddress.toLowerCase(),
        );

        const campaignsWithMetadata = await Promise.all(
          filteredCampaigns.map(async (campaign) => {
            const metadata = await fetchIpfsMetadata(campaign.ipfsHash);
            return { ...campaign, metadata };
          }),
        );

        setMyCampaigns(campaignsWithMetadata);
      } catch (err) {
        toast.error("failed to get campaign data: " + err);
        setError("Failed to get campaign data, Try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCampaigns();
  }, [currentAddress, isConnected]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">My Campaigns</h3>
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create new campaign
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Campaigns</h3>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create new campaign
        </Button>
      </div>

      {myCampaigns.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {myCampaigns.map((campaign) => (
            <Card key={campaign.address} className="overflow-hidden pt-0 flex flex-col">
              <div className="relative">
                <div className="relative w-full h-48">
                  <Image
                    src={campaign.metadata?.image || "/placeholder.svg"}
                    alt={campaign.name}
                    className="object-cover"
                    fill
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <Badge
                  variant={CAMPAIGN_STATUS_CONFIG[campaign.status]?.variant || "default"}
                  className="absolute top-2 right-2"
                >
                  {CAMPAIGN_STATUS_CONFIG[campaign.status]?.text || "Unknown"}
                </Badge>
              </div>

              <div className="flex flex-col flex-grow p-4">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10">
                    {campaign.metadata?.description || "Tidak ada deskripsi."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-4 flex-grow flex flex-col justify-end">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-primary">
                        {formatIDRX(parseFloat(campaign.raised))}
                      </span>
                      <span className="text-muted-foreground">
                        dari {formatIDRX(parseFloat(campaign.target))}
                      </span>
                    </div>
                    <Progress
                      value={(parseFloat(campaign.raised) / parseFloat(campaign.target)) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-end text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {campaign.timeRemaining > 0
                        ? formatTimeRemaining(campaign.timeRemaining)
                        : "Ended"}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Link href={`/campaign/${campaign.address}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        See detail
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You haven&#39;t created any campaigns yet
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignsTab;
