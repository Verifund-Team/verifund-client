import { Button } from "@/components/ui/button";
import { Calendar, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { formatIDRX, formatTimeRemaining } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { useGetCampaigns } from "@/features/campaign/api/get-campaigns";

const CAMPAIGN_STATUS_CONFIG: {
  [key: number]: { text: string; variant: BadgeProps["variant"] };
} = {
  0: { text: "Aktif", variant: "default" },
  1: { text: "Selesai", variant: "secondary" },
  2: { text: "Berakhir", variant: "destructive" }, // 'destructive' is good for showing target not met
};

const CampaignsTab = () => {
  const { data } = useGetCampaigns();
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Kampanye Saya</h3>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Buat Kampanye Baru
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data?.map((campaign) => (
          <Card key={campaign.address} className="overflow-hidden pt-0">
            <div className="relative">
              <div className="relative w-full h-48">
                <Image
                  src={campaign.metadata?.image || "/placeholder.svg"}
                  alt={campaign.name}
                  className="object-cover"
                  fill
                />
              </div>

              <Badge
                variant={CAMPAIGN_STATUS_CONFIG[campaign.status].variant}
                className="absolute top-2 right-2"
              >
                {CAMPAIGN_STATUS_CONFIG[campaign.status].text}
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {campaign.metadata?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
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
                    : "Selesai"}
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/campaign/${campaign.address}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CampaignsTab;
