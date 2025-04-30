
/**
 * Default fallback data for property analysis when the API fails
 */
import { PropertyAnalysisResult } from './types';

export const createFallbackAnalysisData = (error?: string): PropertyAnalysisResult => {
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
    error: error || undefined
  };
};
