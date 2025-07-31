import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const TrackerSkeleton = () => {
  return (
    <TableRow>
      <TableCell colSpan={4}>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    </TableRow>
  );
};

export default TrackerSkeleton;
