
/**
 * Handles webhook URL storage and retrieval
 */

// Store the webhook URL in localStorage
export const setWebhookUrl = (url: string): void => {
  localStorage.setItem('webhook_url', url);
};

// Get the webhook URL from localStorage or use the provided default
export const getWebhookUrl = (): string => {
  return localStorage.getItem('webhook_url') || 'https://hook.eu1.make.com/cweboprf3sf4bjd66lobyzdt8d325b1v';
};
