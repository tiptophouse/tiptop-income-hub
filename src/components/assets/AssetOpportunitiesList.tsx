
import React from 'react';
import { Sun, Wifi, ParkingSquare, Flower, Box, Antenna } from 'lucide-react';
import AssetOpportunityCard from './AssetOpportunityCard';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';

interface AssetOpportunitiesListProps {
  selectedAssets: string[];
  onAssetToggle: (assetId: string) => void;
  address: string;
  insights: any | null;
  isLoading: boolean;
  propertyAnalysis?: PropertyAnalysisResult | null;
}

const AssetOpportunitiesList: React.FC<AssetOpportunitiesListProps> = ({
  selectedAssets,
  onAssetToggle,
  address,
  insights,
  isLoading,
  propertyAnalysis
}) => {
  // Process webhook data to determine available assets
  const getAvailableOpportunities = () => {
    if (insights) {
      const opportunities = [];
      
      // Solar panels (available if rooftop area exists)
      if (insights.rooftop_area_m2 > 0 || insights.estimated_solar_capacity_kw > 0) {
        const solarIncome = insights.estimated_solar_capacity_kw 
          ? `$${Math.round(insights.estimated_solar_capacity_kw * 0.4)}/month`
          : "$120/month";
        
        const solarDetails = insights.rooftop_area_m2 
          ? `${Math.round(insights.rooftop_area_m2 * 10.764)} sq ft usable with ${insights.estimated_solar_capacity_kw || 6.5}kW potential`
          : "800 sq ft usable with 6.5kW potential";
        
        opportunities.push({
          id: "solar",
          title: "Rooftop Solar",
          icon: <Sun className="h-8 w-8 text-yellow-500" />,
          estimatedIncome: solarIncome,
          details: solarDetails
        });
      }
      
      // Internet bandwidth (available if unused bandwidth exists)
      if (insights.unused_bandwidth_mbps > 0) {
        const internetIncome = `$${Math.round(insights.unused_bandwidth_mbps * 0.8 / 10)}/month`;
        const internetDetails = `${insights.unused_bandwidth_mbps} Mbps available for sharing`;
        
        opportunities.push({
          id: "internet",
          title: "Internet Bandwidth",
          icon: <Wifi className="h-8 w-8 text-blue-500" />,
          estimatedIncome: internetIncome,
          details: internetDetails
        });
      }
      
      // Parking space (available if parking spaces exist)
      if (insights.parking_spaces > 0) {
        const dailyRate = insights.avg_parking_rate_usd_per_day || 0;
        const parkingIncome = `$${Math.round(dailyRate * 30 * 0.7)}/month`;
        const parkingDetails = `${insights.parking_spaces} spaces available for rent`;
        
        opportunities.push({
          id: "parking",
          title: "Parking Space",
          icon: <ParkingSquare className="h-8 w-8 text-purple-500" />,
          estimatedIncome: parkingIncome,
          details: parkingDetails
        });
      }
      
      // Garden space (available if garden area exists)
      if (insights.garden_area_m2 > 0) {
        const gardenIncome = "$80/month";
        const gardenDetails = `${Math.round(insights.garden_area_m2 * 10.764 / 10)} sq ft available`;
        
        opportunities.push({
          id: "garden",
          title: "Garden Space",
          icon: <Flower className="h-8 w-8 text-green-500" />,
          estimatedIncome: gardenIncome,
          details: gardenDetails
        });
      }
      
      // Storage space (if storage volume exists)
      if (insights.storage_volume_m3 > 0) {
        const storageIncome = `$${Math.round(insights.storage_volume_m3 * 0.05)}/month`;
        const storageDetails = `${Math.round(insights.storage_volume_m3)} cubic meters available`;
        
        opportunities.push({
          id: "storage",
          title: "Storage Space",
          icon: <Box className="h-8 w-8 text-orange-500" />,
          estimatedIncome: storageIncome,
          details: storageDetails
        });
      }
      
      // 5G antenna (if rooftop 5G area exists)
      if (insights.rooftop_area_5g_m2 > 0) {
        const antennaIncome = `$${Math.round(insights.rooftop_area_5g_m2 * 15)}/month`;
        const antennaDetails = `${Math.round(insights.rooftop_area_5g_m2)} sq meters available for 5G`;
        
        opportunities.push({
          id: "antenna",
          title: "5G Antenna Hosting",
          icon: <Antenna className="h-8 w-8 text-indigo-500" />,
          estimatedIncome: antennaIncome,
          details: antennaDetails
        });
      }
      
      return opportunities;
    }
    
    // Default opportunities if no insights are available
    return [
      {
        id: "solar",
        title: "Rooftop Solar",
        icon: <Sun className="h-8 w-8 text-yellow-500" />,
        estimatedIncome: "$120/month",
        details: "800 sq ft usable with 6.5kW potential"
      },
      {
        id: "internet",
        title: "Internet Bandwidth",
        icon: <Wifi className="h-8 w-8 text-blue-500" />,
        estimatedIncome: "$200/month",
        details: "100 Mbps available for sharing"
      },
      {
        id: "parking",
        title: "Parking Space",
        icon: <ParkingSquare className="h-8 w-8 text-purple-500" />,
        estimatedIncome: "$300/month",
        details: "2 spaces available for rent"
      },
      {
        id: "garden",
        title: "Garden Space",
        icon: <Flower className="h-8 w-8 text-green-500" />,
        estimatedIncome: "$80/month",
        details: "300 sq ft available"
      }
    ];
  };

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

  const availableOpportunities = getAvailableOpportunities();

  const calculateTotalPotential = () => {
    return availableOpportunities.reduce((total, asset) => {
      const incomeString = asset.estimatedIncome;
      const income = parseInt(incomeString.replace(/[^0-9]/g, ''));
      return total + income;
    }, 0);
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
          Immediately Available Asset Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableOpportunities.map(asset => (
            <AssetOpportunityCard
              key={asset.id}
              asset={asset}
              checked={selectedAssets.includes(asset.id)}
              onChange={() => onAssetToggle(asset.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetOpportunitiesList;
