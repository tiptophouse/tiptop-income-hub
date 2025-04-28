
/**
 * Dispatch events to notify components about model generation
 */

/**
 * Dispatch an event when a model job is created
 * @param jobId - The model job ID
 * @param hasSatelliteImage - Whether a satellite image is available
 * @param propertyFeatures - The property features
 */
export const notifyModelJobCreated = (
  jobId: string,
  hasSatelliteImage: boolean,
  propertyFeatures: any
) => {
  console.log("Dispatching modelJobCreated event with satellite flag:", hasSatelliteImage);
  const modelEvent = new CustomEvent('modelJobCreated', {
    detail: { 
      jobId: jobId,
      hasSatelliteImage: hasSatelliteImage,
      propertyFeatures: propertyFeatures
    }
  });
  document.dispatchEvent(modelEvent);
};

/**
 * Create a fallback demo model ID and dispatch an event
 * @returns The generated fallback model ID
 */
export const createFallbackModelId = () => {
  const fallbackId = "demo-model-" + Math.random().toString(36).substring(2, 8);
  console.log("Using fallback demo model ID:", fallbackId);
  
  const modelEvent = new CustomEvent('modelJobCreated', {
    detail: { 
      jobId: fallbackId,
      hasSatelliteImage: false,
      propertyFeatures: {
        roofSize: 950,
        hasPool: true,
        hasGarden: true,
        hasParking: true,
        hasEVCharging: false
      }
    }
  });
  document.dispatchEvent(modelEvent);
  
  return fallbackId;
};
