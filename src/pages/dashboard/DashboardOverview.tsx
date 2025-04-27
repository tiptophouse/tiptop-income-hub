
import React from 'react';
import Property3DModel from '@/components/Property3DModel';
import DashboardHeader from './components/DashboardHeader';
import PropertyOverviewCard from './components/PropertyOverviewCard';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';

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
  aiRevenueDescription: string;
}

const DashboardOverview = ({ 
  userName, 
  earnings, 
  activeAssets, 
  totalPotentialAssets, 
  pendingActions, 
  aiRevenueDescription 
}: DashboardOverviewProps) => (
  <div className="space-y-6">
    <DashboardHeader userName={userName} />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Property3DModel 
        jobId="demo-pink-mansion-2"
        address="456 Heritage Manor"
        className="aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg bg-black"
      />
      <PropertyOverviewCard />
    </div>
    
    <StatisticsCards
      earnings={earnings}
      activeAssets={activeAssets}
      totalPotentialAssets={totalPotentialAssets}
      pendingActions={pendingActions}
    />
    
    <DashboardCharts earnings={earnings} aiRevenueDescription={aiRevenueDescription} />
    
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <AssetTable />
      </div>
      <EarningsSection />
    </div>
  </div>
);

export default DashboardOverview;
