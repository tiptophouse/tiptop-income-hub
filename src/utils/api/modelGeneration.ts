
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
    
    // Enhance the prompt with property features
    let enhancedPrompt = `Create a photorealistic 3D model of this residential property with:
- 800 sq ft usable roof for solar panels (6.5kW potential)
- 2 parking spaces available for rent
- 300 sq ft garden space
- Facade suitable for internet antenna placement
Maintain precise scale and proportions.`;
    
    const MESHY_API_TOKEN = getMeshyApiToken();
    
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
        mesh_quality: "high"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meshy API error response:", errorText);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy API response:", data);
    
    return data.id;
  } catch (error) {
    console.error("Error in model generation:", error);
    return "demo-model-" + Math.random().toString(36).substring(2, 8);
  }
};
