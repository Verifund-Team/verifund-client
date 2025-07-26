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

const MOCK_RECENT_DONATIONS = [
  {
    id: 1,
    donor: "0x1a2b...3c4d",
    amount: 500000,
    timestamp: "2024-01-20T10:30:00Z",
    message: "Semoga bermanfaat untuk adik-adik",
  },
  {
    id: 2,
    donor: "0x5e6f...7g8h",
    amount: 1000000,
    timestamp: "2024-01-20T09:15:00Z",
    message: "Untuk masa depan anak-anak Indonesia",
  },
  {
    id: 3,
    donor: "0x9i0j...1k2l",
    amount: 250000,
    timestamp: "2024-01-20T08:45:00Z",
    message: "",
  },
  {
    id: 4,
    donor: "0x3m4n...5o6p",
    amount: 750000,
    timestamp: "2024-01-19T16:20:00Z",
    message: "Barakallahu fiikum",
  },
  {
    id: 5,
    donor: "0x7q8r...9s0t",
    amount: 2000000,
    timestamp: "2024-01-19T14:10:00Z",
    message: "Semoga berkah dan bermanfaat",
  },
];
export type TDonation = {
  id: number;
  donor: string;
  amount: number;
  timestamp: string;
  message: string;
};

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetCampaignDetail(params.id);

  if (isLoading) return <CampaignDetailSkeleton />;
  if (isError) return <CampaignDetailError />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CampaignImage data={data} />
          <CampaignDescriptionInfo data={data!} />
          <NewestDonation data={MOCK_RECENT_DONATIONS} />
        </div>

        <div className="space-y-6">
          <DonationForm />
          <CampaignerInfo data={data!} />
        </div>
      </div>
    </div>
  );
}
