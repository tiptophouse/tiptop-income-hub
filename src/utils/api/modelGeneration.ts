
/**
 * 3D model generation utilities using Meshy API
 */
import { MESHY_API_URL, getMeshyApiToken, SAMPLE_MODEL_URL } from './meshyConfig';

export const generateModelFromImage = async (imageData: string, propertyFeatures?: any): Promise<string> => {
  try {
    console.log("Generating 3D model from image using Meshy API");
    
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
    
    // Make API call to Meshy.ai
    const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        mode: "geometry",
        background_removal: true,
        generate_material: true,
        prompt: enhancedPrompt, 
        reference_model_id: "house",
        preserve_topology: true,
        mesh_quality: "high",
        callback_url: window.location.origin + "/api/meshy-webhook" // Optional webhook for completion notification
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meshy API error response:", errorText);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy API response:", data);
    
    // Store the job ID in localStorage for status checking
    localStorage.setItem('meshy_latest_job_id', data.id);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    
    return data.id;
  } catch (error) {
    console.error("Error in model generation:", error);
    // Generate a demo model ID for fallback
    const demoId = "demo-model-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('meshy_latest_job_id', demoId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    return demoId;
  }
};
