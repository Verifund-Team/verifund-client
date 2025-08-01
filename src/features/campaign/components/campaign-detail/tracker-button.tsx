import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import Link from "next/link";
import React from "react";

const TrackerButton = ({ campaignAddress }: { campaignAddress: string }) => {
  return (
    <Link href={`/campaigns/${campaignAddress}/tracker`}>
      <Button className="w-full mt-2 bg-primary">
        <LineChart className="w-4 h-4 mr-2" />
        Show Fund Flow Details
      </Button>
    </Link>
  );
};

export default TrackerButton;
