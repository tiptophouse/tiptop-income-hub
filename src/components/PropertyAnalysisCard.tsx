
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
      className="w-full p-6 rounded-xl mb-8 bg-gradient-to-br from-[#F3ECFF] to-[#EADAFF] shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#6E59A5] mb-1 font-fahkwang">
            Property Analysis
          </h2>
          <p className="text-sm text-[#6E59A5]/80 mb-2">
            {address}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-semibold text-[#6E59A5]">Potential Monthly Income</span>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-10 w-24 rounded-md" />
          ) : (
            <div className="text-2xl font-bold text-[#AA94E2] flex items-center gap-1">
              {estimatedTotal}
              <span className="text-base font-normal text-[#6E59A5]/70">/mo</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-[#6E59A5]/70">
        <p className="flex items-center">
          <ArrowRight className="h-4 w-4 mr-1 inline" />
          Select which assets you want to monetize below
        </p>
      </div>
    </motion.div>
  );
};

export default PropertyAnalysisCard;
