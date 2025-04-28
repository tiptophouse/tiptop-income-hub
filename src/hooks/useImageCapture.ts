
import { toast } from '@/components/ui/use-toast';
import { getStreetViewImageAsBase64, getSatelliteImageAsBase64, captureMapScreenshot } from '@/utils/streetViewService';
import { sendImagesWebhook } from '@/utils/webhookConfig';

export const useImageCapture = () => {
  const captureAndSendImages = async (address: string, mapRef: React.RefObject<HTMLDivElement>) => {
    try {
      console.log("Starting image capture process for address:", address);
      
      // Capture all images in parallel to improve performance
      const [streetViewImage, satelliteImage, mapScreenshot] = await Promise.all([
        getStreetViewImageAsBase64(address).catch(err => {
          console.error("Error capturing Street View:", err);
          return null;
        }),
        getSatelliteImageAsBase64(address).catch(err => {
          console.error("Error capturing Satellite View:", err);
          return null;
        }),
        mapRef.current ? captureMapScreenshot(mapRef).catch(err => {
          console.error("Error capturing Map Screenshot:", err);
          return null;
        }) : null
      ]);
      
      console.log("Images captured:", {
        streetView: streetViewImage ? "Success" : "Failed",
        satellite: satelliteImage ? "Success" : "Failed",
        mapScreenshot: mapScreenshot ? "Success" : "Failed"
      });
      
      // Send street view and map image together
      if (streetViewImage || mapScreenshot) {
        const streetViewResult = await sendImagesWebhook(address, mapScreenshot, streetViewImage);
        console.log("Street view webhook result:", streetViewResult ? "Success" : "Failed");
      }
      
      // Send satellite view separately if available
      if (satelliteImage) {
        console.log("Sending satellite image to webhook");
        const satelliteResult = await sendImagesWebhook(address, satelliteImage, null);
        console.log("Satellite webhook result:", satelliteResult ? "Success" : "Failed");
      }
      
      if (!streetViewImage && !satelliteImage && !mapScreenshot) {
        throw new Error("Failed to capture any images");
      }
      
      toast({
        title: "Images Sent",
        description: "Property views have been sent to your webhook",
      });
    } catch (error) {
      console.error("Error capturing and sending images:", error);
      toast({
        title: "Error",
        description: "Failed to send property views to webhook",
        variant: "destructive",
      });
    }
  };

  return { captureAndSendImages };
};
