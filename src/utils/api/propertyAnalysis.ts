
/**
 * Property analysis and feature detection utilities
 */
import { PropertyAnalysisResult } from './propertyAnalysis/types';
import { fetchSolarData } from './propertyAnalysis/solarApiService';
import { transformSolarData } from './propertyAnalysis/solarDataTransformer';
import { createFallbackAnalysisData } from './propertyAnalysis/fallbackData';

export * from './propertyAnalysis/types';

export const analyzePropertyImage = async (imageData: string): Promise<PropertyAnalysisResult> => {
  try {
    console.log("Analyzing property image with Google Solar API");
    
    // Example coordinates - in production these would come from geocoding the address
    const latitude = 37.4219999;
    const longitude = -122.0840575;

    // Fetch data from the Solar API
    const solarData = await fetchSolarData(latitude, longitude);
    
    // Transform the data into our application format
    return transformSolarData(solarData);
  } catch (error) {
    console.error("Error analyzing property image:", error);
    
    // Return fallback data if the API fails
    return createFallbackAnalysisData(error instanceof Error ? error.message : "Unknown error");
  }
};
