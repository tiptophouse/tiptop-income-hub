
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetTable } from './components/AssetTable';
import { StatisticsCards } from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { EarningsSection } from './components/EarningsSection';
import PropertyOverviewCard from './components/PropertyOverviewCard';
import Property3DModelDisplay from '@/components/Property3DModelDisplay';
import Property3DModelCard from './components/Property3DModelCard';

interface DashboardOverviewProps {
  userName: string;
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
  propertyAddress: string;
  onAddressSubmit: (address: string) => void;
  is3DModelGenerating?: boolean;
  propertyInsights?: any;
  aiRevenueDescription?: string;
  propertyFeatures?: {
    roofSize?: number;
    solarPotentialKw?: number;
    internetMbps?: number;
    parkingSpaces?: number;
    gardenSqFt?: number;
    storageVolume?: number;
    antenna5gArea?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasStorage?: boolean;
    hasEVCharging?: boolean;
    has5G?: boolean;
  };
  modelJobId?: string | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName,
  earnings,
  activeAssets,
  totalPotentialAssets,
  pendingActions,
  propertyAddress,
  onAddressSubmit,
  is3DModelGenerating,
  propertyInsights,
  aiRevenueDescription,
  propertyFeatures,
  modelJobId
}) => {
  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PropertyOverviewCard
          propertyAddress={propertyAddress}
          onAddressSubmit={onAddressSubmit}
          is3DModelGenerating={is3DModelGenerating}
          propertyType={propertyInsights?.property_type || "Residential Property"}
        />
        
        <EarningsSection
          userName={userName}
          earnings={earnings}
          aiRevenueDescription={aiRevenueDescription}
        />
        
        <StatisticsCards
          activeAssets={activeAssets}
          totalPotentialAssets={totalPotentialAssets}
          pendingActions={pendingActions}
          earnings={earnings}
        />
      </div>

      {/* Property 3D Model for larger screens */}
      {modelJobId && (
        <div className="hidden md:block">
          <Property3DModelDisplay
            jobId={modelJobId}
            address={propertyAddress}
            hasSatelliteImage={propertyInsights?.satellite_image_available}
            hasAerialImage={propertyInsights?.aerial_image_available}
            propertyFeatures={propertyFeatures}
          />
        </div>
      )}
      
      {/* Property 3D Model Card for smaller screens */}
      {modelJobId && (
        <div className="md:hidden">
          <Property3DModelCard />
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Property Assets</TabsTrigger>
          <TabsTrigger value="charts">Revenue Charts</TabsTrigger>
          <TabsTrigger value="neighbors">Neighborhood Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets">
          <AssetTable propertyFeatures={propertyFeatures} />
        </TabsContent>
        
        <TabsContent value="charts">
          <DashboardCharts earnings={earnings} aiRevenueDescription={aiRevenueDescription || ""} />
        </TabsContent>
        
        <TabsContent value="neighbors">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Neighborhood Properties</h3>
            <p className="text-gray-500">Data for neighboring properties will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
