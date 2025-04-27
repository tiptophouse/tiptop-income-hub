
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
    postalCode?: string;
    regionCode?: string;
    latitude?: number;
    longitude?: number;
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

export interface PropertyAnalysisResult {
  roofSize: number;
  solarPotentialKw: number;
  solarFinancials: {
    installationCost: number;
    annualSavings: number;
    breakEvenYears: number;
    lifetimeValue: number;
    billBeforeSolar: number;
    billAfterSolar: number;
    monthlyIncome: number;
    twentyYearProfit: number;
    systemSizeKw: number;
    panelLifetimeYears: number;
  };
  solarPerformance: {
    yearlyEnergyKwh: number;
    maxSunshineHours: number;
    avgDailySunshine: number;
    carbonOffsetKg: number;
    roofDirection: number;
    roofSlope: number;
    installationComplexity: 'Low' | 'Medium' | 'High';
    efficiencyRating: number;
  };
  locationData?: {
    postalCode?: string;
    regionCode?: string;
    latitude?: number;
    longitude?: number;
  };
  internetMbps: number;
  parkingSpaces: number;
  gardenSqFt: number;
  hasPool: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasEVCharging: boolean;
  error?: string;
}

/**
 * Calculate the installation complexity based on roof properties
 */
const calculateInstallationComplexity = (slopeDegrees: number): 'Low' | 'Medium' | 'High' => {
  if (slopeDegrees < 15) return 'Low';
  if (slopeDegrees < 30) return 'Medium';
  return 'High';
};

/**
 * Calculate solar efficiency rating based on direction and slope
 * Returns a value from 0-100
 */
const calculateEfficiencyRating = (azimuthDegrees: number, avgDailySunshine: number): number => {
  // Ideal azimuth is typically around 180° (south-facing) in northern hemisphere
  const azimuthOptimality = Math.max(0, 100 - Math.abs(azimuthDegrees - 180) / 1.8);
  
  // Sunshine rating (assuming optimal is around 8 hours per day)
  const sunshineRating = Math.min(100, (avgDailySunshine / 8) * 100);
  
  // Weighted average of the two factors
  return Math.round((azimuthOptimality * 0.6) + (sunshineRating * 0.4));
};

/**
 * Calculate the 20-year profit based on annual savings and installation cost
 */
const calculate20YearProfit = (
  annualSavings: number, 
  installationCost: number, 
  panelLifetimeYears: number
): number => {
  const calculationPeriod = Math.min(20, panelLifetimeYears);
  return (annualSavings * calculationPeriod) - installationCost;
};

export const analyzePropertyImage = async (imageData: string): Promise<PropertyAnalysisResult> => {
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
    
    // Calculate monthly income (annual savings divided by 12)
    const monthlyIncome = data.solarPotential.financialAnalysis.annualSavingsUsd / 12;
    
    // Calculate 20-year profit
    const twentyYearProfit = calculate20YearProfit(
      data.solarPotential.financialAnalysis.annualSavingsUsd,
      data.solarPotential.financialAnalysis.installedCostUsd,
      data.solarPotential.financialAnalysis.panelLifetimeYears
    );
    
    // Calculate installation complexity
    const installationComplexity = calculateInstallationComplexity(
      data.solarPotential.wholeRoofStats.slopeDegrees
    );
    
    // Calculate efficiency rating
    const efficiencyRating = calculateEfficiencyRating(
      data.solarPotential.wholeRoofStats.azimuthDegrees,
      data.solarPotential.avgSunshineHoursPerDay
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
        billAfterSolar: data.solarPotential.financialAnalysis.utilityBillAfterSolarUsd,
        monthlyIncome,
        twentyYearProfit,
        systemSizeKw: data.solarPotential.financialAnalysis.systemSizeKw,
        panelLifetimeYears: data.solarPotential.financialAnalysis.panelLifetimeYears
      },
      solarPerformance: {
        yearlyEnergyKwh: data.solarPotential.yearlyEnergyDcKwh,
        maxSunshineHours: data.solarPotential.maxSunshineHoursPerYear,
        avgDailySunshine: data.solarPotential.avgSunshineHoursPerDay,
        carbonOffsetKg,
        roofDirection: data.solarPotential.wholeRoofStats.azimuthDegrees,
        roofSlope: data.solarPotential.wholeRoofStats.slopeDegrees,
        installationComplexity,
        efficiencyRating
      },
      locationData: {
        postalCode: data.solarPotential.postalCode,
        regionCode: data.solarPotential.regionCode,
        latitude: data.solarPotential.latitude,
        longitude: data.solarPotential.longitude
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
        billAfterSolar: 1200,
        monthlyIncome: 100,
        twentyYearProfit: 9000,
        systemSizeKw: 6.5,
        panelLifetimeYears: 25
      },
      solarPerformance: {
        yearlyEnergyKwh: 8760,
        maxSunshineHours: 2920,
        avgDailySunshine: 8,
        carbonOffsetKg: 4380,
        roofDirection: 180,
        roofSlope: 20,
        installationComplexity: 'Medium',
        efficiencyRating: 75
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
