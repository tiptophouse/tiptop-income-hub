
import { validateApiKey, corsHeaders, createErrorResponse } from "./utils.ts";
import { callOpenAI } from "./openaiService.ts";
import { generateMockData } from "./index.ts";

export async function handlePropertyAnalysis(req, requestData) {
  const { address, uniqueId, forceRefresh } = requestData;
  
  if (!address) {
    return new Response(
      JSON.stringify({ error: "Address is required" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`Analyzing property at address: ${address} (uniqueId: ${uniqueId || 'none'}, forceRefresh: ${forceRefresh})`);
  
  // Check if OpenAI API key is available
  const openAIApiKey = validateApiKey();
  if (!openAIApiKey) {
    return createErrorResponse(
      "OpenAI API key is not configured in the new Supabase environment", 
      generateMockData(address)
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
  
  try {
    const generatedContent = await callOpenAI(address, openAIApiKey);
    
    console.log("Successfully processed OpenAI response");
    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
}
