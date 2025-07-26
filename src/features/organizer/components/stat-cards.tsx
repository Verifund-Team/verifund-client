import { Card, CardContent } from "@/components/ui/card";
import { useGetCampaigns } from "@/features/campaign/api/get-campaigns";
import { formatIDRX } from "@/lib/utils";

const StatCards = () => {
  const { data } = useGetCampaigns();
  const totalRaised = data?.reduce((sum, campaign) => sum + parseFloat(campaign.raised), 0);
  const activeCampaigns = data?.filter((c) => c.status === 0).length; // 0 = ongoing
  const totalCampaigns = data?.length;

  // TODO: RESOLVE THIS
  const MOCK_TOTAL_DONORS = 0;

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{formatIDRX(totalRaised)}</div>
          <div className="text-sm text-muted-foreground">Total Terkumpul</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{MOCK_TOTAL_DONORS}</div>
          <div className="text-sm text-muted-foreground">Total Donatur</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{activeCampaigns}</div>
          <div className="text-sm text-muted-foreground">Kampanye Aktif</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalCampaigns}</div>
          <div className="text-sm text-muted-foreground">Total Kampanye</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
