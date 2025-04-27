
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, DollarSign, Leaf, TrendingUp, BarChart, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';
import { SolarAnalyticsService } from '@/utils/services/SolarAnalyticsService';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface SolarInsightsCardProps {
  propertyAnalysis?: PropertyAnalysisResult;
  isLoading?: boolean;
  className?: string;
}

const SolarInsightsCard: React.FC<SolarInsightsCardProps> = ({
  propertyAnalysis,
  isLoading = false,
  className
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleViewDetails = () => {
    navigate('/dashboard/assets/solar');
  };
  
  if (isLoading || !propertyAnalysis) {
    return (
      <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5 text-amber-500" />
            <span>Solar Potential Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const analytics = SolarAnalyticsService.generateAnalytics(propertyAnalysis);
  const { financialMetrics, environmentalImpact } = analytics;
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-amber-500`}>
      <CardHeader className={isMobile ? "p-4 pb-2" : "pb-2"}>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sun className="h-5 w-5 text-amber-500" />
            Solar Potential Analysis
          </CardTitle>
          <div className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {propertyAnalysis.solarPotentialKw.toFixed(1)} kW
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "p-4 pt-2" : "pt-0"}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(financialMetrics.monthlyRevenue)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Installation Cost</p>
              <p className="text-lg font-semibold">{formatCurrency(propertyAnalysis.solarFinancials.installationCost)}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1 text-sm">
              <div className="flex items-center gap-1">
                <BarChart className="h-3.5 w-3.5 text-gray-500" />
                <span>ROI Progress</span>
              </div>
              <span className="font-medium">{financialMetrics.roi.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(100, financialMetrics.roi)} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {financialMetrics.paybackPeriod.toFixed(1)} years payback period
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-green-50 p-2 rounded-md">
              <div className="flex items-center gap-1 mb-1">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
                <p className="text-xs font-medium text-green-700">Environmental Impact</p>
              </div>
              <p className="text-sm font-bold">
                {environmentalImpact.co2Saved.toLocaleString()} kg
              </p>
              <p className="text-xs text-gray-600">CO₂ offset per year</p>
            </div>
            
            <div className="bg-purple-50 p-2 rounded-md">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                <p className="text-xs font-medium text-purple-700">20-Year Profit</p>
              </div>
              <p className="text-sm font-bold">
                {formatCurrency(propertyAnalysis.solarFinancials.twentyYearProfit)}
              </p>
              <p className="text-xs text-gray-600">Net income</p>
            </div>
          </div>
          
          <div className="pt-1 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
              className="text-amber-600 hover:text-amber-700"
            >
              View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolarInsightsCard;
