
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    
    // Use the provided Meshy API token directly
    const MESHY_API_TOKEN = "msy_VCpuL3jqR4WSuz9hCwsQljlQ2NCWFBa2OZQZ"

    // Use the first available image (prefer satellite if available)
    const imageToProcess = satelliteImage || mapImage
    
    // Format the image data as required by the OpenAPI
    const imageUrl = imageToProcess.includes('base64,') 
      ? imageToProcess  // Keep the full data URI if it already has the proper format
      : `data:image/png;base64,${imageToProcess}`
    
    // Call Meshy API to generate 3D model from image using OpenAPI
    const response = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        ai_model: "meshy-5",
        topology: "quad", 
        target_polycount: 100000,
        symmetry_mode: "auto",
        should_remesh: true,
        should_texture: true,
        enable_pbr: true,
        texture_prompt: `Create a photorealistic 3D model of this residential property`
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Meshy API error response:", errorText)
      return new Response(
        JSON.stringify({ error: `Meshy API error: ${response.status}`, details: errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const result = await response.json()
    console.log("Successfully initiated 3D model generation, job ID:", result.result)

    // Store the job details in the database (optional)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      const { error } = await supabase
        .from('model_jobs')
        .insert({
          job_id: result.result,
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
      JSON.stringify({ success: true, jobId: result.result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error processing map image:", error)
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
