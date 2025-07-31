"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Wallet, Search, Info } from "lucide-react";
import { formatAddress, formatDate, formatIDRX } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useGetWithdrawalTimestamp } from "@/features/campaign/api/get-withdrawal-timestamp";
import { useGetCampaignDetail } from "../../api/get-campaign-detail";
import { useGetSpendingHistory } from "../../api/get-spending-history";
import { useAccount } from "wagmi";
import { useParams } from "next/navigation";
import TrackerSkeleton from "./tracker-skeleton";

const TrackerPage = () => {
  const params = useParams<{ id: string }>();
  const { address: userWallet } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: campaignDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCampaignDetail(params.id, userWallet);
  const ownerAddress = campaignDetails?.owner;

  const { data: withdrawalTimestamp, isLoading: isLoadingTimestamp } = useGetWithdrawalTimestamp(
    params.id,
  );

  const {
    data: history,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
  } = useGetSpendingHistory(params.id, ownerAddress);

  const isLoading = isLoadingDetails || isLoadingTimestamp || isLoadingHistory;
  const isError = isErrorDetails || isErrorHistory;

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    if (!searchTerm) return history;
    return history.filter((tx) => tx.to.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [history, searchTerm]);

  if (!isClient) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load fund flow data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          <TrackerSkeleton />
          <TrackerSkeleton />
          <TrackerSkeleton />
        </TableBody>
      );
    }

    if (withdrawalTimestamp === null) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Info className="h-6 w-6" />
                <span>The campaign owner has not withdrawn the funds yet.</span>
                <span>Spending history will be available after withdrawal.</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (filteredHistory && filteredHistory.length > 0) {
      return (
        <TableBody>
          {filteredHistory.map((tx) => (
            <TableRow key={tx.hash}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm">{formatAddress(tx.to)}</code>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="destructive" className="font-semibold">
                  - {formatIDRX(tx.value)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(tx.timestamp)}</TableCell>
              <TableCell>
                <Link
                  href={`https://sepolia-blockscout.lisk.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  View <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center h-24">
            {searchTerm
              ? "No transactions found for this address."
              : "No spending history has been recorded after withdrawal."}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Campaign Fund Flow</h1>
        <p className="text-muted-foreground text-lg">
          Transparently tracking every expenditure by the campaign owner.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoadingDetails ? <Skeleton className="h-6 w-3/4" /> : campaignDetails?.name}
          </CardTitle>
          <CardDescription>
            History of outgoing transactions from the owner&#39;s wallet{" "}
            <code className="text-xs bg-muted p-1 rounded">
              {isLoadingDetails ? "..." : formatAddress(ownerAddress)}
            </code>{" "}
            after the funds were withdrawn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by recipient address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
              </TableRow>
            </TableHeader>
            {renderContent()}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackerPage;
