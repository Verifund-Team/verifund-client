"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { formatIDRX } from "@/lib/utils";
import { useGetCampaigns } from "../../api/get-campaigns";
import { CampaignDetail } from "../../api/get-campaign-detail";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignerInfoProps {
  campaign: CampaignDetail;
}

const CampaignerInfo = ({ campaign }: CampaignerInfoProps) => {
  const { data: allCampaigns, isLoading } = useGetCampaigns();

  const campaignerStats = useMemo(() => {
    if (!allCampaigns) {
      return { count: 0, totalRaised: 0 };
    }
    const campaignsByOwner = allCampaigns.filter((c) => c.owner === campaign.owner);
    const totalRaised = campaignsByOwner.reduce((sum, c) => sum + parseFloat(c.raised), 0);
    return {
      count: campaignsByOwner.length,
      totalRaised: totalRaised,
    };
  }, [allCampaigns, campaign.owner]);

  const creatorName = campaign.metadata?.creatorName || "Anonymous";

  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Campaigner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {creatorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground">{creatorName}</h4>
              {campaign.isOwnerVerified && (
                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2 break-all">{campaign.owner}</p>

            {isLoading ? (
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campaigns:</span>
                  <span className="font-medium">{campaignerStats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Raised:</span>
                  <span className="font-medium">{formatIDRX(campaignerStats.totalRaised)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignerInfo;
