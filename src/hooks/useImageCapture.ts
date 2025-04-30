
import { toast } from '@/components/ui/use-toast';
import { getStreetViewImageUrl, getSatelliteImageUrl, captureMapScreenshot, getAerialImageZoom12Url } from '@/utils/streetViewService';
import { sendImagesWebhook } from '@/utils/webhookConfig';

// Check if a URL points to a supported image format
const isSupportedImageFormat = (url: string | null): boolean => {
  if (!url) return false;
  
  const supportedFormats = ['png', 'jpeg', 'jpg', 'gif', 'webp'];
  const urlLower = url.toLowerCase();
  
  return supportedFormats.some(format => 
    urlLower.includes(`.${format}`) || 
    urlLower.includes(`format=${format}`) || 
    urlLower.includes(`&maptype=`) // Google Maps static images are always valid
  );
};

export const useImageCapture = () => {
  const captureAndSendImages = async (address: string, mapRef: React.RefObject<HTMLDivElement>) => {
    try {
      console.log("Starting image URL capture process for address:", address);
      
      // Get all image URLs in parallel to improve performance
      const [streetViewImageUrl, satelliteImageUrl, aerialImageZoom12Url] = await Promise.all([
        getStreetViewImageUrl(address).catch(err => {
          console.error("Error getting Street View URL:", err);
          return null;
        }),
        getSatelliteImageUrl(address).catch(err => {
          console.error("Error getting Satellite View URL:", err);
          return null;
        }),
        getAerialImageZoom12Url(address).catch(err => {
          console.error("Error getting Aerial View at zoom 12 URL:", err);
          return null;
        })
      ]);
      
      console.log("Image URLs captured:", {
        streetView: streetViewImageUrl ? "✓" : "✗",
        satellite: satelliteImageUrl ? "✓" : "✗",
        aerialZoom12: aerialImageZoom12Url ? "✓" : "✗"
      });
      
      // Validate image formats
      const validatedStreetViewUrl = isSupportedImageFormat(streetViewImageUrl) ? streetViewImageUrl : null;
      const validatedSatelliteUrl = isSupportedImageFormat(satelliteImageUrl) ? satelliteImageUrl : null;
      const validatedAerialUrl = isSupportedImageFormat(aerialImageZoom12Url) ? aerialImageZoom12Url : null;
      
      console.log("Validated image URLs:", {
        streetView: validatedStreetViewUrl ? "✓" : "✗",
        satellite: validatedSatelliteUrl ? "✓" : "✗",
        aerialZoom12: validatedAerialUrl ? "✓" : "✗"
      });
      
      if (!validatedStreetViewUrl && !validatedSatelliteUrl && !validatedAerialUrl) {
        console.error("Failed to capture any valid image URLs");
        toast({
          title: "Warning",
          description: "Could not capture valid property images for this address",
          variant: "destructive",
        });
        return false;
      }
      
      // Try sending to Make.com webhook with multiple retries
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!success && attempts < maxAttempts) {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} sending to Make.com webhook...`);
        
        success = await sendImagesWebhook(address, validatedSatelliteUrl, validatedStreetViewUrl, validatedAerialUrl);
        
        if (!success && attempts < maxAttempts) {
          console.log(`Retrying in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log("Make.com webhook send result:", success ? "Success" : "Failed");
      
      if (success) {
        toast({
          title: "Data Sent",
          description: "Property details were sent to Make.com for processing",
        });
        return true;
      } else {
        toast({
          title: "Warning",
          description: "Failed to send property data for processing. Make sure your Make.com webhook is configured.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error capturing and sending image URLs:", error);
      toast({
        title: "Error",
        description: "Failed to process property images",
        variant: "destructive",
      });
      return false;
    }
  };

  return { captureAndSendImages };
};
