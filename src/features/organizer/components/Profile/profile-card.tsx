"use client";

import { useAccount } from "wagmi";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertCircle, CheckCircle, Shield } from "lucide-react";

import ProfileSkeleton from "./profile-skeleton";
import ClipboardCopy from "./copy-to-clipboard";
import { useBadgeInfo } from "../../api/get-badge-info";
import { useClaimSBT } from "../../api/claim-sbt";

const ProfileCard = () => {
  const { address, isConnected } = useAccount();

  const { data: badgeInfo, isLoading } = useBadgeInfo(address, isConnected);
  const { mutate: claim, isPending: isClaimingSBT } = useClaimSBT();

  const handleClaimSBT = async () => {
    claim();
  };

  if (isLoading) return <ProfileSkeleton />;

  if (!isConnected || !address) {
    return (
      <Card className="h-fit">
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-20 w-20 my-auto" />
            <AlertDescription>Connect wallet to view your profile</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {address?.charAt(2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <ClipboardCopy textToCopy={address} />
            {badgeInfo?.isCurrentlyVerified ? (
              <Badge className="bg-primary text-primary-foreground">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {badgeInfo && !badgeInfo.isCurrentlyVerified && badgeInfo.hasWhitelistPermission && (
          <Alert>
            <AlertDescription className="flex flex-col items-center text-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Your verification has been received! Claim your verification SBT now.</span>
              <Button
                className="w-full mt-2 bg-primary"
                onClick={handleClaimSBT}
                disabled={isClaimingSBT}
              >
                {isClaimingSBT ? "Claiming..." : "Claim"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {badgeInfo && !badgeInfo.isCurrentlyVerified && !badgeInfo.hasWhitelistPermission && (
          <Alert>
            <AlertDescription className="flex flex-col items-center text-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Not yet verified. Submit verification to get SBT.</span>
              <Link
                href="https://docs.google.com/forms/d/1h7vU2ZmIMApamvkizJiUUVpRtkt0d9bVgb2N4gOUCws/viewform?edit_requested=true"
                target="_blank"
                className="w-full"
              >
                <Button variant="outline" className="w-full mt-2 bg-transparent">
                  Get Verification
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
