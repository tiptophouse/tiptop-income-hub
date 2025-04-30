
/**
 * Utilities for validating image formats
 */

// Check if image URL has a supported format
export const isValidImageFormat = (url: string | null): boolean => {
  if (!url) return false;
  
  const supportedFormats = ['png', 'jpeg', 'jpg', 'gif', 'webp'];
  const urlLower = url.toLowerCase();
  
  // Check if the URL ends with any of the supported formats
  return supportedFormats.some(format => 
    urlLower.includes(`.${format}`) || // Check file extension
    urlLower.includes(`format=${format}`) || // Check query param format
    urlLower.includes(`&maptype=`) // Special case for Google Maps static images which are always valid
  );
};
