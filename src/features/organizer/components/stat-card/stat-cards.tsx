"use client";

import { DollarSign, List, Flame } from "lucide-react";
import StatSkeleton from "./stat-skeleton";
import StatCard from "./stat-card";
import { useGetMyCampaigns } from "../../api/get-my-campaigns";
import { useGetCampaigns } from "@/features/campaign/api/get-campaigns"; // <-- 1. Impor hook utama

const StatCards = () => {
  const { isLoading } = useGetCampaigns();
  const { data: myCampaigns } = useGetMyCampaigns();

  const totalRaised =
    myCampaigns?.reduce((sum, campaign) => sum + parseFloat(campaign.totalRaised), 0) || 0;
  const activeCampaigns = myCampaigns?.filter((c) => c.status === 0).length || 0;
  const totalCampaigns = myCampaigns?.length || 0;

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Total Donations"
        value={totalRaised}
        suffix=" IDRX"
        icon={DollarSign}
        color="var(--primary)"
        delay={0}
      />
      <StatCard
        title="Active Campaigns"
        value={activeCampaigns}
        icon={Flame}
        color="var(--primary)"
        delay={1}
      />
      <StatCard
        title="Total Campaigns"
        value={totalCampaigns}
        icon={List}
        color="var(--primary)"
        delay={2}
      />
    </div>
  );
};

export default StatCards;
