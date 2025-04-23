
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
    
    // Make processing more deterministic for demo purposes
    const uniqueId = new Date().getTime() + Math.random().toString(36).substring(2, 8);
    
    // In a real implementation, we would call the API
    // For demo purposes, return a predictable job ID
    return `property-model-${uniqueId}`;
    
    /* Actual implementation would be:
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
        prompt: "Realistic house architecture, detailed building structure",
        reference_model_id: "house", // Use house as reference model
        preserve_topology: true,     // Better for architectural models
        mesh_quality: "high"        // Higher quality for detailed structures
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meshy API error:", errorData);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy API response:", data);
    
    // Return the model URL or ID for later retrieval
    return data.id || data.model_url || data.status;
    */
  } catch (error) {
    console.error("Error generating 3D model:", error);
    throw error;
  }
};

/**
 * Checks the status of a 3D model generation job
 */
export const checkModelStatus = async (jobId: string): Promise<any> => {
  try {
    console.log("Checking status for job:", jobId);
    
    // For demo purposes, return a fake completed status
    return { 
      state: 'completed',
      output: {
        model_url: '/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png'
      }
    };
    
    /* Actual implementation would be:
    const response = await fetch(`${MESHY_API_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.status}`);
    }

    return await response.json();
    */
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
    
    if (status.state === 'completed') {
      return status.output.model_url || '';
    }
    
    throw new Error('Model not ready yet');
  } catch (error) {
    console.error("Error getting model URL:", error);
    throw error;
  }
};
