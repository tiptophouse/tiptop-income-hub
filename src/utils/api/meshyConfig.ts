
/**
 * Configuration and authentication utilities for Meshy API and other services
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const MESHY_API_URL = "https://api.meshy.ai/openapi/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

// Default Google Maps API key for development (non-sensitive)
const GOOGLE_MAPS_API_KEY = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE";

// Use the provided token
const MESHY_API_TOKEN = "msy_2TwuQStaRCKe6TdrF1ByMD8bUqGoWaEgdzzc";

// Track API usage locally to prevent excessive calls
let apiCallsTracking = {
  lastCallTimestamp: 0,
  dailyCallCount: 0,
  modelGenerationEnabled: true
};

// Reset tracking at the start of each day
const resetApiTrackingIfNeeded = () => {
  const now = new Date();
  const lastCall = new Date(apiCallsTracking.lastCallTimestamp);
  
  // Reset if it's a new day
  if (now.getDate() !== lastCall.getDate() || 
      now.getMonth() !== lastCall.getMonth() || 
      now.getFullYear() !== lastCall.getFullYear()) {
    apiCallsTracking.dailyCallCount = 0;
  }
};

// Check if we should allow a new API call
export const canMakeModelApiCall = (forceCheck = false): boolean => {
  // In development, always use actual API if forceCheck is true
  if (forceCheck) {
    return true;
  }
  
  // In development/demo, typically use demo models
  if (window.location.hostname.includes('localhost') || 
      window.location.hostname.includes('lovable')) {
    const useRealApi = localStorage.getItem('use_real_meshy_api') === 'true';
    if (!useRealApi) {
      console.log("Development environment - using demo model unless explicitly enabled");
      return false; // Use demo models in development/demo environments
    }
  }
  
  resetApiTrackingIfNeeded();
  
  // Check if we've exceeded daily limit
  const DAILY_LIMIT = 10; // Increased from 5 to 10
  if (apiCallsTracking.dailyCallCount >= DAILY_LIMIT) {
    toast({
      title: "API Limit Reached",
      description: "Daily limit for 3D model generation reached. Using demo model instead.",
      variant: "destructive"
    });
    return false;
  }
  
  // Check if we've made a call recently
  const now = Date.now();
  const MIN_INTERVAL = 1 * 60 * 1000; // 1 minute - reduced from 2 minutes
  if (now - apiCallsTracking.lastCallTimestamp < MIN_INTERVAL) {
    toast({
      title: "Please Wait",
      description: "Please wait a minute before generating another 3D model.",
      variant: "destructive"
    });
    return false;
  }
  
  // Check if model generation is enabled globally
  if (!apiCallsTracking.modelGenerationEnabled) {
    toast({
      title: "3D Models Disabled",
      description: "3D model generation is currently disabled. Using demo model instead.",
      variant: "default"
    });
    return false;
  }
  
  return true;
};

// Track successful API call
export const trackApiCall = () => {
  apiCallsTracking.lastCallTimestamp = Date.now();
  apiCallsTracking.dailyCallCount += 1;
  
  // Store in localStorage to persist between page refreshes
  localStorage.setItem('meshy_api_last_call', apiCallsTracking.lastCallTimestamp.toString());
  localStorage.setItem('meshy_api_daily_count', apiCallsTracking.dailyCallCount.toString());
};

// Set model generation enabled/disabled
export const setModelGenerationEnabled = (enabled: boolean) => {
  apiCallsTracking.modelGenerationEnabled = enabled;
  localStorage.setItem('meshy_api_enabled', enabled ? 'true' : 'false');
  
  if (enabled) {
    // Enable using real API in development
    localStorage.setItem('use_real_meshy_api', 'true');
  }
};

// Enable using the real API in development mode
export const enableRealApiInDevelopment = () => {
  localStorage.setItem('use_real_meshy_api', 'true');
  toast({
    title: "Real API Enabled",
    description: "Real Meshy API calls enabled for development"
  });
};

// Get the API token from Supabase Edge Function or fallback to development value
export const getMeshyApiToken = async (): Promise<string> => {
  // Directly return the provided token
  return MESHY_API_TOKEN;
};

// Get Google Maps API Key securely
export const getGoogleMapsApiKey = async (): Promise<string> => {
  try {
    // In production, get the key from Supabase secrets via Edge Function
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_maps' }
    });
    
    if (error) {
      console.error('Error fetching Google Maps API key:', error);
      throw error;
    }
    
    if (data?.token) {
      return data.token;
    }
    
    throw new Error('No token returned from edge function');
  } catch (error) {
    console.warn('Using default Google Maps API key:', error);
    // Return the default key
    return GOOGLE_MAPS_API_KEY;
  }
};

// Get Google Sunroof API Key for solar API
export const getGoogleSunroofApiKey = async (): Promise<string | null> => {
  try {
    // Try to get the sunroof-specific API key
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_sunroof' }
    });
    
    if (error) {
      console.error('Error fetching Google Sunroof API key:', error);
      return getGoogleMapsApiKey(); // Fall back to regular Google Maps API key
    }
    
    return data?.token || (await getGoogleMapsApiKey());
  } catch (error) {
    console.error('Error getting Google Sunroof API key:', error);
    return getGoogleMapsApiKey(); // Fall back to regular Google Maps API key
  }
};

// Get OpenAI API Key securely
export const getOpenAIApiKey = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'openai' }
    });
    
    if (error) {
      console.error('Error fetching OpenAI API key:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error getting OpenAI API key:', error);
    return null;
  }
};

// Load stored API usage from localStorage
const loadStoredApiUsage = () => {
  try {
    const lastCall = localStorage.getItem('meshy_api_last_call');
    if (lastCall) {
      apiCallsTracking.lastCallTimestamp = parseInt(lastCall, 10);
    }
    
    const dailyCount = localStorage.getItem('meshy_api_daily_count');
    if (dailyCount) {
      apiCallsTracking.dailyCallCount = parseInt(dailyCount, 10);
    }
    
    const enabled = localStorage.getItem('meshy_api_enabled');
    if (enabled !== null) {
      apiCallsTracking.modelGenerationEnabled = enabled === 'true';
    }
    
    // Reset tracking if needed (new day)
    resetApiTrackingIfNeeded();
  } catch (error) {
    console.error("Error loading API usage data:", error);
  }
};

// Initialize on import
loadStoredApiUsage();

export { MESHY_API_URL, SAMPLE_MODEL_URL, GOOGLE_MAPS_API_KEY, MESHY_API_TOKEN };
