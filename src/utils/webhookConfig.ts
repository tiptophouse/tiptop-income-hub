
// Store webhook configuration
let webhookUrl: string | null = "https://hook.eu1.make.com/yun6n78dsjx2e9w3nejk569764ds1pv3";

export const setWebhookUrl = (url: string) => {
  webhookUrl = url;
  localStorage.setItem('property_webhook_url', url);
  return true;
};

export const getWebhookUrl = (): string | null => {
  return webhookUrl;
};
