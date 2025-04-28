
import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import Property3DModelCard from './components/Property3DModelCard';
import PropertyOverviewCard from './components/PropertyOverviewCard';

interface DashboardOverviewProps {
  userName: string;
  propertyAddress: string;
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
  aiRevenueDescription: string;
}

const DashboardOverview = ({ 
  userName, 
  propertyAddress,
  earnings, 
  activeAssets, 
  totalPotentialAssets, 
  pendingActions, 
  aiRevenueDescription 
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <Property3DModelCard />
        <PropertyOverviewCard propertyAddress={propertyAddress} />
      </div>
      
      <StatisticsCards
        earnings={earnings}
        activeAssets={activeAssets}
        totalPotentialAssets={totalPotentialAssets}
        pendingActions={pendingActions}
      />
      
      <DashboardCharts earnings={earnings} aiRevenueDescription={aiRevenueDescription} />
      
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Manage your assets</h2>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full px-2 sm:px-0">
            <AssetTable />
          </div>
        </div>
        <EarningsSection />
      </div>
    </div>
  );
};

export default DashboardOverview;
