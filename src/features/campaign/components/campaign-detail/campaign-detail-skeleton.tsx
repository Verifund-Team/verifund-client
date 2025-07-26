import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton placeholder for the Campaign Detail page.
 * This is displayed while the campaign data is being fetched.
 */
export default function CampaignDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content column skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* CampaignImage Skeleton */}
          <Skeleton className="aspect-video w-full rounded-lg" />

          {/* CampaignDescriptionInfo Skeleton */}
          <div className="space-y-4 rounded-lg border p-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* NewestDonation Skeleton */}
          <div className="space-y-4 rounded-lg border p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>

        {/* Sidebar column skeleton */}
        <div className="space-y-6">
          {/* DonationForm Skeleton */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* CampaignerInfo Skeleton */}
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
