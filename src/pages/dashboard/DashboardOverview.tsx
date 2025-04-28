import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import StatisticsCards from './components/StatisticsCards';
import { DashboardCharts } from './components/DashboardCharts';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { Building, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Property 3D Model Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
              Property 3D Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Interactive 3D view of your property
            </CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0' : 'pt-0'}>
            <div className="w-full overflow-hidden rounded-lg">
              <img 
                src="/lovable-uploads/bc1d5ec4-4a58-4238-85d9-66e0d999e65a.png"
                alt="Property 3D Model"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-24"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Play</>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Property Overview Card */}
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
            {propertyAddress && (
              <p className="text-sm text-muted-foreground">
                This beautiful property is located at {propertyAddress}. The home features modern amenities
                and excellent potential for various revenue streams including solar panels,
                high-speed internet sharing, and smart home capabilities.
              </p>
            )}
            {!propertyAddress && (
              <p className="text-sm text-muted-foreground">
                Add your property address to see a detailed overview of your property and its monetization potential.
              </p>
            )}
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
