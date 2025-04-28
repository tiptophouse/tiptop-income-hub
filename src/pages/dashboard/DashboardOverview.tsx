import React, { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { generatePropertyModels } from '@/utils/modelGeneration';
import { toast } from '@/components/ui/use-toast';
import Property3DModel from '@/components/Property3DModel';

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
  const isMobile = useIsMobile();
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserPropertyData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.propertyAddress) {
        setPropertyAddress(user.user_metadata.propertyAddress);
        setModelJobId(user.user_metadata.propertyModelJobId || null);
      }
    };
    
    fetchUserPropertyData();
    
    // Listen for model job creation events
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail?.jobId) {
        setModelJobId(event.detail.jobId);
      }
    };
    
    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {propertyAddress && (
          <Property3DModel
            jobId={modelJobId}
            address={propertyAddress}
            className="w-full"
          />
        )}
        
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
              Property Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {propertyAddress || "Add your property address to get started"}
            </CardDescription>
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
