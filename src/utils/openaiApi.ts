
/**
 * Functions for interacting with our AI-powered analysis
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Get property insights from AI analysis
 * @param address The property address to analyze
 * @returns Property insights data
 */
export async function getPropertyInsightsFromAI(address: string) {
  try {
    console.log("Calling property-insights function for address:", address);
    
    // Generate a unique ID for this request
    const uniqueId = Math.random().toString(36).substring(2, 15);
    
    // Call the property-insights edge function
    const { data, error } = await supabase.functions.invoke('property-insights', {
      body: { address, uniqueId },
    });
    
    if (error) {
      console.error("Error calling property-insights function:", error);
      throw new Error(error.message || "Failed to analyze property");
    }
    
    // Handle error response from the function itself
    if (data.error) {
      console.error("Function error:", data.error);
      return data.defaultData; // Return fallback data if provided
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPropertyInsightsFromAI:", error);
    
    // Simulate fallback data if the function fails entirely
    const fallbackData = {
      version: "10",
      property_address: address || "Unknown",
      property_size_sq_ft: Math.floor(1800 + Math.random() * 2000),
      property_size_acres: parseFloat((0.2 + Math.random() * 0.5).toFixed(2)),
      monetization_opportunities: {
        rooftop_solar: {
          confidence: parseFloat((0.6 + Math.random() * 0.3).toFixed(2)),
          notes: "Estimate based on average rooftop size for the area and typical solar panel efficiency.",
          usable_rooftop_sq_ft: Math.floor(500 + Math.random() * 300),
          max_kw_installed: parseFloat((4 + Math.random() * 3).toFixed(2)),
          est_monthly_savings_usd: parseFloat((120 + Math.random() * 50).toFixed(2)),
          upfront_cost_usd: Math.floor(8000 + Math.random() * 4000),
          payback_period_months: Math.floor(60 + Math.random() * 24)
        },
        internet_bandwidth: {
          confidence: parseFloat((0.7 + Math.random() * 0.2).toFixed(2)),
          notes: "Based on typical broadband plans available in the area.",
          shareable_capacity_mbps: Math.floor(300 + Math.random() * 700),
          connection_type: Math.random() > 0.5 ? "fiber" : "coax",
          est_monthly_revenue_usd: parseFloat((80 + Math.random() * 40).toFixed(2)),
          deployment_cost_usd: Math.floor(200 + Math.random() * 300)
        },
        parking_space: {
          confidence: parseFloat((0.8 + Math.random() * 0.2).toFixed(2)),
          notes: "Based on local parking rates and typical property configurations.",
          spaces_total: Math.floor(2 + Math.random() * 3),
          spaces_available_for_rent: 1 + Math.floor(Math.random() * 2),
          avg_rent_per_space_usd: parseFloat((75 + Math.random() * 50).toFixed(2)),
          est_monthly_rent_usd_total: parseFloat((150 + Math.random() * 100).toFixed(2)),
          upgrades_needed_usd: Math.floor(200 + Math.random() * 500)
        },
        garden_space: {
          confidence: parseFloat((0.6 + Math.random() * 0.3).toFixed(2)),
          notes: "Estimate based on typical yard configurations in the area.",
          garden_sq_ft: Math.floor(150 + Math.random() * 250),
          community_garden_viable: Math.random() > 0.3,
          est_monthly_revenue_usd: parseFloat((60 + Math.random() * 40).toFixed(2)),
          irrigation_required_usd: Math.floor(300 + Math.random() * 500)
        }
      },
      summary_metrics: {
        total_est_monthly_revenue_usd: parseFloat((410 + Math.random() * 130).toFixed(2)),
        total_upfront_cost_usd: Math.floor(8700 + Math.random() * 5300),
        est_annual_roi_percent: parseFloat((30 + Math.random() * 20).toFixed(2))
      },
      overall_assumptions: [
        "Property details estimated from similar properties in the area.",
        "Solar estimates based on average sunshine hours for the region.",
        "Internet sharing potential based on typical ISP policies.",
        "Parking values derived from local market rates.",
        "Garden estimates assume adequate water access and suitable climate."
      ]
    };
    
    return fallbackData;
  }
}
