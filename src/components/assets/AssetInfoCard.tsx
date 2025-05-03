
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AssetInfoCardProps {
  assetId: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AssetInfoCard: React.FC<AssetInfoCardProps> = ({ assetId, title, icon, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`asset-info-card ${assetId} border-[#E5DEFF] hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm ${className}`}>
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="bg-[#F3ECFF] p-3 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-xl text-[#6E59A5] font-fahkwang">{title}</CardTitle>
        </CardHeader>
        <CardContent className="font-work-sans text-[#552B1B]/80">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetInfoCard;
