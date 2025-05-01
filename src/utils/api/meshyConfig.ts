
/**
 * Configuration and authentication utilities for Meshy API and other services
 */
import { supabase } from '@/integrations/supabase/client';

const MESHY_API_URL = "https://api.meshy.ai/openapi/v1";
const SAMPLE_MODEL_URL = "https://storage.googleapis.com/realestate-3d-models/demo-property.glb";

// Default Google Maps API key for development (non-sensitive)
const GOOGLE_MAPS_API_KEY = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE";

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
