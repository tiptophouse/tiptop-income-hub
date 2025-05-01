
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
    
    // If aerial view is available but no street or satellite, use it
    if (!primaryImage && imageData.aerialView) {
      primaryImage = imageData.aerialView;
    }
    
    // Check if we have any image to generate a model from
    if (!primaryImage) {
      console.warn("No suitable images found for 3D model generation");
      
      // Create a demo ID since we couldn't get real images
      const demoId = "demo-no-images-" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('meshy_latest_job_id', demoId);
      localStorage.setItem('meshy_job_created_at', new Date().toString());
      localStorage.setItem('meshy_demo_model', 'true');
      
      // Dispatch an event with the demo ID
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { 
          jobId: demoId,
          hasSatelliteImage: false,
          hasAerialImage: false,
          demo: true
        }
      });
      document.dispatchEvent(modelEvent);
      
      return demoId;
    }
    
    // Generate the 3D model using the Meshy API with the captured image
    console.log("Calling Meshy API to generate 3D model from captured image");
    const jobId = await generateModelFromImage(primaryImage);
    console.log("3D model generation job created:", jobId);
    
    // Store the job ID in localStorage and dispatch event for components to listen for
    localStorage.setItem('meshy_latest_job_id', jobId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { 
        jobId,
        hasSatelliteImage: !!imageData.satellite,
        hasAerialImage: !!imageData.aerialView
      }
    });
    document.dispatchEvent(modelEvent);
    
    return jobId;
  } catch (error) {
    console.error("Error in model generation process:", error);
    
    // Create a demo/fallback ID for error cases
    const fallbackId = "demo-error-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('meshy_latest_job_id', fallbackId);
    localStorage.setItem('meshy_job_created_at', new Date().toString());
    localStorage.setItem('meshy_demo_model', 'true');
    
    // Still dispatch an event with the fallback ID
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { 
        jobId: fallbackId,
        hasSatelliteImage: false,
        hasAerialImage: false,
        demo: true
      }
    });
    document.dispatchEvent(modelEvent);
    
    return fallbackId;
  }
};
