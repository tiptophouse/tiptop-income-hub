import React, { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import PropertyOverviewCard from './components/PropertyOverviewCard';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
}: DashboardOverviewProps) => {
  const [propertyAddress, setPropertyAddress] = useState("Enter an address...");
  
  useEffect(() => {
    const handleAddressFound = (event: CustomEvent) => {
      if (event.detail?.address) {
        setPropertyAddress(event.detail.address);
      }
    };
    
    document.addEventListener('addressFound', handleAddressFound as EventListener);
    return () => {
      document.removeEventListener('addressFound', handleAddressFound as EventListener);
    };
  }, []);

  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
              Property 3D Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{propertyAddress}</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0' : 'pt-0'}>
            <div className="w-full overflow-hidden rounded-lg max-h-[200px] sm:max-h-none">
              <img 
                src="/lovable-uploads/bc1d5ec4-4a58-4238-85d9-66e0d999e65a.png"
                alt="Heritage Manor Property"
                className="w-full h-auto object-cover"
              />
            </div>
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
      
      <div className="space-y-4 sm:space-y-6">
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
