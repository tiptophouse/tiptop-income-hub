
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
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
    <div className="w-full max-w-4xl mx-auto">
      <AssetSearchHeader />
      
      <AssetSearchInput
        address={address}
        isLocating={isLocating}
        onAddressChange={setAddress}
        onSubmit={handleSubmit}
        onDetectLocation={handleDetectLocation}
      />

      {showMonetizationOptions && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {monetizationOptions.map((option) => (
            <AssetCard
              key={option.id}
              icon={<option.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
              title={option.title}
              description={option.description}
              earnings={option.earnings}
              onClick={() => {}} // Add click handler if needed
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetSearch;
