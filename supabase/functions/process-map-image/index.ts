
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
    
    // IMPORTANT: Do not make actual API calls to Meshy to prevent credit usage
    // Instead, generate a demo job ID and return it
    const demoJobId = "demo-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    
    // Store the job details in the database (optional)
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
      JSON.stringify({ success: true, jobId: demoJobId, demo: true }),
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
