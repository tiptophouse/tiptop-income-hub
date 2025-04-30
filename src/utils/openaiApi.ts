
/**
 * Functions for interacting with our AI-powered analysis
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';

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
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing the property. Using default data instead.",
        variant: "destructive"
      });
      throw new Error(error.message || "Failed to analyze property");
    }
    
    // Handle error response from the function itself
    if (data && data.error) {
      console.error("Function error:", data.error);
      toast({
        title: "OpenAI Analysis Error",
        description: data.error.includes("API key") 
          ? "OpenAI API key not configured in new Supabase environment. Using estimated data instead." 
          : "Could not generate AI analysis. Using estimated data instead.",
        variant: "destructive"
      });
      return data.defaultData; // Return fallback data if provided
    }
    
    console.log("Received property insights:", data);
    return data;
  } catch (error) {
    console.error("Error in getPropertyInsightsFromAI:", error);
    toast({
      title: "Analysis Error",
      description: "There was a problem analyzing the property. Using default data instead.",
      variant: "destructive"
    });
    
    // Simulate fallback data if the function fails entirely
    const fallbackData = {
      property_address: address || "Unknown",
      property_size: {
        value: 2400,
        unit: "sq_ft"
      },
      monetization_opportunities: {
        rooftop_solar: {
          usable_rooftop_sq_ft: 800,
          max_kw_installed: 6.5,
          est_monthly_savings_usd: 120,
          notes: "Excellent sun exposure with unobstructed southern exposure"
        },
        internet_bandwidth: {
          shareable_capacity_mbps: 100,
          est_monthly_revenue_usd: 200,
          deployment_notes: "High-speed fiber connection available with low utilization"
        },
        parking_space: {
          spaces_available: 2,
          est_monthly_rent_usd: 300,
          details: "Easy street access with good visibility"
        },
        garden_space: {
          garden_sq_ft: 300,
          community_garden_viable: true,
          est_monthly_revenue_usd: 80,
          notes: "Fertile soil with good drainage and sun exposure"
        }
      },
      overall_assumptions: [
        "Property features estimated based on satellite imagery",
        "Solar generation estimated based on local climate data",
        "Internet sharing assumes 50% capacity dedication",
        "Parking estimates based on local market rates",
        "Garden estimates based on seasonal potential"
      ]
    };
    
    return fallbackData;
  }
}
