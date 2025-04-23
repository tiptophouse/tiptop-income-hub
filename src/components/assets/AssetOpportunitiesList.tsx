
import React from 'react';
import { Sun, Wifi, CarFront, Droplet, Store, Camera, Car, BatteryCharging, Scissors, Home, Garden } from 'lucide-react';
import AssetOpportunityCard from './AssetOpportunityCard';

interface AssetOpportunitiesListProps {
  selectedAssets: string[];
  onAssetToggle: (assetId: string) => void;
  address: string;
}

const AssetOpportunitiesList: React.FC<AssetOpportunitiesListProps> = ({
  selectedAssets,
  onAssetToggle,
  address
}) => {
  // Define all possible monetization opportunities
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
    },
    {
      id: "items",
      title: "Items (Equipment)",
      icon: <Camera className="h-8 w-8 text-gray-500" />,
      estimatedIncome: "$40-80/month",
      details: "Rent out cameras, tools, and other equipment"
    },
    {
      id: "car",
      title: "Car Sharing",
      icon: <Car className="h-8 w-8 text-red-500" />,
      estimatedIncome: "$300-500/month",
      details: "Share your vehicle when not in use"
    },
    {
      id: "ev-charger",
      title: "EV Charger",
      icon: <BatteryCharging className="h-8 w-8 text-green-600" />,
      estimatedIncome: "$60-120/month",
      details: "Allow others to use your EV charging station"
    },
    {
      id: "salon",
      title: "Salon Space",
      icon: <Scissors className="h-8 w-8 text-pink-500" />,
      estimatedIncome: "$150-250/month",
      details: "Convert a room into a rentable salon space"
    },
    {
      id: "full-house",
      title: "Full House Rental",
      icon: <Home className="h-8 w-8 text-indigo-500" />,
      estimatedIncome: "$500-1000/month",
      details: "Rent your entire home on Airbnb while away"
    },
    {
      id: "garden",
      title: "Garden Space",
      icon: <Garden className="h-8 w-8 text-green-400" />,
      estimatedIncome: "$50-100/month",
      details: "Rent garden space for community gardening"
    }
  ];

  // Filter opportunities based on address - for demo purposes we'll just randomly include some
  const getAssetAvailability = (assetId: string, address: string) => {
    // In a real app, this would analyze the address data
    // For demo, we'll use a simple hash of the address to determine availability
    const addressHash = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // Different assets have different probabilities of being available
    const probabilities: Record<string, number> = {
      solar: 0.8,      // 80% chance of solar being viable
      bandwidth: 0.9,  // 90% chance of bandwidth sharing being viable
      parking: 0.7,    // 70% chance of parking being viable
      pool: 0.3,       // 30% chance of having a pool
      storage: 0.7,    // 70% chance of storage space
      items: 0.9,      // 90% chance of having items to rent
      car: 0.6,        // 60% chance of car sharing being viable
      'ev-charger': 0.4, // 40% chance of EV charger
      salon: 0.2,      // 20% chance of salon space
      'full-house': 0.5, // 50% chance of full house rental
      garden: 0.5      // 50% chance of garden space
    };
    
    // Use address hash to create a pseudo-random but consistent result for each address
    const hashBasedRandom = (addressHash % 100) / 100 + (assetId.charCodeAt(0) % 10) / 100;
    return hashBasedRandom < (probabilities[assetId] || 0.5);
  };

  // Filter the opportunities based on the address
  const availableImmediate = immediateOpportunities.filter(
    asset => getAssetAvailability(asset.id, address)
  );
  
  const availableAdditional = additionalOpportunities.filter(
    asset => getAssetAvailability(asset.id, address)
  );

  return (
    <div className="w-full">
      {availableImmediate.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
            Immediate Asset Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableImmediate.map(asset => (
              <AssetOpportunityCard
                key={asset.id}
                asset={asset}
                checked={selectedAssets.includes(asset.id)}
                onChange={() => onAssetToggle(asset.id)}
              />
            ))}
          </div>
        </div>
      )}

      {availableAdditional.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
            Other Monetization Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableAdditional.map(asset => (
              <AssetOpportunityCard
                key={asset.id}
                asset={asset}
                checked={selectedAssets.includes(asset.id)}
                onChange={() => onAssetToggle(asset.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetOpportunitiesList;
