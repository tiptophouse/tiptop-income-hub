
/**
 * Helper functions for property analysis calculations
 */

/**
 * Calculate the installation complexity based on roof properties
 */
export const calculateInstallationComplexity = (slopeDegrees: number): 'Low' | 'Medium' | 'High' => {
  if (slopeDegrees < 15) return 'Low';
  if (slopeDegrees < 30) return 'Medium';
  return 'High';
};

/**
 * Calculate solar efficiency rating based on direction and slope
 * Returns a value from 0-100
 */
export const calculateEfficiencyRating = (azimuthDegrees: number, avgDailySunshine: number): number => {
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
export const calculate20YearProfit = (
  annualSavings: number, 
  installationCost: number, 
  panelLifetimeYears: number
): number => {
  const calculationPeriod = Math.min(20, panelLifetimeYears);
  return (annualSavings * calculationPeriod) - installationCost;
};

/**
 * Format a value to square feet from square meters
 */
export const squareMetersToFeet = (meters2: number): number => {
  return Math.round(meters2 * 10.764);
};
