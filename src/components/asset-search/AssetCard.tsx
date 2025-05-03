
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
    className="asset-card border-[#3A3A3A] hover:border-[#8B5CF6] bg-[#2A2A2A]/90 backdrop-blur-sm h-full" 
    onClick={onClick}
  >
    <CardContent className="p-1.5 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center text-center space-y-0.5 sm:space-y-1 md:space-y-2 lg:space-y-3 h-full">
      <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-[#333] flex items-center justify-center mt-1 sm:mt-2">
        {icon}
      </div>
      <h3 className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium text-white truncate max-w-full">{title}</h3>
      <p className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm text-gray-400 line-clamp-2">
        {description}
      </p>
      <p className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-[#8B5CF6]">
        {earnings}
      </p>
    </CardContent>
  </Card>
);

export default AssetCard;
