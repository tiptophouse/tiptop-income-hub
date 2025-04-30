
/**
 * Service to interact with Google Solar API
 */
import { getGoogleMapsApiKey, getGoogleSunroofApiKey } from '@/utils/api/meshyConfig';
import { SolarApiResponse } from './types';

/**
 * Fetch solar data from the Google Solar API
 */
export const fetchSolarData = async (latitude: number, longitude: number): Promise<SolarApiResponse> => {
  try {
    // Get API key securely
    const apiKey = await getGoogleMapsApiKey();
    const sunroofApiKey = await getGoogleSunroofApiKey() || apiKey;

    // Use the sunroof API key if available, otherwise fall back to the maps key
    const activeKey = sunroofApiKey || apiKey;

    const response = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${activeKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Solar API error: ${response.status}`);
    }

    const data: SolarApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching solar data:', error);
    throw error;
  }
};
