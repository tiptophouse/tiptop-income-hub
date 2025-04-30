
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getWebhookUrl } from './webhookUrlManager';
import { isValidImageFormat } from './imageValidation';

/**
 * Sends property image URLs to the Make.com webhook
 * 
 * @param address The property address
 * @param satelliteImageUrl URL to satellite image (if available)
 * @param streetViewImageUrl URL to street view image (if available)
 * @param aerialImageZoom12Url URL to aerial image at zoom level 12 (if available)
 * @returns Success status
 */
export const sendImagesWebhook = async (
  address: string,
  satelliteImageUrl: string | null, 
  streetViewImageUrl: string | null,
  aerialImageZoom12Url: string | null = null
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
    
    // Validate image formats
    const validatedImages = {
      satelliteView: isValidImageFormat(satelliteImageUrl) ? satelliteImageUrl : null,
      streetView: isValidImageFormat(streetViewImageUrl) ? streetViewImageUrl : null,
      aerialZoom12: isValidImageFormat(aerialImageZoom12Url) ? aerialImageZoom12Url : null
    };
    
    console.log("Validated image URLs for webhook:", {
      streetView: validatedImages.streetView ? "✓" : "✗",
      satellite: validatedImages.satelliteView ? "✓" : "✗",
      aerialZoom12: validatedImages.aerialZoom12 ? "✓" : "✗"
    });

    // Ensure we have at least one valid image
    if (!validatedImages.satelliteView && !validatedImages.streetView && !validatedImages.aerialZoom12) {
      console.error("No valid image URLs available to send to Make.com");
      toast({
        title: "Warning",
        description: "No valid images were found for this address. Analysis may be limited.",
        variant: "destructive",
      });
      return false;
    }

    console.log("Sending property data to Make.com webhook for address:", address);

    const payload = {
      address,
      timestamp: new Date().toISOString(),
      source: window.location.origin,
      images: validatedImages,
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
          mapImageUrl: streetViewImageUrl,
          satelliteImageUrl: satelliteImageUrl,
          aerialImageUrl: aerialImageZoom12Url
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
