
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
    className="border border-[#B993FE]/60 hover:border-[#8B5CF6] transition-colors duration-300" 
    onClick={onClick}
  >
    <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-3 h-full">
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#F3ECFF] flex items-center justify-center mt-2 sm:mt-3">
        {icon}
      </div>
      <h3 className="text-xs sm:text-sm md:text-base font-medium">{title}</h3>
      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      <p className="text-[10px] sm:text-xs md:text-sm text-[#8B5CF6] font-medium">
        {earnings}
      </p>
    </CardContent>
  </Card>
);

export default AssetCard;
