
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Property3DModelSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-48 w-full rounded-md" />
    <div className="flex justify-center">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tiptop-accent rounded-full" />
    </div>
    <p className="text-center text-sm text-muted-foreground">
      Generating 3D model from satellite imagery...
    </p>
  </div>
);

export default Property3DModelSkeleton;
