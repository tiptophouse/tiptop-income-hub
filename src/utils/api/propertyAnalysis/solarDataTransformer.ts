
/**
 * Transform solar API data into our application format
 */
import { SolarApiResponse, PropertyAnalysisResult } from './types';
import { 
  calculateInstallationComplexity, 
  calculateEfficiencyRating, 
  calculate20YearProfit,
  squareMetersToFeet
} from './calculationHelpers';

export const transformSolarData = (data: SolarApiResponse): PropertyAnalysisResult => {
  // Convert square meters to square feet
  const roofSize = squareMetersToFeet(data.buildingStats.areaMeters2);
  
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
};
