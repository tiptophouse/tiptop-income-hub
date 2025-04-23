
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
if (!openAIApiKey) {
  console.error("OPENAI_API_KEY is not set");
}

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
    
    // Call OpenAI API for analysis using the Version 10 prompt
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are **Tiptop's Property Monetization Analyst**, an expert at uncovering and quantifying revenue streams for real-estate assets.

⚠️ **Respond *only* with a single, syntactically valid JSON object (UTF-8, no comments, no trailing commas).**  
The JSON **must** match exactly the schema described below—no extra keys, no missing keys.

#### Required top-level keys
| key | type | description |
|-----|------|-------------|
| \`version\` | \`"10"\` | Fixed string identifying the spec version. |
| \`property_address\` | \`string\` | Full address as received. |
| \`property_size_sq_ft\` | \`integer \\| null\` | Built (interior) area. \`null\` if unknown. |
| \`property_size_acres\` | \`float \\| null\` | Lot size in acres (2 decimals). |
| \`monetization_opportunities\` | \`object\` | Contains exactly **four** nested objects (see below). |
| \`summary_metrics\` | \`object\` | Portfolio-level roll-up (see below). |
| \`overall_assumptions\` | \`array<string>\` | ≤ 9 short bullet points on data sources or calculation logic. |

#### \`monetization_opportunities\`
Contains **exactly** these keys:

1. \`rooftop_solar\`
2. \`internet_bandwidth\`
3. \`parking_space\`
4. \`garden_space\`

Each nested object shares the common fields below **and** may add its own extras as listed.

| common field | type | notes |
|--------------|------|-------|
| \`confidence\` | \`float\` | 0–1 score indicating estimate reliability (2 decimals). |
| \`notes\` | \`string\` | Concise insights / caveats. |

##### 1 ) \`rooftop_solar\`
| field | type | notes |
|-------|------|-------|
| \`usable_rooftop_sq_ft\` | \`integer\` |
| \`max_kw_installed\` | \`float\` | 2 decimals |
| \`est_monthly_savings_usd\` | \`float\` | whole dollars |
| \`upfront_cost_usd\` | \`float\` | whole dollars |
| \`payback_period_months\` | \`integer\` |

##### 2 ) \`internet_bandwidth\`
| field | type |
|-------|------|
| \`shareable_capacity_mbps\` | \`integer\` |
| \`connection_type\` | \`string\` | e.g. \`"fiber"\`, \`"coax"\` |
| \`est_monthly_revenue_usd\` | \`float\` |
| \`deployment_cost_usd\` | \`float\` |

##### 3 ) \`parking_space\`
| field | type |
|-------|------|
| \`spaces_total\` | \`integer\` |
| \`spaces_available_for_rent\` | \`integer\` |
| \`avg_rent_per_space_usd\` | \`float\` |
| \`est_monthly_rent_usd_total\` | \`float\` |
| \`upgrades_needed_usd\` | \`float\` |

##### 4 ) \`garden_space\`
| field | type |
|-------|------|
| \`garden_sq_ft\` | \`integer\` |
| \`community_garden_viable\` | \`boolean\` |
| \`est_monthly_revenue_usd\` | \`float\` |
| \`irrigation_required_usd\` | \`float\` |

#### \`summary_metrics\`
| field | type | description |
|-------|------|-------------|
| \`total_est_monthly_revenue_usd\` | \`float\` | Sum of positive-cashflow items. |
| \`total_upfront_cost_usd\` | \`float\` | Sum of all deployment/upfront costs. |
| \`est_annual_roi_percent\` | \`float\` | ((annual revenue − annualized costs) / upfront cost) × 100, 2 decimals. |

#### Formatting rules
* Integers: no decimals.  
* Floats: **exactly** 2 decimal places.  
* Dollar amounts: round to whole dollars unless specified as float.  
* Booleans: lowercase \`true\` / \`false\`.  
* Arrays: max 5 items.  
* **No additional keys** beyond those defined.`
          },
          {
            role: "user",
            content: `Analyze the property at "${address}" for monetization opportunities.  
Populate every required field with realistic, location-aware estimates.  
Return **only** the compliant JSON object described above.

Remember to include a unique analysis specific to this request ID: ${uniqueId || 'none'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await openAIResponse.json();
    console.log("OpenAI API response received");
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }
    
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    try {
      // First try to parse the entire content as JSON
      const parsedJson = JSON.parse(content);
      
      // Ensure we have the required structure
      if (!parsedJson.version || parsedJson.version !== "10") {
        console.warn("Response version mismatch, fixing...");
        parsedJson.version = "10";
      }
      
      return new Response(
        JSON.stringify(parsedJson),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      console.error("Error parsing JSON from OpenAI response:", e);
      // If that fails, try to extract JSON with regex
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedJson = JSON.parse(jsonMatch[0]);
          
          // Ensure we have the required structure
          if (!parsedJson.version || parsedJson.version !== "10") {
            console.warn("Extracted JSON version mismatch, fixing...");
            parsedJson.version = "10";
          }
          
          return new Response(
            JSON.stringify(parsedJson),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (jsonError) {
          console.error("Error parsing extracted JSON:", jsonError);
          throw new Error("Invalid JSON in OpenAI response");
        }
      } else {
        console.error("No JSON found in OpenAI response");
        throw new Error("No JSON found in OpenAI response");
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Create fallback data in the new format
    const fallbackData = {
      version: "10",
      property_address: error.message.includes("Address is required") ? "Unknown" : (requestData?.address || "Unknown"),
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
    
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        defaultData: fallbackData
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
