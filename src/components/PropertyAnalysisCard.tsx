
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PropertyAnalysisCardProps {
  address: string;
  estimatedTotal: string;
}

const PropertyAnalysisCard: React.FC<PropertyAnalysisCardProps> = ({ 
  address,
  estimatedTotal 
}) => {
  // Generate a random property analysis description
  const getPropertyDescription = () => {
    const descriptions = [
      "This property has excellent potential for passive income generation. The rooftop space and available parking spots are particularly promising assets.",
      "Based on our analysis, your property has multiple monetization opportunities. The location and property features align well with current market demands.",
      "Your property shows above-average potential for asset sharing. The combination of available space and location creates several earning opportunities.",
      "We've detected multiple ways to monetize this property. The outdoor spaces and existing infrastructure can be leveraged for passive income."
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mb-10"
    >
      <Card className="overflow-hidden border border-[#E5DEFF] shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-64 md:h-auto relative">
            <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=400x400&maptype=satellite&key=`} 
              alt="Property Satellite View" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#AA94E2] px-3 py-1 text-xs font-bold text-[#FFFDED] rounded-full">
              Satellite View
            </div>
          </div>
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#6E59A5] font-fahkwang">
              Property Analysis
            </h3>
            
            <p className="text-[#552B1B] mb-6 font-work-sans">
              {getPropertyDescription()}
            </p>
            
            <div className="border-t border-[#E5DEFF] pt-5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[#552B1B] font-medium font-work-sans">Total Estimated Monthly Income:</span>
                <span className="text-2xl font-bold text-[#8B5CF6] font-fahkwang">{estimatedTotal}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyAnalysisCard;
