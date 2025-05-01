
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AssetOpportunitiesLoading: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
        Analyzing Asset Opportunities...
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border p-4 shadow-sm">
            <div className="flex items-start gap-4 mb-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetOpportunitiesLoading;
