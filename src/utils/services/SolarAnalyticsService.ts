
import { PropertyAnalysisResult } from '../api/propertyAnalysis';

type MonthlyProjection = {
  month: string;
  revenue: number;
  cumulativeRevenue: number;
  energyProduction: number;
};

type YearlyProjection = {
  year: number;
  revenue: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
  roiPercentage: number;
};

interface SolarAnalytics {
  monthlyProjections: MonthlyProjection[];
  yearlyProjections: YearlyProjection[];
  environmentalImpact: {
    co2Saved: number;
    treesEquivalent: number;
    milesNotDriven: number;
  };
  financialMetrics: {
    roi: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    paybackPeriod: number;
    lifetimeRevenue: number;
    installationComplexityCost: number;
  };
  installationMetrics: {
    complexity: 'Low' | 'Medium' | 'High';
    panelsCount: number;
    systemSizeKw: number;
    roofCoverage: number;
  };
}

// Solar energy production distribution by month (percentage)
const MONTHLY_PRODUCTION_DISTRIBUTION = {
  'Jan': 0.06,
  'Feb': 0.07,
  'Mar': 0.08,
  'Apr': 0.09,
  'May': 0.1,
  'Jun': 0.11,
  'Jul': 0.11,
  'Aug': 0.1,
  'Sep': 0.09,
  'Oct': 0.08,
  'Nov': 0.06,
  'Dec': 0.05
};

/**
 * SolarAnalyticsService provides advanced calculations and projections
 * based on solar potential data for a property
 */
export class SolarAnalyticsService {
  /**
   * Generate detailed solar analytics including projections and environmental impact
   */
  static generateAnalytics(propertyData: PropertyAnalysisResult): SolarAnalytics {
    const { solarFinancials, solarPerformance } = propertyData;
    const solarPotentialKw = propertyData.solarPotentialKw;
    const roofSize = propertyData.roofSize;
    
    const monthlyProjections = this.generateMonthlyProjections(
      solarFinancials.annualSavings,
      solarPerformance.yearlyEnergyKwh
    );
    
    const yearlyProjections = this.generateYearlyProjections(
      solarFinancials.annualSavings,
      solarFinancials.installationCost,
      solarFinancials.panelLifetimeYears
    );
    
    const environmentalImpact = this.calculateEnvironmentalImpact(
      solarPerformance.carbonOffsetKg
    );
    
    const financialMetrics = this.calculateFinancialMetrics(
      solarFinancials,
      solarPerformance.installationComplexity
    );
    
    const panelsCount = Math.round(solarPotentialKw * 1000 / 350); // Assuming 350W panels
    const installationMetrics = {
      complexity: solarPerformance.installationComplexity,
      panelsCount,
      systemSizeKw: solarFinancials.systemSizeKw,
      roofCoverage: Math.min(100, Math.round((panelsCount * 1.9) / (roofSize / 10.764) * 100)) // 1.9 m² per panel
    };
    
    return {
      monthlyProjections,
      yearlyProjections,
      environmentalImpact,
      financialMetrics,
      installationMetrics
    };
  }
  
  /**
   * Generate monthly solar production and revenue projections
   */
  static generateMonthlyProjections(annualRevenue: number, yearlyEnergyKwh: number): MonthlyProjection[] {
    return Object.entries(MONTHLY_PRODUCTION_DISTRIBUTION).map(([month, percentage], index) => {
      const monthlyRevenue = annualRevenue * percentage;
      const monthlyEnergy = yearlyEnergyKwh * percentage;
      
      // Calculate cumulative values
      const previousMonths = Object.entries(MONTHLY_PRODUCTION_DISTRIBUTION)
        .slice(0, index)
        .reduce((sum, [_, pct]) => sum + pct, 0);
      
      const cumulativeRevenue = annualRevenue * (previousMonths + percentage);
      
      return {
        month,
        revenue: parseFloat(monthlyRevenue.toFixed(2)),
        cumulativeRevenue: parseFloat(cumulativeRevenue.toFixed(2)),
        energyProduction: Math.round(monthlyEnergy)
      };
    });
  }
  
  /**
   * Generate yearly financial projections for the solar installation
   */
  static generateYearlyProjections(
    annualRevenue: number, 
    installationCost: number,
    lifetimeYears: number
  ): YearlyProjection[] {
    const projections: YearlyProjection[] = [];
    let cumulativeRevenue = 0;
    
    // Factor in panel degradation (typically 0.5% per year)
    const degradationRate = 0.005;
    
    for (let year = 1; year <= lifetimeYears; year++) {
      // Apply degradation factor
      const degradationFactor = 1 - ((year - 1) * degradationRate);
      const yearlyRevenue = annualRevenue * degradationFactor;
      
      cumulativeRevenue += yearlyRevenue;
      const cumulativeProfit = cumulativeRevenue - installationCost;
      const roiPercentage = (cumulativeProfit / installationCost) * 100;
      
      projections.push({
        year,
        revenue: parseFloat(yearlyRevenue.toFixed(2)),
        cumulativeRevenue: parseFloat(cumulativeRevenue.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
        roiPercentage: parseFloat(roiPercentage.toFixed(2))
      });
    }
    
    return projections;
  }
  
  /**
   * Calculate environmental impact metrics from carbon offset
   */
  static calculateEnvironmentalImpact(carbonOffsetKg: number) {
    // Conversion factors
    const kgCO2PerTree = 21; // Average tree absorbs 21 kg CO2 per year
    const gCO2PerMile = 404; // Average car emits 404g of CO2 per mile
    
    return {
      co2Saved: carbonOffsetKg,
      treesEquivalent: Math.round(carbonOffsetKg / kgCO2PerTree),
      milesNotDriven: Math.round(carbonOffsetKg * 1000 / gCO2PerMile)
    };
  }
  
  /**
   * Calculate detailed financial metrics
   */
  static calculateFinancialMetrics(
    financials: PropertyAnalysisResult['solarFinancials'],
    complexity: 'Low' | 'Medium' | 'High'
  ) {
    // Calculate ROI
    const roi = (financials.lifetimeValue / financials.installationCost) * 100;
    
    // Calculate monthly revenue
    const monthlyRevenue = financials.annualSavings / 12;
    
    // Calculate lifetime revenue
    const lifetimeRevenue = financials.annualSavings * financials.panelLifetimeYears;
    
    // Installation complexity cost factor
    const complexityCostFactors = {
      'Low': 1.0,
      'Medium': 1.15,
      'High': 1.3
    };
    
    const installationComplexityCost = 
      financials.installationCost * complexityCostFactors[complexity] - financials.installationCost;
    
    return {
      roi: parseFloat(roi.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      yearlyRevenue: financials.annualSavings,
      paybackPeriod: financials.breakEvenYears,
      lifetimeRevenue: parseFloat(lifetimeRevenue.toFixed(2)),
      installationComplexityCost: Math.round(installationComplexityCost)
    };
  }
  
  /**
   * Get local electricity price from postal code (would connect to a real API)
   */
  static getLocalElectricityPrice(postalCode: string): number {
    // This would be integrated with a real electricity price API
    // For now returning mock values based on postal code
    const firstDigit = parseInt(postalCode?.[0] || '3');
    return 0.12 + (firstDigit / 100); // Generates values between $0.13-$0.22 per kWh
  }
  
  /**
   * Check for available solar incentives in the region
   */
  static getRegionalIncentives(regionCode: string): {available: boolean, details: string} {
    // This would connect to a database of regional incentives
    // Returning mock data for now
    return {
      available: true,
      details: "Federal Investment Tax Credit (26%) and local utility rebate available"
    };
  }
}
