/**
 * Utility functions for interacting with the Meshy API
 */

const MESHY_API_TOKEN = "msy_PRKZaCCaJijJsvgUmYg8VNttvNDO3xPFgiux";
const MESHY_API_URL = "https://api.meshy.ai/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

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
    
    console.log("Calling Meshy API...");
    
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
        prompt: "Create a photorealistic 3D model of this residential property, focusing on architectural accuracy and details of the front facade. Maintain precise scale and proportions, including windows, doors, and distinctive architectural features.", 
        reference_model_id: "house",
        preserve_topology: true,
        mesh_quality: "high"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meshy API error:", errorData);
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Meshy API response:", data);
    
    return data.id;
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
    
    // Check if this is a demo job ID (fallback)
    if (jobId.startsWith('demo-3d-model-')) {
      return {
        state: 'completed',
        status: 'completed',
        output: {
          model_url: SAMPLE_MODEL_URL
        }
      };
    }
    
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
    // Return a mock completed state for demo/fallback IDs
    if (jobId.startsWith('demo-3d-model-')) {
      return {
        state: 'completed',
        status: 'completed',
        output: {
          model_url: SAMPLE_MODEL_URL
        }
      };
    }
    throw error;
  }
};

/**
 * Get the download URL for a completed 3D model
 */
export const getModelDownloadUrl = async (jobId: string): Promise<string> => {
  try {
    // For demo job IDs, immediately return sample model
    if (jobId.startsWith('demo-3d-model-')) {
      return SAMPLE_MODEL_URL;
    }
    
    const status = await checkModelStatus(jobId);
    
    if (status.state === 'completed' && status.output?.model_url) {
      return status.output.model_url;
    }
    
    throw new Error('Model not ready yet or no model URL available');
  } catch (error) {
    console.error("Error getting model URL:", error);
    // Always provide a fallback URL for errors
    return SAMPLE_MODEL_URL;
  }
};

/**
 * To integrate with Google Project Sunroof API for solar potential data:
 * 
 * Google's Project Sunroof API could provide detailed information about:
 * 1. Solar potential for the roof (kWh/year)
 * 2. Percentage of roof that's solar-viable
 * 3. Estimated savings
 * 4. Carbon offset potential
 * 
 * However, the Project Sunroof API is not publicly available for general use.
 * Alternative approaches:
 * 
 * 1. Use the public Project Sunroof Data Explorer for manual lookups:
 *    https://sunroof.withgoogle.com/data-explorer/
 * 
 * 2. Use alternative solar APIs like:
 *    - NREL's PVWatts Calculator API (https://developer.nrel.gov/docs/solar/pvwatts/v6/)
 *    - NREL's Solar Resource Data API
 * 
 * 3. If enterprise-level access is needed, contact Google directly about
 *    potential partnership or enterprise access to Project Sunroof data.
 */
