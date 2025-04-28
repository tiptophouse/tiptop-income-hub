
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
        streetView: streetViewImage ? "✓" : "✗",
        satellite: satelliteImage ? "✓" : "✗",
        mapScreenshot: mapScreenshot ? "✓" : "✗"
      });
      
      let successCount = 0;
      
      // Send each image type separately to avoid payload size issues
      if (streetViewImage) {
        console.log("Sending street view image...");
        const streetViewResult = await sendImagesWebhook(address, null, streetViewImage);
        if (streetViewResult) successCount++;
        console.log("Street view send result:", streetViewResult ? "Success" : "Failed");
      }
      
      if (satelliteImage) {
        console.log("Sending satellite image...");
        const satelliteResult = await sendImagesWebhook(address, satelliteImage, null);
        if (satelliteResult) successCount++;
        console.log("Satellite image send result:", satelliteResult ? "Success" : "Failed");
      }
      
      if (mapScreenshot) {
        console.log("Sending map screenshot...");
        const mapResult = await sendImagesWebhook(address, mapScreenshot, null);
        if (mapResult) successCount++;
        console.log("Map screenshot send result:", mapResult ? "Success" : "Failed");
      }
      
      if (successCount > 0) {
        toast({
          title: "Images Sent",
          description: `Sent ${successCount} property images to webhook`,
        });
        return true;
      } else {
        if (!streetViewImage && !satelliteImage && !mapScreenshot) {
          throw new Error("Failed to capture any images");
        } else {
          throw new Error("Failed to send images to webhook");
        }
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
