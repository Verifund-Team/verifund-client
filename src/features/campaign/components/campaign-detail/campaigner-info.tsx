import { AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { formatIDRX } from "@/lib/utils";
import { Campaign } from "../../api/get-campaigns";

const CampaignerInfo = ({ data }: { data: Campaign }) => {
  // TODO: HANDLE THIS
  const MOCK_CAMPAIGNS_COUNT = 1;
  const MOCK_TOTAL_RAISED = 1000000;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tentang Campaigner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {data.metadata.creatorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground">{data.metadata.creatorName}</h4>
              {data.isOwnerVerified && (
                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Terverifikasi
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{data.owner}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kampanye:</span>
                <span className="font-medium">{MOCK_CAMPAIGNS_COUNT}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Terkumpul:</span>
                <span className="font-medium">{formatIDRX(MOCK_TOTAL_RAISED)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignerInfo;
