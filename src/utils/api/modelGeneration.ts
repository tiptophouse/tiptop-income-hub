
/**
 * 3D model generation utilities using Meshy API
 * Documentation: https://docs.meshy.ai/
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
    
    // Get the Meshy API token
    const MESHY_API_TOKEN = "msy_avpp46RPVW7UlyUSsEez6fTuqYvIJgQDg0nM"; // Using the provided token
    console.log("Using Meshy API with enhanced prompt:", enhancedPrompt);
    
    // Format the image data as required by the OpenAPI
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    // Make API call to Meshy OpenAPI with extended parameters from documentation
    const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        ai_model: "meshy-5", // Using their best model as per documentation
        topology: "quad", // quad topology for better mesh quality
        target_polycount: 100000, // Higher poly count for better detail
        symmetry_mode: "auto", // Auto detect symmetry
        should_remesh: true, // Remeshing for cleaner topology
        should_texture: true, // Generate textures
        enable_pbr: true, // Enable PBR materials for better realism
        texture_prompt: enhancedPrompt, // Using our enhanced prompt
        texture_resolution: 2048, // Higher resolution textures
        unwrap_mode: "auto", // Auto UV unwrapping
        output_format: "glb", // GLB format for web compatibility
        normal_maps: true, // Generate normal maps
        roughness_metalness_maps: true, // Generate PBR maps
        denoising_strength: 0.5, // Moderate denoising to preserve details
        generate_background: false // No background to focus on the property
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
    localStorage.setItem('meshy_demo_model', 'false');
    
    // Track this successful API call
    trackApiCall();
    
    return taskId;
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
