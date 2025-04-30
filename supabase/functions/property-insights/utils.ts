
// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Check if OpenAI API key is configured
export function validateApiKey() {
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openAIApiKey) {
    console.error("OPENAI_API_KEY is not set in environment variables");
    return null;
  }
  
  return openAIApiKey;
}

// Helper function to create a standardized error response
export function createErrorResponse(message, defaultData) {
  return new Response(
    JSON.stringify({ 
      error: message, 
      defaultData
    }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
