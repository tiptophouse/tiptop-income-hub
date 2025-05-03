
/**
 * Functions for generating 3D models using the Meshy API
 */
import { trackApiCall, MESHY_API_URL, MESHY_API_TOKEN, canMakeModelApiCall } from './meshyConfig';
import { toast } from '@/components/ui/use-toast';

/**
 * Generates a 3D model from an image using the Meshy API
 * @param imageUrl URL or data URL of the image to use for model generation
 * @returns The job ID for the model generation task
 */
export const generateModelFromImage = async (imageUrl: string): Promise<string> => {
  // Check if we can make a real API call or should use demo mode
  const useRealApi = canMakeModelApiCall();
  
  if (!useRealApi) {
    console.log("Using demo model instead of real API call");
    localStorage.setItem('meshy_demo_model', 'true');
    
    // Return a fake job ID for demo mode
    const demoId = "demo-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    return demoId;
  }
  
  try {
    console.log("Making API call to Meshy for 3D model generation");
    
    // Track the API call
    trackApiCall();
    
    // Clear demo mode flag
    localStorage.setItem('meshy_demo_model', 'false');
    
    // First, try to make the API call directly from the client-side
    // This might be blocked by CORS in some cases
    const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json',
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
      }),
    });
    
    // Check response status
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from Meshy API:", errorData);
      throw new Error(`Meshy API error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    console.log("Meshy API response:", data);
    
    if (data.result) {
      return data.result;
    }
    throw new Error("No job ID returned from API");
    
  } catch (error) {
    console.error("Error calling Meshy API directly, trying via Supabase Edge Function:", error);
    
    // Try using Supabase Edge Function as fallback
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error: fnError } = await supabase.functions.invoke('process-map-image', {
        body: { 
          mapImage: imageUrl,
          address: "Property at " + new Date().toISOString()
        }
      });
      
      if (fnError) {
        console.error("Error calling Edge Function:", fnError);
        throw fnError;
      }
      
      if (data?.jobId) {
        console.log("Successfully received job ID from Edge Function:", data.jobId);
        return data.jobId;
      }
      
      throw new Error("No job ID returned from Edge Function");
      
    } catch (fallbackError) {
      console.error("Failed to generate model with fallback method:", fallbackError);
      
      // Return a demo ID if everything fails
      const demoId = "demo-fallback-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('meshy_demo_model', 'true');
      
      toast({
        title: "Using Demo Model",
        description: "Unable to connect to 3D model API. Using a demo model instead.",
        variant: "destructive",
      });
      
      return demoId;
    }
  }
};
