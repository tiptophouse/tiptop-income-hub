
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the Meshy API endpoint and token
const MESHY_API_URL = "https://api.meshy.ai/openapi/v1";
const MESHY_API_TOKEN = "msy_2TwuQStaRCKe6TdrF1ByMD8bUqGoWaEgdzzc"; // Using the provided token

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, mapImage, satelliteImage } = await req.json()
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // At least one image is required
    if (!mapImage && !satelliteImage) {
      return new Response(
        JSON.stringify({ error: 'At least one image (map or satellite) is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing images for address: ${address}`)
    
    // Create job ID
    const jobId = "job-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    
    // Determine which image to use (prefer satellite if available)
    const imageToProcess = satelliteImage || mapImage;
    
    // Make the actual API call to Meshy for 3D model generation
    console.log("Making API call to Meshy for 3D model generation");
    try {
      const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MESHY_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageToProcess,
          ai_model: "meshy-5",
          topology: "quad",
          target_polycount: 100000,
          symmetry_mode: "auto",
          should_remesh: true,
          should_texture: true,
          enable_pbr: true,
          texture_prompt: `Create a photorealistic 3D model of this property: ${address}`
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Meshy API error:", errorText);
        throw new Error(`Meshy API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Meshy API response:", data);
      
      // Store the job details in the database
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        const { error } = await supabase
          .from('model_jobs')
          .insert({
            job_id: data.result, // Use the actual job ID from Meshy
            address: address,
            status: 'processing',
            created_at: new Date().toISOString()
          })
          
        if (error) {
          console.error("Error storing job details:", error)
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Continue even if DB storage fails
      }

      return new Response(
        JSON.stringify({ success: true, jobId: data.result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (apiError) {
      console.error("Meshy API call failed:", apiError);
      
      // Fall back to demo mode if API call fails
      const demoJobId = "demo-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
      
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        const { error } = await supabase
          .from('model_jobs')
          .insert({
            job_id: demoJobId,
            address: address,
            status: 'processing',
            created_at: new Date().toISOString(),
            is_demo: true
          })
          
        if (error) {
          console.error("Error storing job details:", error)
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          jobId: demoJobId, 
          demo: true,
          error: apiError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error("Error processing map image:", error)
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
