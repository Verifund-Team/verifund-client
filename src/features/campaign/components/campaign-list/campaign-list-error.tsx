import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useGetCampaigns } from "../../api/get-campaigns";

const CampaignListError = () => {
  const { refetch } = useGetCampaigns();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Terjadi Kesalahan</h3>
        <p className="text-muted-foreground mb-4">Gagal memuat data kampanye. Silakan coba lagi.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Coba Lagi
        </Button>
      </div>
    </div>
  );
};

export default CampaignListError;
