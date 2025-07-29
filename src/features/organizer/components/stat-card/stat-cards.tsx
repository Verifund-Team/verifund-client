"use client";

import { DollarSign, List, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { web3Service } from "@/lib/web3";
import { toast } from "sonner";
import { Campaign } from "@/features/campaign/api/get-campaigns";
import StatSkeleton from "./stat-skeleton";
import StatCard from "./stat-card";

const StatCards = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address: currentAddress, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !currentAddress) {
      setIsLoading(false);
      setCampaigns([]);
      return;
    }

    const fetchMyCampaigns = async () => {
      setIsLoading(true);
      try {
        const allCampaignAddresses = await web3Service.getAllCampaigns();
        const allCampaignDetailsPromises = allCampaignAddresses.map((address) =>
          web3Service.getCampaignDetails(address),
        );
        const allCampaigns = await Promise.all(allCampaignDetailsPromises);

        const filteredCampaigns = allCampaigns.filter(
          (campaign) => campaign.owner.toLowerCase() === currentAddress?.toLowerCase(),
        );
        setCampaigns(filteredCampaigns);
        console.log(filteredCampaigns);
      } catch (err) {
        toast.error("Failed to get campaigns data: " + err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCampaigns();
  }, [currentAddress, isConnected]);

  const totalRaised =
    campaigns?.reduce((sum, campaign) => sum + parseFloat(campaign.raised), 0) || 0;
  const activeCampaigns = campaigns?.filter((c) => c.status === 0).length || 0;
  const totalCampaigns = campaigns?.length || 0;

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
        prefix="Rp"
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
