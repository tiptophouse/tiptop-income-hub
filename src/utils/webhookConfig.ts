
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
    
    // Use fetch with no-cors mode for cross-origin requests
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });
    
    console.log("Webhook response status:", response.status || "No status (likely due to CORS)");
    
    if (response.ok) {
      console.log("Successfully sent images to webhook");
      return true;
    } else {
      console.log("Failed to send images to webhook, status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error sending images to webhook:", error);
    return false;
  }
};
