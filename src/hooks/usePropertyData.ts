
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { analyzePropertyImage, PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';
import { fetchWeatherData } from '@/utils/weatherService';

export const usePropertyData = () => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysisResult | null>(null);

  const getPropertyAnalysis = async () => {
    try {
      const result = await analyzePropertyImage('dummy-image-data');
      setPropertyAnalysis(result);
      setIsLoadingData(false);
    } catch (error) {
      console.error("Error analyzing property:", error);
      setIsLoadingData(false);
    }
  };

  const loadPropertyData = async (location: { lat: number; lng: number }) => {
    setIsLoadingData(true);
    fetchWeatherData({
      location,
      onSuccess: (data) => {
        setWeatherData(data);
        getPropertyAnalysis();
      },
      onError: (error) => {
        console.error("Error fetching weather:", error);
        setIsLoadingData(false);
      }
    });
  };

  return {
    weatherData,
    isLoadingData,
    propertyAnalysis,
    loadPropertyData,
    setIsLoadingData
  };
};
