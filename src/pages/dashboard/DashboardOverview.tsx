
import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import PropertyOverviewCard from './components/PropertyOverviewCard';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-tiptop-accent" />
            Property 3D Model
          </CardTitle>
          <CardDescription>456 Heritage Manor</CardDescription>
        </CardHeader>
        <CardContent>
          <img 
            src="/lovable-uploads/bc1d5ec4-4a58-4238-85d9-66e0d999e65a.png"
            alt="Heritage Manor Property"
            className="aspect-[4/3] w-full h-full object-cover rounded-lg"
          />
        </CardContent>
      </Card>
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
