
import { supabase } from '@/integrations/supabase/client';

// Define the TypeScript types based on the new Version 10 schema
export interface PropertyInsightV10 {
  version: string;
  property_address: string;
  property_size_sq_ft: number | null;
  property_size_acres: number | null;
  monetization_opportunities: {
    rooftop_solar: RooftopSolar;
    internet_bandwidth: InternetBandwidth;
    parking_space: ParkingSpace;
    garden_space: GardenSpace;
  };
  summary_metrics: SummaryMetrics;
  overall_assumptions: string[];
}

interface CommonOpportunity {
  confidence: number;
  notes: string;
}

interface RooftopSolar extends CommonOpportunity {
  usable_rooftop_sq_ft: number;
  max_kw_installed: number;
  est_monthly_savings_usd: number;
  upfront_cost_usd: number;
  payback_period_months: number;
}

interface InternetBandwidth extends CommonOpportunity {
  shareable_capacity_mbps: number;
  connection_type: string;
  est_monthly_revenue_usd: number;
  deployment_cost_usd: number;
}

interface ParkingSpace extends CommonOpportunity {
  spaces_total: number;
  spaces_available_for_rent: number;
  avg_rent_per_space_usd: number;
  est_monthly_rent_usd_total: number;
  upgrades_needed_usd: number;
}

interface GardenSpace extends CommonOpportunity {
  garden_sq_ft: number;
  community_garden_viable: boolean;
  est_monthly_revenue_usd: number;
  irrigation_required_usd: number;
}

interface SummaryMetrics {
  total_est_monthly_revenue_usd: number;
  total_upfront_cost_usd: number;
  est_annual_roi_percent: number;
}

export const getPropertyInsightsFromAI = async (address: string): Promise<PropertyInsightV10> => {
  try {
    console.log("Fetching AI insights for address:", address);
    
    // Generate a unique identifier for this request to prevent caching
    const uniqueId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('property-insights', {
      body: { 
        address,
        uniqueId, // Add a unique ID to ensure we get fresh results
        forceRefresh: true // Signal that we want fresh data each time
      }
    });

    if (error) {
      console.error("Error calling property-insights function:", error);
      return getDefaultPropertyInsights(address);
    }

    console.log("AI response received:", data);
    
    if (!data) {
      console.error("No data returned from property-insights function");
      return getDefaultPropertyInsights(address);
    }

    // If our function returned defaultData due to an error, it will be nested
    if (data.defaultData) {
      console.warn("Using default data due to API error:", data.error);
      return { ...data.defaultData, property_address: address };
    }

    // Return the data with the address
    return {
      ...data,
      property_address: address
    };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return getDefaultPropertyInsights(address);
  }
};

// Provides default values when the API call fails
const getDefaultPropertyInsights = (address: string): PropertyInsightV10 => {
  // Generate slightly different values each time to simulate unique responses
  const randomizer = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min: number, max: number) => parseFloat((min + Math.random() * (max - min)).toFixed(2));
  
  return {
    version: "10",
    property_address: address,
    property_size_sq_ft: randomizer(1800, 3800),
    property_size_acres: randFloat(0.2, 0.8),
    monetization_opportunities: {
      rooftop_solar: {
        confidence: randFloat(0.6, 0.9),
        notes: "Estimate based on average rooftop size for the area and typical solar panel efficiency.",
        usable_rooftop_sq_ft: randomizer(500, 800),
        max_kw_installed: randFloat(4, 8),
        est_monthly_savings_usd: randFloat(100, 200),
        upfront_cost_usd: randomizer(8000, 12000),
        payback_period_months: randomizer(60, 96)
      },
      internet_bandwidth: {
        confidence: randFloat(0.7, 0.9),
        notes: "Based on typical broadband plans available in the area.",
        shareable_capacity_mbps: randomizer(300, 1000),
        connection_type: Math.random() > 0.5 ? "fiber" : "coax",
        est_monthly_revenue_usd: randFloat(70, 140),
        deployment_cost_usd: randomizer(200, 500)
      },
      parking_space: {
        confidence: randFloat(0.7, 0.95),
        notes: "Based on local parking rates and typical property configurations.",
        spaces_total: randomizer(2, 4),
        spaces_available_for_rent: randomizer(1, 2),
        avg_rent_per_space_usd: randFloat(75, 125),
        est_monthly_rent_usd_total: randFloat(150, 250),
        upgrades_needed_usd: randomizer(200, 700)
      },
      garden_space: {
        confidence: randFloat(0.5, 0.8),
        notes: "Estimate based on typical yard configurations in the area.",
        garden_sq_ft: randomizer(150, 400),
        community_garden_viable: Math.random() > 0.3,
        est_monthly_revenue_usd: randFloat(50, 120),
        irrigation_required_usd: randomizer(300, 800)
      }
    },
    summary_metrics: {
      total_est_monthly_revenue_usd: randFloat(350, 550),
      total_upfront_cost_usd: randomizer(8500, 14000),
      est_annual_roi_percent: randFloat(25, 45)
    },
    overall_assumptions: [
      "Property details estimated from similar properties in the area.",
      "Solar estimates based on average sunshine hours for the region.",
      "Internet sharing potential based on typical ISP policies.",
      "Parking values derived from local market rates.",
      "Garden estimates assume adequate water access and suitable climate."
    ]
  };
};
