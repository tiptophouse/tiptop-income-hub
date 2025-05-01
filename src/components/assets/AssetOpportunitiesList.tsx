
import React from 'react';
import { PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';
import AssetOpportunityCard from './AssetOpportunityCard';
import AssetOpportunitiesLoading from './AssetOpportunitiesLoading';
import AssetIcon from './AssetIcons';
import { calculateAssetOpportunities, getDefaultOpportunities, AssetOpportunity } from '@/utils/assetOpportunities';

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
  if (isLoading) {
    return <AssetOpportunitiesLoading />;
  }

  // Get opportunities based on property insights
  const getOpportunities = (): AssetOpportunity[] => {
    const opportunities = insights ? calculateAssetOpportunities(insights) : getDefaultOpportunities();
    
    // Add icons to opportunities
    return opportunities.map(opportunity => {
      const assetType = mapAssetIdToType(opportunity.id);
      return {
        ...opportunity,
        icon: <AssetIcon assetType={assetType} />
      };
    });
  };
  
  // Map asset ID to icon type
  const mapAssetIdToType = (id: string): any => {
    switch (id) {
      case 'solar': return 'solar';
      case 'internet': return 'internet';
      case 'parking': return 'parking';
      case 'garden': return 'garden';
      case 'storage': return 'storage';
      case 'antenna': return 'antenna';
      case 'pool': return 'pool';
      default: return 'storage';
    }
  };

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
