
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
    return;
  }

  try {
    console.log("Sending images to webhook for address:", address);
    console.log("Webhook URL:", webhook);
    
    const payload = JSON.stringify({
      address,
      mapImage,
      streetViewImage,
      timestamp: new Date().toISOString(),
      source: window.location.origin
    });
    
    console.log("Payload size:", Math.round(payload.length / 1024), "KB");
    
    const response = await fetch(webhook, {
      method: 'POST',
      mode: 'no-cors', // This is essential for cross-origin webhook calls
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });
    
    console.log("Webhook request sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending images to webhook:", error);
    return false;
  }
};
