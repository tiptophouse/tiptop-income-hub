
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface AssetCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  earnings: string;
  onClick: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  icon,
  title,
  description,
  earnings,
  onClick,
}) => (
  <Card 
    className="asset-card border border-[#E5DEFF] hover:border-[#8B5CF6] bg-white/90 backdrop-blur-sm" 
    onClick={onClick}
  >
    <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center space-y-2 sm:space-y-3 h-full">
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#F3ECFF] flex items-center justify-center mt-2 sm:mt-3">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-medium text-[#6E59A5]">{title}</h3>
      <p className="text-xs md:text-sm text-[#552B1B]/70 line-clamp-2">
        {description}
      </p>
      <p className="text-xs md:text-sm font-semibold text-[#8B5CF6]">
        {earnings}
      </p>
    </CardContent>
  </Card>
);

export default AssetCard;
