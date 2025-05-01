
import html2canvas from 'html2canvas';

/**
 * Converts a Blob to base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Captures a screenshot of a map container element
 * @param mapElement Can be either a React ref object or a direct HTMLDivElement
 */
export const captureMapScreenshot = async (
  mapElement: React.RefObject<HTMLDivElement> | HTMLDivElement
): Promise<string | null> => {
  try {
    // Check if it's a ref object or direct element
    const element = 'current' in mapElement ? mapElement.current : mapElement;
    
    if (!element) {
      console.error("Map container not found");
      return null;
    }
    
    const canvas = await html2canvas(element);
    const base64 = canvas.toDataURL('image/png');
    return base64;
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
    return null;
  }
};
