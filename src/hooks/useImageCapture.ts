
import { toast } from '@/components/ui/use-toast';
import { getStreetViewImageAsBase64, captureMapScreenshot } from '@/utils/streetViewService';
import { sendImagesWebhook } from '@/utils/webhookConfig';

export const useImageCapture = () => {
  const captureAndSendImages = async (address: string, mapRef: React.RefObject<HTMLDivElement>) => {
    try {
      const streetViewImage = await getStreetViewImageAsBase64(address);
      const mapImage = mapRef.current ? await captureMapScreenshot(mapRef) : null;
      
      await sendImagesWebhook(address, mapImage, streetViewImage);
      
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
