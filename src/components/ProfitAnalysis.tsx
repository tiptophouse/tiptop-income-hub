
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Sun, Wifi, Car } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ProfitAnalysisProps {
  propertyDetails: any | null;
  weatherData: any | null;
  isLoading: boolean;
  className?: string;
}

const ProfitAnalysis: React.FC<ProfitAnalysisProps> = ({
  propertyDetails,
  weatherData,
  isLoading,
  className
}) => {
  // Calculate potential earnings based on property and weather data
  const calculateEarnings = () => {
    if (!propertyDetails || !weatherData) return null;
    
    const sqft = propertyDetails.squareFootage;
    
    // Solar potential based on weather
    const solarPotential = Math.floor(
      (sqft * 0.4 * weatherData.annualSunshine * 0.15) / 100
    );
    
    // Bandwidth sharing potential
    const bandwidthPotential = Math.floor(120 + Math.random() * 60);
    
    // Parking potential based on location and property size
    const parkingPotential = Math.floor(
      (propertyDetails.lotSize.split(" ")[0] as number) * 500
    );
    
    // Total annual potential
    const totalPotential = solarPotential + bandwidthPotential + parkingPotential;
    
    return {
      solarPotential,
      bandwidthPotential,
      parkingPotential,
      totalPotential
    };
  };
  
  const earningsData = propertyDetails && weatherData ? calculateEarnings() : null;
  
  // Calculate maximizer scores (0-100) for each category
  const getMaximizerScores = () => {
    if (!weatherData) return null;
    
    return {
      solar: Math.min(100, Math.floor((weatherData.annualSunshine / 365) * 100)),
      bandwidth: Math.floor(60 + Math.random() * 40), // Simulated score based on location
      parking: Math.floor(50 + Math.random() * 50), // Simulated score based on location
    };
  };
  
  const scores = weatherData ? getMaximizerScores() : null;

  return (
    <Card className={`${className} shadow-lg transition-shadow duration-300 hover:shadow-xl rounded-2xl backdrop-blur-sm bg-white/90 border border-gray-100`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl text-[#8B5CF6]">
          <DollarSign className="h-5 w-5 text-[#9b87f5]" />
          <span className="truncate">AI Profit Analysis</span>
        </CardTitle>
        <CardDescription className="text-gray-600">Weather-based earning potential</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !earningsData ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        ) : (
          <>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-[#8B5CF6]">
                ${earningsData.totalPotential}
              </div>
              <div className="text-sm text-gray-500">Estimated Annual Potential</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-sm font-medium truncate max-w-[120px]">Solar Potential</span>
                  </div>
                  <span className="text-sm font-semibold">${earningsData.solarPotential}/yr</span>
                </div>
                <Progress value={scores?.solar} className="h-2" />
                <div className="text-xs text-right mt-0.5 text-gray-500 truncate">
                  {weatherData.annualSunshine} sunshine days per year
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-sm font-medium truncate max-w-[120px]">Bandwidth Sharing</span>
                  </div>
                  <span className="text-sm font-semibold">${earningsData.bandwidthPotential}/yr</span>
                </div>
                <Progress value={scores?.bandwidth} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Car className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-sm font-medium truncate max-w-[120px]">Parking Space</span>
                  </div>
                  <span className="text-sm font-semibold">${earningsData.parkingPotential}/yr</span>
                </div>
                <Progress value={scores?.parking} className="h-2" />
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg mt-2 text-sm">
              <div className="font-medium flex items-center gap-1 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <span className="truncate">AI Weather Analysis</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-3">
                Based on the {weatherData.annualSunshine} days of annual sunshine and average temperature of {weatherData.temperature}°F, 
                your property has {scores?.solar === 100 ? "excellent" : scores?.solar! > 70 ? "very good" : "good"} solar earning potential. 
                The {weatherData.conditions.toLowerCase()} conditions in your area are optimal for maximizing your property's passive income.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitAnalysis;
