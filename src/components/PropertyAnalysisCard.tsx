
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyAnalysisCardProps {
  address: string;
  estimatedTotal: string;
  isLoading?: boolean;
}

const PropertyAnalysisCard: React.FC<PropertyAnalysisCardProps> = ({ 
  address, 
  estimatedTotal,
  isLoading = false
}) => {
  return (
    <motion.div
      className="w-full p-6 rounded-xl mb-8 bg-[#8B5CF6] shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 font-fahkwang">
            Property Analysis
          </h2>
          <p className="text-sm text-white/80 mb-2">
            {address}
          </p>
          <p className="text-sm text-white/90 mb-3 max-w-sm">
            We've analyzed your property and identified several monetization opportunities based on its features and location.
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-semibold text-white">Potential Monthly Income</span>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-10 w-24 rounded-md bg-purple-300/30" />
          ) : (
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              {estimatedTotal}
              <span className="text-base font-normal text-white/70">/mo</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-white/80">
        <p className="flex items-center">
          <ArrowRight className="h-4 w-4 mr-1 inline" />
          Select which assets you want to monetize below
        </p>
      </div>
    </motion.div>
  );
};

export default PropertyAnalysisCard;
