import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun, Wifi, CarFront, Droplet, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AssetOpportunityCard from './assets/AssetOpportunityCard';
import AssetAdditionalInfo from './assets/AssetAdditionalInfo';

interface AssetOpportunitiesProps {
  address: string;
}

const AssetOpportunities: React.FC<AssetOpportunitiesProps> = ({ address }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  
  const immediateOpportunities = [
    {
      id: "solar",
      title: "Rooftop Solar",
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      estimatedIncome: "$120-150/month",
      details: "Your roof has excellent solar potential with 92% sun exposure"
    },
    {
      id: "bandwidth",
      title: "Internet Bandwidth",
      icon: <Wifi className="h-8 w-8 text-blue-500" />,
      estimatedIncome: "$75-95/month",
      details: "Share unused bandwidth with 0.5% packet loss detected"
    },
    {
      id: "parking",
      title: "Parking Space",
      icon: <CarFront className="h-8 w-8 text-purple-500" />,
      estimatedIncome: "$80-120/month",
      details: "2 parking spaces detected available for sharing"
    }
  ];
  
  const additionalOpportunities = [
    {
      id: "pool",
      title: "Swimming Pool",
      icon: <Droplet className="h-8 w-8 text-blue-500" />,
      estimatedIncome: "$200-300/month",
      details: "Rent your pool hourly during summer months"
    },
    {
      id: "storage",
      title: "Storage Space",
      icon: <Store className="h-8 w-8 text-green-500" />,
      estimatedIncome: "$60-90/month",
      details: "Unused garage or basement space can be rented"
    }
  ];

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

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">
          Immediate Asset Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {immediateOpportunities.map(asset => (
            <AssetOpportunityCard
              key={asset.id}
              asset={asset}
              checked={selectedAssets.includes(asset.id)}
              onChange={() => handleAssetToggle(asset.id)}
            />
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">
          Other Monetization Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalOpportunities.map(asset => (
            <AssetOpportunityCard
              key={asset.id}
              asset={asset}
              checked={selectedAssets.includes(asset.id)}
              onChange={() => handleAssetToggle(asset.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={handleContinue}
          className="bg-[#AA94E2] hover:bg-[#9b87f5] text-white px-8 py-6 text-lg rounded-full"
        >
          Continue with Selected Assets
        </button>
      </div>

      {showAdditionalInfo && (
        <AssetAdditionalInfo
          selectedAssets={selectedAssets}
        />
      )}
    </div>
  );
};

export default AssetOpportunities;
