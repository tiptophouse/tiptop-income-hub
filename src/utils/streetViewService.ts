
import html2canvas from 'html2canvas';

/**
 * Gets Street View image for an address as base64
 */
export const getStreetViewImageAsBase64 = async (address: string): Promise<string | null> => {
  try {
    console.log("Fetching Street View image from:", `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(address)}&key=AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE`);
    
    // Create an image element to load the Street View image
    const img = new Image();
    const imagePromise = new Promise<string>((resolve, reject) => {
      img.crossOrigin = "Anonymous"; // Allow cross-origin image loading
      img.onload = () => {
        // Create a canvas and draw the image on it
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Convert the canvas to base64 data URL
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = () => reject(new Error("Failed to load Street View image"));
      
      // Set the image source after defining the onload handler
      img.src = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(address)}&key=AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE`;
    });
    
    // Set a timeout to avoid hanging if the image load takes too long
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Street View image load timeout")), 10000);
    });
    
    const imageData = await Promise.race([imagePromise, timeoutPromise]);
    return imageData;
  } catch (error) {
    console.error("Error fetching Street View image:", error);
    return null;
  }
};

/**
 * Captures a Street View image for 3D model generation
 */
export const captureStreetViewForModel = async (address: string): Promise<string | null> => {
  try {
    console.log("Capturing Street View image for:", address);
    
    // Try to get the Street View image
    const imageData = await getStreetViewImageAsBase64(address);
    
    if (!imageData) {
      console.error("No Street View image available for this address");
      return null;
    }
    
    console.log("Successfully captured Street View image");
    return imageData;
  } catch (error) {
    console.error("Error capturing Street View for model:", error);
    return null;
  }
};

/**
 * Captures a map screenshot from a map container element
 */
export const captureMapScreenshot = async (mapContainerRef: React.RefObject<HTMLElement>): Promise<string | null> => {
  try {
    console.log("Capturing map screenshot...");
    if (!mapContainerRef.current) {
      throw new Error("Map container not found");
    }
    
    const canvas = await html2canvas(mapContainerRef.current);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    console.log("Map screenshot captured successfully");
    return imageData;
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
    return null;
  }
};
