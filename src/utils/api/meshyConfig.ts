
/**
 * Configuration and authentication utilities for Meshy API and other services
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const MESHY_API_URL = "https://api.meshy.ai/openapi/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

// Default Google Maps API key for development (non-sensitive)
const GOOGLE_MAPS_API_KEY = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE";

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
  // Always allow in demo mode
  if (!forceCheck && (window.location.hostname.includes('localhost') || 
      window.location.hostname.includes('lovable'))) {
    return false; // Use demo models in development/demo environments
  }
  
  resetApiTrackingIfNeeded();
  
  // Check if we've exceeded daily limit
  const DAILY_LIMIT = 5;
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
  const MIN_INTERVAL = 2 * 60 * 1000; // 2 minutes
  if (now - apiCallsTracking.lastCallTimestamp < MIN_INTERVAL) {
    toast({
      title: "Please Wait",
      description: "Please wait a few minutes before generating another 3D model.",
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
};

// Set model generation enabled/disabled
export const setModelGenerationEnabled = (enabled: boolean) => {
  apiCallsTracking.modelGenerationEnabled = enabled;
};

// Get the API token from Supabase Edge Function or fallback to development value
export const getMeshyApiToken = async (): Promise<string> => {
  try {
    // In production, get the token from Supabase secrets via Edge Function
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'meshy' }
    });
    
    if (error) {
      console.error('Error fetching Meshy API token:', error);
      throw error;
    }
    
    if (data?.token) {
      return data.token;
    }
    
    throw new Error('No token returned from edge function');
  } catch (error) {
    console.warn('Using fallback Meshy API token for development:', error);
    // Set the provided token as fallback for development
    return "msy_VCpuL3jqR4WSuz9hCwsQljlQ2NCWFBa2OZQZ"; 
  }
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

// Get Google Cloud API Key securely
export const getGoogleCloudApiKey = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_cloud' }
    });
    
    if (error) {
      console.error('Error fetching Google Cloud API key:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error getting Google Cloud API key:', error);
    return null;
  }
};

// Get Google Sunroof API Key securely
export const getGoogleSunroofApiKey = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_sunroof' }
    });
    
    if (error) {
      console.error('Error fetching Google Sunroof API key:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error getting Google Sunroof API key:', error);
    return null;
  }
};

// Get Google OAuth Client ID securely
export const getGoogleClientId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_client_id' }
    });
    
    if (error) {
      console.error('Error fetching Google Client ID:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error getting Google Client ID:', error);
    return null;
  }
};

// Get Google OAuth Client Secret securely
export const getGoogleClientSecret = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-tokens', {
      body: { tokenType: 'google_client_secret' }
    });
    
    if (error) {
      console.error('Error fetching Google Client Secret:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error getting Google Client Secret:', error);
    return null;
  }
};

export { MESHY_API_URL, SAMPLE_MODEL_URL, GOOGLE_MAPS_API_KEY };
