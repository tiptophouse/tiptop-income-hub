
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign, Check, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StatisticsCardsProps {
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
}

const StatisticsCards = ({ earnings, activeAssets, totalPotentialAssets, pendingActions }: StatisticsCardsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <Card>
        <CardHeader className={`pb-1 ${isMobile ? 'p-3' : 'p-4 md:p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-medium`}>Total Earnings</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : ''}>Monthly passive income</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 md:p-6 pt-0'}>
          <div className="flex items-center">
            <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary mr-2`} />
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{earnings.monthly}</div>
              <p className="text-xs text-muted-foreground">${earnings.yearly} annually</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className={`pb-1 ${isMobile ? 'p-3' : 'p-4 md:p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-medium`}>Active Assets</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : ''}>Currently monetized</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 md:p-6 pt-0'}>
          <div className="flex items-center">
            <Check className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-500 mr-2`} />
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{activeAssets}/{totalPotentialAssets}</div>
              <p className="text-xs text-muted-foreground">Potential assets</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className={`pb-1 ${isMobile ? 'p-3' : 'p-4 md:p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-medium`}>Pending Actions</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : ''}>Tasks requiring attention</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 md:p-6 pt-0'}>
          <div className="flex items-center">
            <AlertTriangle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-500 mr-2`} />
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{pendingActions}</div>
              <p className="text-xs text-muted-foreground">Actions to complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
