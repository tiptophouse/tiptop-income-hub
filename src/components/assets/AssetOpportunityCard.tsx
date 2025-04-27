
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface AssetOpportunityCardProps {
  asset: {
    id: string;
    title: string;
    icon: React.ReactNode;
    estimatedIncome: string;
    details: string;
  };
  checked: boolean;
  onChange: () => void;
}

const AssetOpportunityCard: React.FC<AssetOpportunityCardProps> = ({
  asset,
  checked,
  onChange,
}) => (
  <Card className="border border-[#f5f5f5] hover:shadow-lg transition-shadow p-4 bg-[#fffffe] rounded-xl">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-[#f8f4ff] p-3 rounded-full">
          {asset.icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-[#6E59A5]">{asset.title}</h3>
          <p className="text-lg font-bold text-[#8B5CF6]">{asset.estimatedIncome}</p>
        </div>
      </div>
      <Checkbox
        id={`check-${asset.id}`}
        checked={checked}
        onCheckedChange={onChange}
        className="h-6 w-6 border-2 border-[#8B5CF6] rounded-md"
      />
    </div>
    <CardContent className="p-0">
      <p className="text-[#552B1B]">{asset.details}</p>
    </CardContent>
  </Card>
);

export default AssetOpportunityCard;
