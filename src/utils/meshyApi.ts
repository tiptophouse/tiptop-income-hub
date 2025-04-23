
/**
 * Utility functions for interacting with the Meshy API
 */

const MESHY_API_TOKEN = "msy_DgxWw3aWy765u25h6IRoS4P2KWKpleCcoWT6";
const MESHY_API_URL = "https://api.meshy.ai/v1";

/**
 * Generates a 3D model from an image using Meshy API
 */
export const generateModelFromImage = async (imageData: string): Promise<string> => {
  try {
    console.log("Generating 3D model from image using Meshy API");
    
    // Remove data URL prefix if it exists
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    console.log("Calling Meshy API with token:", MESHY_API_TOKEN.substring(0, 5) + "...");
    
    const response = await fetch(`${MESHY_API_URL}/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        mode: "geometry",         // Focus on accurate geometry
        background_removal: true, // Remove background for cleaner model
        generate_material: true,  // Generate realistic materials
        prompt: "Realistic residential house architecture, detailed building structure with accurate proportions", // Improved prompt for better results
        reference_model_id: "house", // Use house as reference model 
        preserve_topology: true,     // Better for architectural models
        mesh_quality: "high"         // Higher quality for detailed structures
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meshy API error:", errorData);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy API response:", data);
    
    // Return the job ID for later retrieval
    return data.id;
  } catch (error) {
    console.error("Error generating 3D model:", error);
    throw error;
  }
};

/**
 * Generates a 3D model from multiple images using Meshy API
 * Note: This is a placeholder for future API capabilities
 * Current Meshy API only supports single image input
 */
export const generateModelFromMultipleImages = async (imageDataArray: string[]): Promise<string> => {
  try {
    console.log(`Generating 3D model from ${imageDataArray.length} images`);
    
    // For now, we'll use the first (front) image as the best representation
    // When Meshy API supports multiple images, this function can be updated
    return await generateModelFromImage(imageDataArray[0]);
    
    // Future implementation when API supports multiple images:
    /*
    const response = await fetch(`${MESHY_API_URL}/multi-view-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        images: imageDataArray.map(img => img.includes('base64,') ? img.split('base64,')[1] : img),
        mode: "geometry",
        generate_material: true,
        prompt: "Realistic house architecture"
      })
    });
    */
  } catch (error) {
    console.error("Error generating 3D model from multiple images:", error);
    throw error;
  }
};

/**
 * Checks the status of a 3D model generation job
 */
export const checkModelStatus = async (jobId: string): Promise<any> => {
  try {
    console.log("Checking status for job:", jobId);
    
    const response = await fetch(`${MESHY_API_URL}/tasks/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Job status response:", data);
    return data;
  } catch (error) {
    console.error("Error checking model status:", error);
    throw error;
  }
};

/**
 * Get the download URL for a completed 3D model
 */
export const getModelDownloadUrl = async (jobId: string): Promise<string> => {
  try {
    const status = await checkModelStatus(jobId);
    
    if (status.state === 'completed' && status.output?.model_url) {
      return status.output.model_url;
    }
    
    throw new Error('Model not ready yet or no model URL available');
  } catch (error) {
    console.error("Error getting model URL:", error);
    throw error;
  }
};
