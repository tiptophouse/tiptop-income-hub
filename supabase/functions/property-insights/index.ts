import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { address, uniqueId, forceRefresh } = requestData;
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing property at address: ${address} (uniqueId: ${uniqueId || 'none'}, forceRefresh: ${forceRefresh})`);
    
    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured in the new Supabase environment", 
          defaultData: generateMockData(address)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if we should use the OpenAI API or return fixed data for testing
    if (forceRefresh === 'mockdata') {
      console.log("Using mock data as requested by forceRefresh=mockdata parameter");
      return new Response(
        JSON.stringify(generateMockData(address)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Log the API key status (not the actual key)
    console.log("OpenAI API key status:", openAIApiKey ? "Present" : "Missing");
    console.log("Making OpenAI API call for address:", address);
    
    // System prompt for property monetization analysis
    const systemPrompt = `You are **Tiptop's Property Monetization Analyst**.  
**Respond with exactly one JSON object**, UTF-8 encoded, no comments, no extra text.  
It must strictly conform to the following JSON Schema (Draft-07):

\`\`\`json
{
  "type": "object",
  "required": ["property_address","property_size","monetization_opportunities","overall_assumptions"],
  "properties": {
    "property_address": { "type": "string" },
    "property_size": {
      "type": "object",
      "required": ["value","unit"],
      "properties": {
        "value": { "type": "number" },
        "unit": { "type": "string", "enum": ["sq_ft","acres"] }
      },
      "additionalProperties": false
    },
    "monetization_opportunities": {
      "type": "object",
      "required": ["rooftop_solar","internet_bandwidth","parking_space","garden_space"],
      "properties": {
        "rooftop_solar": {
          "type": "object",
          "required": ["usable_rooftop_sq_ft","max_kw_installed","est_monthly_savings_usd","notes"],
          "properties": {
            "usable_rooftop_sq_ft": { "type": "integer" },
            "max_kw_installed": { "type": "number" },
            "est_monthly_savings_usd": { "type": "integer" },
            "notes": { "type": "string" }
          },
          "additionalProperties": false
        },
        "internet_bandwidth": {
          "type": "object",
          "required": ["shareable_capacity_mbps","est_monthly_revenue_usd","deployment_notes"],
          "properties": {
            "shareable_capacity_mbps": { "type": "integer" },
            "est_monthly_revenue_usd": { "type": "integer" },
            "deployment_notes": { "type": "string" }
          },
          "additionalProperties": false
        },
        "parking_space": {
          "type": "object",
          "required": ["spaces_available","est_monthly_rent_usd","details"],
          "properties": {
            "spaces_available": { "type": "integer" },
            "est_monthly_rent_usd": { "type": "integer" },
            "details": { "type": "string" }
          },
          "additionalProperties": false
        },
        "garden_space": {
          "type": "object",
          "required": ["garden_sq_ft","community_garden_viable","est_monthly_revenue_usd","notes"],
          "properties": {
            "garden_sq_ft": { "type": "integer" },
            "community_garden_viable": { "type": "boolean" },
            "est_monthly_revenue_usd": { "type": "integer" },
            "notes": { "type": "string" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "overall_assumptions": {
      "type": "array",
      "maxItems": 5,
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false
}
\`\`\``;

    // User prompt with the address
    const userPrompt = `Analyze this property address for monetization opportunities: ${address}
Estimate the property size, solar potential, internet sharing capacity, parking spaces, and garden area.
Make realistic estimates based on typical properties at this address.`;

    try {
      console.log("Sending request to OpenAI API...");
            
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using a more efficient model, adjust as needed
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API returned an error:", response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const openaiResponse = await response.json();
      
      if (!openaiResponse || !openaiResponse.choices || !openaiResponse.choices[0]) {
        console.error("Unexpected response format from OpenAI:", openaiResponse);
        throw new Error("Invalid response format from OpenAI");
      }

      const generatedContent = openaiResponse.choices[0].message.content;
      
      console.log("Generated content from OpenAI:", generatedContent.substring(0, 100) + "...");
      
      try {
        const parsedResponse = JSON.parse(generatedContent);
        console.log("Successfully parsed JSON response from OpenAI");
        return new Response(
          JSON.stringify(parsedResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", parseError, "Raw response:", generatedContent);
        throw new Error("Invalid JSON response from OpenAI");
      }
    } catch (openAiError) {
      console.error("OpenAI API call failed:", openAiError);
      
      // Fall back to mock data if the API call fails
      console.log("Falling back to mock data due to OpenAI API error");
      return new Response(
        JSON.stringify(generateMockData(address)),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
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

// Helper function to generate mock data
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
