
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
      <Card className={`asset-info-card ${assetId} border-[#3A3A3A] hover:shadow-md transition-all duration-300 bg-[#2A2A2A]/90 backdrop-blur-sm ${className}`}>
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="bg-[#333] p-3 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-xl text-white font-fahkwang">{title}</CardTitle>
        </CardHeader>
        <CardContent className="font-work-sans text-gray-300">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetInfoCard;
