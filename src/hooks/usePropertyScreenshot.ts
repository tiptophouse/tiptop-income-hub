
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import { getWebhookUrl } from '@/utils/webhookConfig';

interface UsePropertyScreenshotProps {
  address: string;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

export const usePropertyScreenshot = ({ address, mapContainerRef }: UsePropertyScreenshotProps) => {
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const screenshotCaptured = useRef(false);

  const captureAndSendPropertyScreenshot = async () => {
    if (!mapContainerRef.current || isCapturingScreenshot) return;
    
    try {
      setIsCapturingScreenshot(true);
      console.log("Capturing property screenshot...");
      
      const webhookUrl = getWebhookUrl();
      if (!webhookUrl) {
        console.log("No webhook URL configured");
        return;
      }
      
      const canvas = await html2canvas(mapContainerRef.current);
      const imageData = canvas.toDataURL('image/png');
      
      console.log("Sending property screenshot to webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: address,
          image: imageData,
          timestamp: new Date().toISOString(),
          source: "TipTop Property Analysis"
        }),
        mode: "no-cors"
      });
      
      console.log("Property screenshot sent to webhook successfully");
      
      toast({
        title: "Property Captured",
        description: "Property screenshot has been sent for 3D model generation",
      });
      
      screenshotCaptured.current = true;
    } catch (error) {
      console.error("Error sending property screenshot to webhook:", error);
      toast({
        title: "Screenshot Error",
        description: "Failed to capture or send property screenshot",
        variant: "destructive"
      });
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  return {
    isCapturingScreenshot,
    screenshotCaptured: screenshotCaptured.current,
    captureAndSendPropertyScreenshot
  };
};
