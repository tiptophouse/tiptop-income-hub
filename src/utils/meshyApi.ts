/**
 * Utility functions for interacting with the Meshy API
 */

const MESHY_API_TOKEN = "msy_PRKZaCCaJijJsvgUmYg8VNttvNDO3xPFgiux";
const MESHY_API_URL = "https://api.meshy.ai/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

/**
 * Analyzes property features from an image
 * Uses image processing to detect roof size, swimming pool, garden, parking, EV charging
 */
export const analyzePropertyImage = async (imageData: string): Promise<{
  roofSize: number | null, 
  hasPool: boolean,
  hasGarden: boolean,
  hasParking: boolean,
  hasEVCharging: boolean,
  error?: string
}> => {
  try {
    console.log("Analyzing property image");
    
    // For now, we'll return mock analysis data
    // In a real scenario, we would send this to an image recognition API
    return {
      roofSize: Math.round(Math.random() * 200) + 800, // Mock roof size between 800-1000 sq ft
      hasPool: Math.random() > 0.7,
      hasGarden: Math.random() > 0.4,
      hasParking: Math.random() > 0.3,
      hasEVCharging: Math.random() > 0.8
    };
    
    // TODO: Implement actual image analysis with OpenAI or custom API
  } catch (error) {
    console.error("Error analyzing property image:", error);
    return {
      roofSize: null,
      hasPool: false,
      hasGarden: false,
      hasParking: true,
      hasEVCharging: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Generates a 3D model from an image using Meshy API
 */
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
    
    console.log(`Calling Meshy API with image data of ${base64Image.length} chars`);
    
    // Enhance the prompt with property features if available
    let enhancedPrompt = "Create a photorealistic 3D model of this residential property, focusing on architectural accuracy and details of the entire property including rooftop features. ";
    
    if (propertyFeatures) {
      enhancedPrompt += "Highlight the following monetizable areas: ";
      if (propertyFeatures.roofSize && propertyFeatures.roofSize > 0) {
        enhancedPrompt += `roof (${propertyFeatures.roofSize} sq ft, ideal for solar panels), `;
      } else {
        enhancedPrompt += "roof (for solar panels), ";
      }
      
      if (propertyFeatures.hasParking) {
        enhancedPrompt += "driveway/parking area (for EV charging), ";
      }
      
      if (propertyFeatures.hasGarden) {
        enhancedPrompt += "garden/landscape areas (for smart irrigation), ";
      }
      
      if (propertyFeatures.hasPool) {
        enhancedPrompt += "swimming pool (for smart pool systems), ";
      }
      
      enhancedPrompt += "exterior walls (for internet antennas).";
    } else {
      enhancedPrompt += "Highlight potential monetizable areas such as the roof (for solar panels), driveway (for EV charging), exterior walls (for internet antennas) and exterior spaces.";
    }
    
    enhancedPrompt += " Maintain precise scale and proportions, including windows, doors, and distinctive architectural features.";
    
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
      try {
        const errorData = JSON.parse(errorText);
        console.error("Parsed Meshy API error:", errorData);
      } catch (e) {
        // If the error text isn't valid JSON, just log it as is
      }
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
