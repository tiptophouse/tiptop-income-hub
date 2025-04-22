
import React from 'react';
import { motion } from 'framer-motion';
import PropertyMap from '../PropertyMap';
import PropertyInsights from '../PropertyInsights';

interface PropertyAnalysisSectionProps {
  address: string;
  show: boolean;
}

const PropertyAnalysisSection = ({ address, show }: PropertyAnalysisSectionProps) => {
  if (!show) return null;

  return (
    <motion.div
      key="analysis-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="mt-4 w-full max-w-4xl bg-white rounded-2xl p-4 shadow-md">
        <PropertyMap address={address} />
      </div>
      
      <div className="w-full max-w-4xl">
        <PropertyInsights address={address} />
      </div>
    </motion.div>
  );
};

export default PropertyAnalysisSection;
