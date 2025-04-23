
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-10 py-12 px-4 sm:px-0"
    >
      <div className="mx-auto w-full max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30"
        >
          <h2 className="text-2xl font-bold text-[#8B5CF6] mb-4 text-center">Property Map View</h2>
          <PropertyMap address={address} />
        </motion.div>
      </div>
      
      <div className="mx-auto w-full max-w-5xl">
        <PropertyInsights address={address} />
      </div>
    </motion.div>
  );
};

export default PropertyAnalysisSection;
