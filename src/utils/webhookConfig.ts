
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Store the webhook URL in localStorage
export const setWebhookUrl = (url: string): void => {
  localStorage.setItem('webhook_url', url);
};

// Get the webhook URL from localStorage
export const getWebhookUrl = (): string => {
  return localStorage.getItem('webhook_url') || '';
};

/**
 * Sends captured property images to the processing edge function
 * 
 * @param address The property address
 * @param satelliteImage Base64 satellite image (if available)
 * @param streetViewImage Base64 street view image (if available)
 * @returns Success status
 */
export const sendImagesWebhook = async (
  address: string,
  satelliteImage: string | null, 
  streetViewImage: string | null
): Promise<boolean> => {
  try {
    if (!address) {
      console.error("No address provided to sendImagesWebhook");
      return false;
    }

    // Ensure we have at least one image
    if (!satelliteImage && !streetViewImage) {
      console.error("No images available to send");
      return false;
    }

    console.log("Sending images to processing function for address:", address);

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-map-image', {
      body: {
        address,
        mapImage: streetViewImage,
        satelliteImage: satelliteImage
      }
    });

    if (error) {
      console.error("Error calling process-map-image function:", error);
      return false;
    }

    console.log("Function response:", data);
    
    if (data?.jobId) {
      console.log("Successfully initiated 3D model generation, job ID:", data.jobId);
      
      // Dispatch event with job ID
      const jobEvent = new CustomEvent('modelJobCreated', {
        detail: { 
          jobId: data.jobId,
          address: address
        }
      });
      document.dispatchEvent(jobEvent);
      
      return true;
    } else {
      console.error("No job ID in response");
      return false;
    }
  } catch (error) {
    console.error("Error sending images to webhook:", error);
    return false;
  }
};
