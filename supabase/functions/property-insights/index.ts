
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
    const { address } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analyzing property at address:", address);
    
    // Call OpenAI API for analysis
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
            content: "You are a real estate analyst specialized in identifying monetization opportunities for properties. Respond only with a JSON object that contains detailed analysis about the property."
          },
          {
            role: "user",
            content: `Analyze the property at "${address}" for monetization opportunities.
            Provide specific details about:
            1. Rooftop Solar - Solar panel installation potential, monthly savings, and square footage
            2. Internet Bandwidth - Sharing potential, capacity that could be shared, estimated monthly earnings
            3. Parking Space - Number of spaces available, monthly rental value, and details
            4. Garden Space - Square footage, community garden potential, estimated monthly return
            
            ALSO: Estimate the total size of the property (total square footage or lot size) and include this as "propertySize" in the JSON results, e.g.: "propertySize": "2700 sq ft" or "0.32 acres".
            
            Also calculate the total monthly passive income potential from all these combined assets.
            
            Respond ONLY with a valid JSON object containing these details structured like this:
            {
              "rooftopSolar": {
                "potential": "High/Medium/Low",
                "monthlySavings": "$X-Y",
                "sqFootage": "X sq ft"
              },
              "internetBandwidth": {
                "potential": "High/Medium/Low",
                "sharingCapacity": "X%",
                "monthlyEarnings": "$X-Y"
              },
              "parkingSpace": {
                "available": "X spaces",
                "monthlyValue": "$X-Y",
                "details": "description..."
              },
              "gardenSpace": {
                "sqFootage": "X sq ft",
                "communityValue": "High/Medium/Low",
                "monthlyPotential": "$X-Y"
              },
              "totalMonthlyPotential": "$X-Y",
              "propertySize": "X sq ft or X acres"
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
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
    let jsonMatch;
    try {
      // First try to parse the entire content as JSON
      const parsedJson = JSON.parse(content);
      return new Response(
        JSON.stringify(parsedJson),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      // If that fails, try to extract JSON with regex
      jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedJson = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify(parsedJson),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (jsonError) {
          console.error("Error parsing extracted JSON:", jsonError);
          throw new Error("Invalid JSON in OpenAI response");
        }
      } else {
        throw new Error("No JSON found in OpenAI response");
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        defaultData: getDefaultPropertyInsights("") 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Provides default values when the API call fails
function getDefaultPropertyInsights(address: string) {
  return {
    address,
    rooftopSolar: {
      potential: "High",
      monthlySavings: "$100-150",
      sqFootage: "600 sq ft"
    },
    internetBandwidth: {
      potential: "Medium",
      sharingCapacity: "60-70%",
      monthlyEarnings: "$80-120"
    },
    parkingSpace: {
      available: "1-2 spaces",
      monthlyValue: "$70-200",
      details: "Available for hourly/daily rental"
    },
    gardenSpace: {
      sqFootage: "150 sq ft",
      communityValue: "Medium-High",
      monthlyPotential: "$50-100"
    },
    totalMonthlyPotential: "$300-570",
    propertySize: "2,000 sq ft (default estimate)"
  };
}
