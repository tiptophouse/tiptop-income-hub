
/**
 * Property image analysis utilities
 */
import { PropertyAnalysisResult, SolarApiResponse } from './types';
import { calculateEfficiencyRating, calculateInstallationComplexity, calculate20YearProfit } from './calculationUtils';
import { getFallbackPropertyAnalysis } from './fallbackData';

/**
 * Analyze property image for solar and other monetization opportunities
 * @param imageBase64 - Base64 encoded image data
 * @returns PropertyAnalysisResult object with analysis data
 */
export const analyzePropertyImage = async (imageBase64: string): Promise<PropertyAnalysisResult> => {
  try {
    console.log("Analyzing property image...");
    
    // Make sure the image is properly formatted (remove data:image prefix if present)
    const cleanedImage = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    if (!cleanedImage || cleanedImage.length < 100) {
      console.error("Invalid image data provided for analysis");
      throw new Error("Invalid image data");
    }

    // For the demo/development version, we'll use the Supabase Edge Function
    try {
      // Generate a unique ID for this analysis request
      const uniqueId = Math.random().toString(36).substring(2, 12);
      
      // Call the Supabase Edge Function for property analysis
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('property-insights', {
        body: {
          imageData: cleanedImage,
          uniqueId
        }
      });
      
      if (error) {
        console.error("Error from Supabase Function:", error);
        throw error;
      }
      
      if (!data) {
        console.error("No data returned from property insights function");
        throw new Error("No analysis data returned");
      }
      
      console.log("Property analysis completed successfully");
      
      // Convert the API response to our PropertyAnalysisResult format
      const result: PropertyAnalysisResult = {
        roofSize: data.monetization_opportunities?.rooftop_solar?.usable_rooftop_sq_ft || 800,
        solarPotentialKw: data.monetization_opportunities?.rooftop_solar?.max_kw_installed || 6.5,
        solarFinancials: {
          installationCost: data.monetization_opportunities?.rooftop_solar?.upfront_cost_usd || 15000,
          annualSavings: (data.monetization_opportunities?.rooftop_solar?.est_monthly_savings_usd || 120) * 12,
          breakEvenYears: (data.monetization_opportunities?.rooftop_solar?.payback_period_months || 120) / 12,
          lifetimeValue: calculate20YearProfit(
            (data.monetization_opportunities?.rooftop_solar?.est_monthly_savings_usd || 120) * 12,
            data.monetization_opportunities?.rooftop_solar?.upfront_cost_usd || 15000,
            25 // Default panel lifetime in years
          ),
          billBeforeSolar: 2400,
          billAfterSolar: 1200,
          monthlyIncome: 100,
          twentyYearProfit: 9000,
          systemSizeKw: data.monetization_opportunities?.rooftop_solar?.max_kw_installed || 6.5,
          panelLifetimeYears: 25
        },
        solarPerformance: {
          yearlyEnergyKwh: 8760,
          maxSunshineHours: 2920,
          avgDailySunshine: 8,
          carbonOffsetKg: 4380,
          roofDirection: 180,
          roofSlope: 20,
          installationComplexity: calculateInstallationComplexity(20),
          efficiencyRating: calculateEfficiencyRating(180, 8)
        },
        internetMbps: data.monetization_opportunities?.internet_bandwidth?.shareable_capacity_mbps || 100,
        parkingSpaces: data.monetization_opportunities?.parking_space?.spaces_available_for_rent || 2,
        gardenSqFt: data.monetization_opportunities?.garden_space?.garden_sq_ft || 300,
        hasPool: Math.random() > 0.7,
        hasGarden: !!data.monetization_opportunities?.garden_space?.garden_sq_ft,
        hasParking: !!data.monetization_opportunities?.parking_space?.spaces_available_for_rent,
        hasEVCharging: Math.random() > 0.8
      };
      
      return result;
    } catch (error) {
      console.error("Error in property analysis API call:", error);
      return getFallbackPropertyAnalysis(error);
    }
  } catch (error) {
    console.error("Error analyzing property image:", error);
    return getFallbackPropertyAnalysis(error);
  }
};
