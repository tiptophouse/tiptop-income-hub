
import React from 'react';
import { Sun, Wifi, CarFront, Droplet, Store, Camera, Car, BatteryCharging, Scissors, Home, Flower } from 'lucide-react';
import AssetOpportunityCard from './AssetOpportunityCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AssetOpportunitiesListProps {
  selectedAssets: string[];
  onAssetToggle: (assetId: string) => void;
  address: string;
  insights: any | null;
  isLoading: boolean;
}

const AssetOpportunitiesList: React.FC<AssetOpportunitiesListProps> = ({
  selectedAssets,
  onAssetToggle,
  address,
  insights,
  isLoading
}) => {
  // Define all possible monetization opportunities
  const getImmediateOpportunities = () => {
    if (insights?.monetization_opportunities) {
      const mo = insights.monetization_opportunities;
      const opportunities = [];
      
      if (mo.rooftop_solar && mo.rooftop_solar.confidence > 0.3) {
        opportunities.push({
          id: "solar",
          title: "Rooftop Solar",
          icon: <Sun className="h-8 w-8 text-yellow-500" />,
          estimatedIncome: `$${Math.round(mo.rooftop_solar.est_monthly_savings_usd)}/month`,
          details: `${mo.rooftop_solar.usable_rooftop_sq_ft} sq ft usable with ${mo.rooftop_solar.max_kw_installed}kW potential`
        });
      }
      
      if (mo.internet_bandwidth && mo.internet_bandwidth.confidence > 0.3) {
        opportunities.push({
          id: "bandwidth",
          title: "Internet Bandwidth",
          icon: <Wifi className="h-8 w-8 text-blue-500" />,
          estimatedIncome: `$${Math.round(mo.internet_bandwidth.est_monthly_revenue_usd)}/month`,
          details: `${mo.internet_bandwidth.shareable_capacity_mbps} Mbps available for sharing`
        });
      }
      
      if (mo.parking_space && mo.parking_space.confidence > 0.3) {
        opportunities.push({
          id: "parking",
          title: "Parking Space",
          icon: <CarFront className="h-8 w-8 text-purple-500" />,
          estimatedIncome: `$${Math.round(mo.parking_space.est_monthly_rent_usd_total)}/month`,
          details: `${mo.parking_space.spaces_available_for_rent} spaces available for rent`
        });
      }

      if (mo.garden_space && mo.garden_space.confidence > 0.3) {
        opportunities.push({
          id: "garden",
          title: "Garden Space",
          icon: <Flower className="h-8 w-8 text-green-500" />,
          estimatedIncome: `$${Math.round(mo.garden_space.est_monthly_revenue_usd)}/month`,
          details: `${mo.garden_space.garden_sq_ft} sq ft available`
        });
      }

      return opportunities;
    }
  
    // Fallback opportunities if no insights available
    return [
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
  };
  
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
      id: "full-house",
      title: "Full House Rental",
      icon: <Home className="h-8 w-8 text-indigo-500" />,
      estimatedIncome: "$500-1000/month",
      details: "Rent your entire home on Airbnb while away"
    }
  ];

  // Filter the opportunities based on the address
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
      'full-house': 0.5, // 50% chance of full house rental
      garden: 0.5      // 50% chance of garden space
    };
    
    // Use address hash to create a pseudo-random but consistent result for each address
    const hashBasedRandom = (addressHash % 100) / 100 + (assetId.charCodeAt(0) % 10) / 100;
    return hashBasedRandom < (probabilities[assetId] || 0.5);
  };

  // Get immediate opportunities based on insights or fallback data
  const immediateOpportunities = getImmediateOpportunities();
  
  // Filter additional opportunities based on the address
  const availableAdditional = additionalOpportunities.filter(
    asset => getAssetAvailability(asset.id, address)
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
          Analyzing Asset Opportunities...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-4 shadow-sm">
              <div className="flex items-start gap-4 mb-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {immediateOpportunities && immediateOpportunities.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
            Immediate Asset Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {immediateOpportunities.map(asset => (
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

      {!immediateOpportunities?.length && !availableAdditional.length && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No asset opportunities found for this address. Try a different location.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssetOpportunitiesList;
