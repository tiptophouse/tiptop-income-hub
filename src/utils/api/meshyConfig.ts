
/**
 * Configuration and authentication utilities for Meshy API
 */
const MESHY_API_URL = "https://api.meshy.ai/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

// Get the API token from environment variables or fallback to a default for development
export const getMeshyApiToken = () => {
  // In production, this should come from Supabase secrets
  return "msy_PRKZaCCaJijJsvgUmYg8VNttvNDO3xPFgiux"; 
};

export { MESHY_API_URL, SAMPLE_MODEL_URL };
