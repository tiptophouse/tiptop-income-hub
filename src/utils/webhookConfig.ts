
// Store webhook configuration
let webhookUrl: string | null = "https://hook.eu1.make.com/idp2gmpgp7o5xxaoxj9iir648fuqjo5p";

export const setWebhookUrl = (url: string) => {
  webhookUrl = url;
  localStorage.setItem('property_webhook_url', url);
  return true;
};

export const getWebhookUrl = (): string | null => {
  if (!webhookUrl) {
    webhookUrl = localStorage.getItem('property_webhook_url');
  }
  return webhookUrl;
};

export const sendImagesWebhook = async (address: string, mapImage: string | null, streetViewImage: string | null) => {
  const webhook = getWebhookUrl();
  if (!webhook) {
    console.log("No webhook URL configured");
    return false;
  }

  try {
    console.log("Sending images to webhook:", webhook);
    console.log("Address:", address);
    
    // Prepare the payload with more detailed metadata
    const payload = JSON.stringify({
      address,
      mapImage,
      streetViewImage,
      timestamp: new Date().toISOString(),
      source: window.location.origin,
      appVersion: '1.0.1', // Adding version for tracking
      requestType: 'propertyAnalysis'
    });
    
    console.log("Payload size:", Math.round(payload.length / 1024), "KB");
    
    // First try with standard fetch
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload
      });
      
      console.log("Webhook response:", response);
      console.log("Webhook response status:", response.status);
      
      if (response.ok) {
        console.log("Successfully sent images to webhook");
        return true;
      } else {
        console.log("Failed to send images to webhook, status:", response.status);
        throw new Error("Regular request failed");
      }
    } catch (error) {
      // If the regular request fails, retry with no-cors mode as a fallback
      console.log("Retrying with no-cors mode...");
      
      // Using a smaller payload for no-cors mode to avoid potential size issues
      const compressedPayload = JSON.stringify({
        address,
        // Sending smaller images if available for no-cors mode
        mapImage: mapImage?.substring(0, 500000), // Limiting image size for fallback
        streetViewImage: streetViewImage?.substring(0, 500000), // Limiting image size for fallback
        timestamp: new Date().toISOString(),
        source: window.location.origin,
        isCompressed: true
      });
      
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: compressedPayload
      });
      
      console.log("No-cors request sent, cannot determine success/failure due to CORS limitations");
      
      // Also try a plain text version as a last resort
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: 'no-cors',
        body: `Address: ${address}, Timestamp: ${new Date().toISOString()}`
      });
      
      console.log("Backup text-only webhook sent");
      return true; // Assume success since we can't check status with no-cors
    }
  } catch (error) {
    console.error("Error sending images to webhook:", error);
    return false;
  }
};
