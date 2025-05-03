
/**
 * Authentication and token management for API calls
 */
import { supabase } from '@/integrations/supabase/client';
import { GOOGLE_MAPS_API_KEY, MESHY_API_TOKEN } from './apiConstants';

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
