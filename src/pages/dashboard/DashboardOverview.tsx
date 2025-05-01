
import React, { useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import Property3DModelCard from './components/Property3DModelCard';
import PropertyOverviewCard from './components/PropertyOverviewCard';
import { useDatabaseSchemaVerification } from '@/utils/schemaVerification';

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
  const { verifySchema } = useDatabaseSchemaVerification();
  
  // Verify database schema on component mount
  useEffect(() => {
    verifySchema();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4">
        <h1 className="text-2xl font-medium text-violet-400">Dashboard</h1>
        <p className="text-gray-700">Hello, {userName}! Here's your property summary.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Property3DModelCard />
        <PropertyOverviewCard propertyAddress={propertyAddress} />
      </div>
      
      <StatisticsCards 
        earnings={earnings} 
        activeAssets={activeAssets} 
        totalPotentialAssets={totalPotentialAssets} 
        pendingActions={pendingActions} 
      />
      
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-violet-400">Manage your assets</h2>
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
