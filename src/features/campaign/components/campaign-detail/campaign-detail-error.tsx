import { AlertTriangle } from "lucide-react";

const CampaignDetailError = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-13rem)]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Gagal Memuat Kampanye</h3>
        <p className="text-muted-foreground mb-6">
          Terjadi kesalahan saat mengambil data detail kampanye. Silakan coba lagi.
        </p>
      </div>
    </div>
  );
};

export default CampaignDetailError;
