
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Wifi, CarFront, Droplet, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AssetOpportunitiesCard from './assets/AssetOpportunityCard';
import AssetAdditionalInfo from './assets/AssetAdditionalInfo';
import AssetOpportunitiesList from './assets/AssetOpportunitiesList';
import PropertyAnalysisCard from './PropertyAnalysisCard';

interface AssetOpportunitiesProps {
  address: string;
}

const AssetOpportunities: React.FC<AssetOpportunitiesProps> = ({ address }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  
  // Calculate a consistent estimated total based on the address
  const calculateEstimatedTotal = (address: string): string => {
    // Create a simple hash of the address for demo purposes
    const addressHash = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // Generate a number between 350 and 650 based on the hash
    const baseAmount = 350 + (addressHash % 300);
    
    // Round to nearest 5
    const roundedAmount = Math.round(baseAmount / 5) * 5;
    
    return `$${roundedAmount}`;
  };
  
  const estimatedTotal = calculateEstimatedTotal(address);

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleContinue = () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to continue",
        variant: "destructive"
      });
      return;
    }
    setShowAdditionalInfo(true);
    
    setTimeout(() => {
      const additionalInfoSection = document.getElementById('additional-info');
      if (additionalInfoSection) {
        additionalInfoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAuthWithGoogle = () => {
    toast({
      title: "Redirecting to Google login",
      description: "You'll be redirected to sign in with your Google account"
    });
    
    // In a real app, this would redirect to Google Auth
    // For demo purposes, redirect to dashboard after a brief delay
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="w-full">
      <PropertyAnalysisCard 
        address={address}
        estimatedTotal={estimatedTotal}
      />

      <AssetOpportunitiesList
        selectedAssets={selectedAssets}
        onAssetToggle={handleAssetToggle}
        address={address}
      />

      <div className="flex justify-center mb-12">
        <button
          onClick={handleContinue}
          className="bg-[#AA94E2] hover:bg-[#9b87f5] text-[#FFFDED] px-8 py-6 text-lg rounded-full font-fahkwang"
        >
          Continue with Selected Assets
        </button>
      </div>

      {showAdditionalInfo && (
        <AssetAdditionalInfo
          selectedAssets={selectedAssets}
          onComplete={handleAuthWithGoogle}
        />
      )}
    </div>
  );
};

export default AssetOpportunities;
