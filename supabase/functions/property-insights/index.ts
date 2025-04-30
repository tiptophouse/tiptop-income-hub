import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { handlePropertyAnalysis } from "./propertyAnalysis.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    return await handlePropertyAnalysis(req, requestData);
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return fallback data with error information
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        defaultData: generateMockData("Sample Address")
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Keep this function in the main file for convenience as it's referenced in multiple places
function generateMockData(address) {
  return {
    property_address: address,
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
}

export { generateMockData };
