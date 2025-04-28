
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
    
    // Prepare the payload
    const payload = JSON.stringify({
      address,
      mapImage,
      streetViewImage,
      timestamp: new Date().toISOString(),
      source: window.location.origin
    });
    
    console.log("Payload size:", Math.round(payload.length / 1024), "KB");
    
    // Make.com requests can time out with very large payloads
    // Send a fetch request without using no-cors mode first to attempt a proper request
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
        // If the regular request fails, try with no-cors as a fallback
        throw new Error("Regular request failed");
      }
    } catch (error) {
      // If the regular request fails due to CORS, try again with no-cors
      console.log("Retrying with no-cors mode...");
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: payload
      });
      
      console.log("No-cors request sent, cannot determine success/failure due to CORS limitations");
      return true; // Assume success since we can't check status with no-cors
    }
  } catch (error) {
    console.error("Error sending images to webhook:", error);
    return false;
  }
};
