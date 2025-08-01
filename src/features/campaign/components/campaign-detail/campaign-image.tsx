import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { Campaign } from "../../api/get-campaigns";

const CampaignImage = ({ data }: { data: Campaign | undefined }) => {
  const imageUrl = data?.metadata?.image || IMAGE_PLACEHOLDER;
  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-64 md:h-96 relative"></div>
          <Image src={imageUrl} alt={data!.name} className="object-cover rounded-t-lg" fill />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignImage;
