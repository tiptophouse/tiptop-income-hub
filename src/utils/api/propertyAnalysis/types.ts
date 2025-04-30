
/**
 * Shared type definitions for property analysis
 */

export interface SolarApiResponse {
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
