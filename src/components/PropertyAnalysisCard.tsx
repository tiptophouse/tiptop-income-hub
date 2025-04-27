
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { ArrowRight, Sun, Zap, DollarSign, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzePropertyImage, PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';
import { SolarAnalyticsService } from '@/utils/services/SolarAnalyticsService';

interface PropertyAnalysisCardProps {
  address: string;
  estimatedTotal?: string;
  isLoading?: boolean;
  className?: string;
}

const PropertyAnalysisCard: React.FC<PropertyAnalysisCardProps> = ({
  address,
  estimatedTotal,
  isLoading,
  className
}) => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<PropertyAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(isLoading || false);
  
  useEffect(() => {
    if (!address) return;
    
    setLoading(true);
    
    // Fetch property analysis data
    const fetchAnalysis = async () => {
      try {
        // In production, pass actual image data from property
        const result = await analyzePropertyImage('dummy-image-data');
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing property:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [address]);
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate analytics if we have analysis data
  const analytics = analysis ? SolarAnalyticsService.generateAnalytics(analysis) : null;

  return (
    <Card className={`mb-8 ${className} shadow-xl border-none bg-gradient-to-br from-white via-slate-50 to-indigo-50`}>
      {loading || !analysis ? (
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-28 w-28 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-center text-xl sm:text-2xl font-bold text-[#6E59A5]">
              Property Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-4">
                <Sun className="w-12 h-12 text-amber-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-[#8B5CF6] mb-1">
                {estimatedTotal || formatCurrency(analytics?.financialMetrics.monthlyRevenue! * 12 || 0)}
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Estimated annual passive income from your property assets
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                  <Sun className="h-6 w-6 text-amber-500 mb-2" />
                  <span className="font-bold text-lg">{analysis.solarFinancials.monthlyIncome.toFixed(0)}</span>
                  <span className="text-xs text-gray-500">Solar $/mo</span>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                  <Zap className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="font-bold text-lg">{(analysis.solarPerformance.yearlyEnergyKwh / 12).toFixed(0)}</span>
                  <span className="text-xs text-gray-500">kWh/mo</span>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                  <DollarSign className="h-6 w-6 text-green-500 mb-2" />
                  <span className="font-bold text-lg">{analysis.solarFinancials.breakEvenYears}</span>
                  <span className="text-xs text-gray-500">Break Even</span>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                  <Leaf className="h-6 w-6 text-green-600 mb-2" />
                  <span className="font-bold text-lg">{analytics?.environmentalImpact.treesEquivalent}</span>
                  <span className="text-xs text-gray-500">Trees/Year</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/dashboard/assets/solar')}
                className="bg-[#8B5CF6] hover:bg-[#7c4aeb] text-white px-6"
              >
                View Full Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default PropertyAnalysisCard;
