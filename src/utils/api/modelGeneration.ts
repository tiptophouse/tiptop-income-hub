
/**
 * 3D model generation utilities using Meshy API
 */
import { MESHY_API_URL, getMeshyApiToken, SAMPLE_MODEL_URL, canMakeModelApiCall, trackApiCall } from './meshyConfig';

export const generateModelFromImage = async (imageData: string, propertyFeatures?: any): Promise<string> => {
  try {
    console.log("Generating 3D model from image using Meshy OpenAPI");
    
    // Check if we should use the actual API or return a demo model
    if (!canMakeModelApiCall()) {
      console.log("Using demo model instead of calling Meshy API");
      // Generate a demo model ID for fallback
      const demoId = "demo-model-" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('meshy_latest_job_id', demoId);
      localStorage.setItem('meshy_job_created_at', new Date().toString());
      localStorage.setItem('meshy_last_status_' + demoId, 'SUCCEEDED');
      localStorage.setItem('meshy_demo_model', 'true');
      return demoId;
    }
    
    // Remove data URL prefix if it exists
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    if (!base64Image || base64Image.length < 100) {
      console.error("Invalid or empty image data");
      throw new Error("Invalid image data for model generation");
    }
    
    // Create enhanced prompt with property features
    let enhancedPrompt = `Create a photorealistic 3D model of this residential property with:`;
    
    // Add roof details if available
    if (propertyFeatures?.roofSize) {
      enhancedPrompt += `\n- ${propertyFeatures.roofSize} sq ft usable roof for solar panels (${propertyFeatures.solarPotentialKw || 6.5}kW potential)`;
    } else {
      enhancedPrompt += `\n- 800 sq ft usable roof for solar panels (6.5kW potential)`;
    }
    
    // Add parking details
    if (propertyFeatures?.parkingSpaces) {
      enhancedPrompt += `\n- ${propertyFeatures.parkingSpaces} parking spaces available for rent`;
    } else {
      enhancedPrompt += `\n- 2 parking spaces available for rent`;
    }
    
    // Add garden details
    if (propertyFeatures?.hasGarden) {
      enhancedPrompt += `\n- ${propertyFeatures?.gardenSqFt || 300} sq ft garden space`;
    }
    
    // Add internet details if available
    if (propertyFeatures?.internetMbps) {
      enhancedPrompt += `\n- Facade suitable for internet antenna placement (${propertyFeatures.internetMbps}Mbps)`;
    } else {
      enhancedPrompt += `\n- Facade suitable for internet antenna placement`;
    }
    
    enhancedPrompt += `\nMaintain precise scale and proportions.`;
    
    // Use the direct token value for API call
    const MESHY_API_TOKEN = "msy_VCpuL3jqR4WSuz9hCwsQljlQ2NCWFBa2OZQZ";
    console.log("Using Meshy API with enhanced prompt:", enhancedPrompt);
    
    // Format the image data as required by the OpenAPI
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    // Make API call to Meshy OpenAPI - COMMENTED OUT TO PREVENT ACTUAL API CALLS
    /*
    const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
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
        texture_prompt: enhancedPrompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meshy OpenAPI error response:", errorText);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy OpenAPI response:", data);
    
    // Store the job ID in localStorage for status checking
    // Note: result property contains the task id in the OpenAPI
    const taskId = data.result;
    localStorage.setItem('meshy_latest_job_id', taskId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    
    // Track this successful API call
    trackApiCall();
    
    return taskId;
    */
    
    // For now, return a demo model to prevent API calls
    console.log("DEMO MODE: Returning demo model instead of calling actual API");
    // Generate a demo model ID for fallback
    const demoId = "demo-model-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('meshy_latest_job_id', demoId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    localStorage.setItem('meshy_last_status_' + demoId, 'SUCCEEDED');
    localStorage.setItem('meshy_demo_model', 'true');
    
    return demoId;
  } catch (error) {
    console.error("Error in model generation:", error);
    // Generate a demo model ID for fallback
    const demoId = "demo-model-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('meshy_latest_job_id', demoId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    localStorage.setItem('meshy_demo_model', 'true');
    return demoId;
  }
};
