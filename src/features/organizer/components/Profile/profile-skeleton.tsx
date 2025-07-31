import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <Card className="h-fit">
      <CardHeader className="text-center flex flex-col items-center space-y-2">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
};

export default ProfileSkeleton;
