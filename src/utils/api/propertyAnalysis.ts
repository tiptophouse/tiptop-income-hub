
/**
 * Property analysis and feature detection utilities
 */
import { GOOGLE_MAPS_API_KEY } from './meshyConfig';

interface SolarApiResponse {
  buildingStats: {
    areaMeters2: number;
  };
  solarPotential: {
    maxArrayAreaMeters2: number;
    maxArrayPanelsCount: number;
    panelCapacityWatts: number;
    yearlyEnergyDcKwh: number;
    maxSunshineHoursPerYear: number;
    avgSunshineHoursPerDay: number;
    carbonOffsetFactorKgPerMwh: number;
    wholeRoofStats: {
      azimuthDegrees: number;
      slopeDegrees: number;
    };
    financialAnalysis: {
      systemSizeKw: number;
      installedCostUsd: number;
      breakEvenYear: number;
      npvUsd: number;
      annualSavingsUsd: number;
      panelLifetimeYears: number;
      utilityBillBeforeSolarUsd: number;
      utilityBillAfterSolarUsd: number;
    };
  };
}

export const analyzePropertyImage = async (imageData: string): Promise<{
  roofSize: number;
  solarPotentialKw: number;
  solarFinancials: {
    installationCost: number;
    annualSavings: number;
    breakEvenYears: number;
    lifetimeValue: number;
    billBeforeSolar: number;
    billAfterSolar: number;
  };
  solarPerformance: {
    yearlyEnergyKwh: number;
    maxSunshineHours: number;
    avgDailySunshine: number;
    carbonOffsetKg: number;
    roofDirection: number;
    roofSlope: number;
  };
  internetMbps: number;
  parkingSpaces: number;
  gardenSqFt: number;
  hasPool: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasEVCharging: boolean;
  error?: string;
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
    const roofSize = Math.round(data.buildingStats.areaMeters2 * 10.764);
    
    // Calculate potential kW based on panel capacity and count
    const solarPotentialKw = (
      data.solarPotential.maxArrayPanelsCount * 
      data.solarPotential.panelCapacityWatts / 
      1000
    );

    // Calculate carbon offset in kg per year
    const carbonOffsetKg = (
      data.solarPotential.yearlyEnergyDcKwh * 
      data.solarPotential.carbonOffsetFactorKgPerMwh / 
      1000
    );

    return {
      roofSize,
      solarPotentialKw,
      solarFinancials: {
        installationCost: data.solarPotential.financialAnalysis.installedCostUsd,
        annualSavings: data.solarPotential.financialAnalysis.annualSavingsUsd,
        breakEvenYears: data.solarPotential.financialAnalysis.breakEvenYear,
        lifetimeValue: data.solarPotential.financialAnalysis.npvUsd,
        billBeforeSolar: data.solarPotential.financialAnalysis.utilityBillBeforeSolarUsd,
        billAfterSolar: data.solarPotential.financialAnalysis.utilityBillAfterSolarUsd
      },
      solarPerformance: {
        yearlyEnergyKwh: data.solarPotential.yearlyEnergyDcKwh,
        maxSunshineHours: data.solarPotential.maxSunshineHoursPerYear,
        avgDailySunshine: data.solarPotential.avgSunshineHoursPerDay,
        carbonOffsetKg,
        roofDirection: data.solarPotential.wholeRoofStats.azimuthDegrees,
        roofSlope: data.solarPotential.wholeRoofStats.slopeDegrees
      },
      internetMbps: 100,
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
      solarFinancials: {
        installationCost: 15000,
        annualSavings: 1200,
        breakEvenYears: 12.5,
        lifetimeValue: 25000,
        billBeforeSolar: 2400,
        billAfterSolar: 1200
      },
      solarPerformance: {
        yearlyEnergyKwh: 8760,
        maxSunshineHours: 2920,
        avgDailySunshine: 8,
        carbonOffsetKg: 4380,
        roofDirection: 180,
        roofSlope: 20
      },
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
