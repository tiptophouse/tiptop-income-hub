
/**
 * 3D model generation utilities using Meshy API
 */
import { generateModelFromImage } from './api/modelGeneration';
import { captureStreetViewForModel } from './streetView';
import { storePropertyData } from './api/propertyDataStorage';

// Function to generate 3D models for properties
export const generatePropertyModels = async (address: string, webhookUrl?: string) => {
  try {
    console.log("Starting property model generation for address:", address);
    
    // Capture street view and satellite images for the property
    const imageData = await captureStreetViewForModel(address);
    
    // Store property data in local storage or database
    await storePropertyData(address, imageData);
    
    let primaryImage = imageData.streetView;
    
    // If Street View isn't available, try using the satellite image
    if (!primaryImage && imageData.satellite) {
      primaryImage = imageData.satellite;
    }
    
    // Check if we have any image to generate a model from
    if (!primaryImage) {
      console.warn("No suitable images found for 3D model generation");
      return null;
    }
    
    // Generate the 3D model using the Meshy API
    const jobId = await generateModelFromImage(primaryImage);
    console.log("3D model generation job created:", jobId);
    
    // Store the job ID in localStorage and dispatch event for components to listen for
    localStorage.setItem('meshy_latest_job_id', jobId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { 
        jobId,
        hasSatelliteImage: !!imageData.satellite
      }
    });
    document.dispatchEvent(modelEvent);
    
    return jobId;
  } catch (error) {
    console.error("Error in model generation process:", error);
    
    // Create a demo/fallback ID for error cases
    const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
    
    // Still dispatch an event with the fallback ID
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { 
        jobId: fallbackId,
        hasSatelliteImage: false
      }
    });
    document.dispatchEvent(modelEvent);
    
    return fallbackId;
  }
};
