
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { monetizationOptions } from './asset-search/constants';
import AssetSearchHeader from './asset-search/AssetSearchHeader';
import AssetSearchInput from './asset-search/AssetSearchInput';
import AssetCard from './asset-search/AssetCard';

interface AssetSearchProps {
  onAddressSubmit: (address: string, propertyData?: any) => void;
}

const AssetSearch: React.FC<AssetSearchProps> = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showMonetizationOptions, setShowMonetizationOptions] = useState(true);

  const handleSubmit = (e: React.FormEvent, propertyData?: any) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Only pass both the address and property data to the parent component 
    // when we have property data from the webhook
    if (propertyData) {
      // Hide monetization options when data is received (analytics will be shown instead)
      setShowMonetizationOptions(false);
      onAddressSubmit(address, propertyData);
    } else {
      // If no property data yet, don't call onAddressSubmit
      console.log("Waiting for webhook data before showing analysis");
    }
  };

  const handleDetectLocation = () => {
    if (isLocating) return;
    setIsLocating(true);
    // Simulate location detection - replace with actual implementation
    setTimeout(() => {
      setIsLocating(false);
      // Add actual location detection logic here
    }, 2000);
  };

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AssetSearchHeader />
      
      <AssetSearchInput
        address={address}
        isLocating={isLocating}
        onAddressChange={setAddress}
        onSubmit={handleSubmit}
        onDetectLocation={handleDetectLocation}
      />

      {showMonetizationOptions && (
        <div className="mt-8 mb-12">
          <motion.h3 
            className="text-xl font-semibold text-[#6E59A5] mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Discover How to Monetize Your Property
          </motion.h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {monetizationOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <AssetCard
                  icon={<option.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
                  title={option.title}
                  description={option.description}
                  earnings={option.earnings}
                  onClick={() => {}} // Add click handler if needed
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AssetSearch;
