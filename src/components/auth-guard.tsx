"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import CampaignsListPageSkeleton from "@/features/campaign/components/campaign-list/campaign-list-skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Readonly<AuthGuardProps>) {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isConnecting) {
      return;
    }

    if (!isConnected) {
      router.push("/");
    } else {
      setIsChecked(true);
    }
  }, [isConnected, isConnecting, router]);

  if (!isChecked) {
    return <CampaignsListPageSkeleton />;
  }

  return <>{children}</>;
}
