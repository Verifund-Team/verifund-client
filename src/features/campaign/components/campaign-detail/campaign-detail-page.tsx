"use client";

import CampaignImage from "./campaign-image";
import CampaignDescriptionInfo from "./campaign-description-info";
import NewestDonation from "./newest-donation";
import DonationForm from "./donation-form";
import CampaignerInfo from "./campaigner-info";
import { useParams } from "next/navigation";
import { useGetCampaignDetail } from "../../api/get-campaign-detail";
import CampaignDetailSkeleton from "./campaign-detail-skeleton";
import CampaignDetailError from "./campaign-detail-error";
import CampaignActions from "./campaign-actions";
import { useAccount } from "wagmi";
import GuardianAnalysis from "../guardian-analysis";

export type TDonation = {
  id: number;
  donor: string;
  amount: number;
  timestamp: string;
  message: string;
};

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { address: userWallet } = useAccount();
  const { data, isLoading, isError } = useGetCampaignDetail(params.id, userWallet);

  if (isLoading) return <CampaignDetailSkeleton />;
  if (isError) return <CampaignDetailError />;

  return (
    <div className="min-h-[calc(100vh-12rem)] container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CampaignImage data={data} />
          <CampaignDescriptionInfo data={data!} />
          <NewestDonation campaignAddress={data!.address} />
        </div>

        <div className="space-y-6">
          <DonationForm campaign={data!} />
          {data?.metadata?.guardianAnalysis && (
            <GuardianAnalysis analysis={data.metadata.guardianAnalysis} />
          )}
          <CampaignerInfo campaign={data!} />
          <CampaignActions campaign={data!} />
        </div>
      </div>
    </div>
  );
}
