
import React from 'react';
import { motion } from 'framer-motion';

const AssetSearchHeader = () => {
  return (
    <motion.div 
      className="text-center py-8 md:py-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text font-fahkwang mb-3">
          Monetize Your Home Assets
        </h1>
        <p className="text-lg text-[#552B1B] max-w-2xl mx-auto mb-6 font-work-sans">
          Turn your property's untapped resources into monthly income
        </p>
      </motion.div>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-2 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="bg-[#F3ECFF]/70 px-3 py-1 rounded-full text-sm font-medium text-[#6E59A5]">Parking Space</span>
        <span className="bg-[#F3ECFF]/70 px-3 py-1 rounded-full text-sm font-medium text-[#6E59A5]">Solar Energy</span>
        <span className="bg-[#F3ECFF]/70 px-3 py-1 rounded-full text-sm font-medium text-[#6E59A5]">Unused Bandwidth</span>
        <span className="bg-[#F3ECFF]/70 px-3 py-1 rounded-full text-sm font-medium text-[#6E59A5]">Storage Space</span>
        <span className="bg-[#F3ECFF]/70 px-3 py-1 rounded-full text-sm font-medium text-[#6E59A5]">Garden & Outdoor</span>
      </motion.div>
    </motion.div>
  );
};

export default AssetSearchHeader;
