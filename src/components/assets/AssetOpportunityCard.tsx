
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  <Card className="border border-[#E5DEFF] hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="bg-[#F3ECFF] p-3 rounded-full">
        {asset.icon}
      </div>
      <div className="flex-1">
        <CardTitle className="text-lg text-[#6E59A5]">
          {asset.title}
        </CardTitle>
        <p className="text-lg font-bold text-[#8B5CF6]">{asset.estimatedIncome}</p>
      </div>
      <Checkbox
        id={`check-${asset.id}`}
        checked={checked}
        onCheckedChange={onChange}
        className="h-6 w-6 border-2 border-[#8B5CF6] rounded-md"
      />
    </CardHeader>
    <CardContent>
      <p className="text-[#552B1B]">{asset.details}</p>
    </CardContent>
  </Card>
);

export default AssetOpportunityCard;
