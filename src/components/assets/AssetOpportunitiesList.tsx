
import React from 'react';
import { Sun, Wifi, ParkingSquare, Flower } from 'lucide-react';
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
  // Define fixed opportunities based on the image
  const immediateOpportunities = [
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
  
  // Use dynamic data from insights if available, otherwise use fixed data
  const getOpportunities = () => {
    if (insights?.monetization_opportunities) {
      return immediateOpportunities.map(opp => {
        const insightData = insights.monetization_opportunities;
        
        switch (opp.id) {
          case 'solar':
            if (insightData.rooftop_solar) {
              return {
                ...opp,
                estimatedIncome: `$${Math.round(insightData.rooftop_solar.est_monthly_savings_usd)}/month`,
                details: `${insightData.rooftop_solar.usable_rooftop_sq_ft} sq ft usable with ${insightData.rooftop_solar.max_kw_installed}kW potential`
              };
            }
            break;
          case 'internet':
            if (insightData.internet_bandwidth) {
              return {
                ...opp,
                estimatedIncome: `$${Math.round(insightData.internet_bandwidth.est_monthly_revenue_usd)}/month`,
                details: `${insightData.internet_bandwidth.shareable_capacity_mbps} Mbps available for sharing`
              };
            }
            break;
          case 'parking':
            if (insightData.parking_space) {
              return {
                ...opp,
                estimatedIncome: `$${Math.round(insightData.parking_space.est_monthly_rent_usd_total)}/month`,
                details: `${insightData.parking_space.spaces_available_for_rent} spaces available for rent`
              };
            }
            break;
          case 'garden':
            if (insightData.garden_space) {
              return {
                ...opp,
                estimatedIncome: `$${Math.round(insightData.garden_space.est_monthly_revenue_usd)}/month`,
                details: `${insightData.garden_space.garden_sq_ft} sq ft available`
              };
            }
            break;
        }
        return opp;
      });
    }
    return immediateOpportunities;
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

  const availableOpportunities = getOpportunities();

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
