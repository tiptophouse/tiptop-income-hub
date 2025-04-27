
/**
 * Property analysis and feature detection utilities
 */
import { GOOGLE_MAPS_API_KEY } from './meshyConfig';

interface SolarApiResponse {
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    yearlyEnergyDcKwh: number;
  };
}

export const analyzePropertyImage = async (imageData: string): Promise<{
  roofSize: number,
  solarPotentialKw: number,
  internetMbps: number,
  parkingSpaces: number,
  gardenSqFt: number,
  hasPool: boolean,
  hasGarden: boolean,
  hasParking: boolean,
  hasEVCharging: boolean,
  error?: string
}> => {
  try {
    console.log("Analyzing property image with Google Solar API");
    
    // Example coordinates - in production these would come from geocoding the address
    const latitude = 37.4219999;
    const longitude = -122.0840575;

    const response = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Solar API error: ${response.status}`);
    }

    const data: SolarApiResponse = await response.json();
    
    // Convert square meters to square feet
    const roofSize = Math.round(data.solarPotential.maxArrayAreaMeters2 * 10.764);
    
    // Calculate potential kW based on panel capacity and count
    const solarPotentialKw = (
      data.solarPotential.maxArrayPanelsCount * 
      data.solarPotential.panelCapacityWatts / 
      1000
    );

    return {
      roofSize,
      solarPotentialKw,
      internetMbps: 100, // Keeping existing values for other metrics
      parkingSpaces: 2,
      gardenSqFt: 300,
      hasPool: false,
      hasGarden: true,
      hasParking: true,
      hasEVCharging: false
    };
  } catch (error) {
    console.error("Error analyzing property image:", error);
    
    // Fallback to default values if API fails
    return {
      roofSize: 800,
      solarPotentialKw: 6.5,
      internetMbps: 100,
      parkingSpaces: 2,
      gardenSqFt: 300,
      hasPool: false,
      hasGarden: true,
      hasParking: true,
      hasEVCharging: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
