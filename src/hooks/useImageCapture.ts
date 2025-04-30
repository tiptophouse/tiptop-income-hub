
import { toast } from '@/components/ui/use-toast';
import { getStreetViewImageAsBase64, getSatelliteImageAsBase64, captureMapScreenshot } from '@/utils/streetViewService';
import { sendImagesWebhook } from '@/utils/webhookConfig';

export const useImageCapture = () => {
  const captureAndSendImages = async (address: string, mapRef: React.RefObject<HTMLDivElement>) => {
    try {
      console.log("Starting image capture process for address:", address);
      
      // Capture all images in parallel to improve performance
      const [streetViewImage, satelliteImage] = await Promise.all([
        getStreetViewImageAsBase64(address).catch(err => {
          console.error("Error capturing Street View:", err);
          return null;
        }),
        getSatelliteImageAsBase64(address).catch(err => {
          console.error("Error capturing Satellite View:", err);
          return null;
        })
      ]);
      
      // Initialize aerialView as null - we'll handle this separately if needed
      const aerialView = null;
      
      console.log("Images captured:", {
        streetView: streetViewImage ? "✓" : "✗",
        satellite: satelliteImage ? "✓" : "✗"
      });
      
      if (!streetViewImage && !satelliteImage) {
        console.error("Failed to capture any images");
        toast({
          title: "Warning",
          description: "Could not capture property images for this address",
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
        
        success = await sendImagesWebhook(address, satelliteImage, streetViewImage);
        
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
      console.error("Error capturing and sending images:", error);
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
