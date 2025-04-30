
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../property-insights/utils.ts";

interface TokenRequest {
  tokenType: "openai" | "google_maps" | "google_client_id" | "google_client_secret" | "google_cloud" | "google_sunroof" | "meshy";
}

// Secure function to get API tokens from environment variables
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the token type from the request body
    const { tokenType } = await req.json() as TokenRequest;
    
    if (!tokenType) {
      return new Response(
        JSON.stringify({ error: "Token type is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map token type to environment variable name
    const envVarMap: Record<string, string> = {
      "openai": "OPENAI_API_KEY",
      "google_maps": "GOOGLE_MAPS_API_KEY",
      "google_client_id": "GOOGLE_CLIENT_ID", 
      "google_client_secret": "GOOGLE_CLIENT_SECRET",
      "google_cloud": "GOOGLE_CLOUD_API_KEY",
      "google_sunroof": "GOOGLE_SUNROOF_API_KEY",
      "meshy": "MESHY_API_KEY"
    };

    const envVar = envVarMap[tokenType];
    if (!envVar) {
      return new Response(
        JSON.stringify({ error: "Invalid token type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the token from environment variables
    const token = Deno.env.get(envVar);
    if (!token) {
      console.error(`${envVar} is not set in environment variables`);
      return new Response(
        JSON.stringify({ 
          error: `${envVar} is not configured`, 
          token: null 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the token
    return new Response(
      JSON.stringify({ token }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
