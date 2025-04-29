
/**
 * Configuration and authentication utilities for Meshy API and other services
 */
import { supabase } from '@/integrations/supabase/client';

const MESHY_API_URL = "https://api.meshy.ai/v1";
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
    // Fallback for development only - this token should be invalid in production
    return "msy_vALRkb1IEjapXADnwnXqLQSxlkMgkYFCH6o1"; 
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

export { MESHY_API_URL, SAMPLE_MODEL_URL, GOOGLE_MAPS_API_KEY };
