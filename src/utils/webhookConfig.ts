
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Store the webhook URL in localStorage
export const setWebhookUrl = (url: string): void => {
  localStorage.setItem('webhook_url', url);
};

// Get the webhook URL from localStorage or use the provided default
export const getWebhookUrl = (): string => {
  return localStorage.getItem('webhook_url') || 'https://hook.eu1.make.com/cweboprf3sf4bjd66lobyzdt8d325b1v';
};

/**
 * Send address to Make.com webhook when user clicks Analyze Now
 * 
 * @param address The property address entered by the user
 * @returns Success status
 */
export const sendAddressToWebhook = async (address: string): Promise<boolean> => {
  try {
    if (!address) {
      console.error("No address provided to sendAddressToWebhook");
      return false;
    }

    const webhookUrl = getWebhookUrl();
    console.log("Sending address to Make.com webhook:", address);

    const payload = {
      address,
      timestamp: new Date().toISOString(),
      source: window.location.origin,
      action: "address_submission"
    };

    // Try to send with regular fetch first
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log("Successfully sent address to Make.com webhook, response:", response);
        return true;
      }
      
      console.log("Make.com webhook response not OK:", response.status);
      // Fall through to no-cors attempt
    } catch (error) {
      console.log("Error with standard fetch to Make.com, trying no-cors mode:", error);
    }
    
    // Try with no-cors mode as a fallback
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors',
      body: JSON.stringify(payload)
    });
    
    console.log("Address sent to Make.com webhook with no-cors mode");
    return true;
  } catch (error) {
    console.error("Error sending address to Make.com webhook:", error);
    return false;
  }
};

/**
 * Sends captured property images to the Make.com webhook
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

    const webhookUrl = getWebhookUrl();
    if (!webhookUrl) {
      console.log("No Make.com webhook URL configured, skipping webhook send");
      return false;
    }

    // Ensure we have at least one image
    if (!satelliteImage && !streetViewImage) {
      console.error("No images available to send to Make.com");
      return false;
    }

    console.log("Sending property data to Make.com webhook for address:", address);

    const payload = {
      address,
      timestamp: new Date().toISOString(),
      source: window.location.origin,
      images: {
        satelliteView: satelliteImage,
        streetView: streetViewImage
      },
      analyzeRequest: true
    };

    // Try to send with regular fetch first
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log("Successfully sent data to Make.com webhook, response:", response);
        return true;
      }
      
      console.log("Make.com webhook response not OK:", response.status);
      // Fall through to no-cors attempt
    } catch (error) {
      console.log("Error with standard fetch to Make.com, trying no-cors mode:", error);
    }
    
    // Try with no-cors mode as a fallback
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors',
      body: JSON.stringify(payload)
    });
    
    console.log("Data sent to Make.com webhook with no-cors mode");
    
    // Also call the Supabase Edge Function if it's set up
    try {
      const { data, error } = await supabase.functions.invoke('process-map-image', {
        body: {
          address,
          mapImage: streetViewImage,
          satelliteImage: satelliteImage
        }
      });

      if (error) {
        console.error("Error calling process-map-image function:", error);
      } else if (data?.jobId) {
        console.log("Successfully initiated 3D model generation, job ID:", data.jobId);
        
        // Dispatch event with job ID
        const jobEvent = new CustomEvent('modelJobCreated', {
          detail: { 
            jobId: data.jobId,
            address: address
          }
        });
        document.dispatchEvent(jobEvent);
      }
    } catch (edgeFunctionError) {
      console.error("Error with edge function:", edgeFunctionError);
    }
    
    return true;
  } catch (error) {
    console.error("Error sending images to Make.com webhook:", error);
    return false;
  }
};
