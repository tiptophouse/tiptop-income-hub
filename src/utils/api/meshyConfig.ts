
/**
 * Configuration and authentication utilities for Meshy API and other services
 */
const MESHY_API_URL = "https://api.meshy.ai/openapi/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";
const GOOGLE_MAPS_API_KEY = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE";

// Get the API token from environment variables or fallback to a default for development
export const getMeshyApiToken = () => {
  // In production, this should come from Supabase secrets
  return "msy_eMWReunOS9vuwTnJdqFTZAqD2N0q6FWWSj2w"; 
};

export { MESHY_API_URL, SAMPLE_MODEL_URL, GOOGLE_MAPS_API_KEY };
