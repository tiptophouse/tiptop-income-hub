
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssetInfoCardProps {
  assetId: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AssetInfoCard: React.FC<AssetInfoCardProps> = ({ assetId, title, icon, children }) => {
  return (
    <Card className="border border-[#E5DEFF] mb-6">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="bg-[#F3ECFF] p-3 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl text-[#6E59A5] font-fahkwang">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-work-sans">
        {children}
      </CardContent>
    </Card>
  );
};

export default AssetInfoCard;
