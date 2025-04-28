
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
      
      // Instead of sending one big payload with both images, send them individually
      // to avoid potential payload size limitations
      
      // Create a combined payload with both images for Make.com
      console.log("Sending combined payload to Make.com webhook...");
      const combinedResult = await sendImagesWebhook(address, satelliteImage, streetViewImage);
      console.log("Combined webhook send result:", combinedResult ? "Success" : "Failed");
      
      if (combinedResult) {
        toast({
          title: "Images Sent",
          description: "Property images were sent to the webhook",
        });
        return true;
      } else {
        toast({
          title: "Warning",
          description: "Failed to send property images to webhook",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error capturing and sending images:", error);
      toast({
        title: "Error",
        description: "Failed to send property images to webhook",
        variant: "destructive",
      });
      return false;
    }
  };

  return { captureAndSendImages };
};
