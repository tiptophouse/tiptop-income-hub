
// Store webhook configuration
let webhookUrl: string | null = null;

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
    await fetch(webhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        mapImage,
        streetViewImage,
        timestamp: new Date().toISOString(),
        source: window.location.origin
      })
    });
    
    console.log("Successfully sent images to webhook");
  } catch (error) {
    console.error("Error sending images to webhook:", error);
  }
};
