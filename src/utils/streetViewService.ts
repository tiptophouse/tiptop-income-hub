
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
 * Gets Satellite image for an address as base64
 * Using zoom level 18 for optimal aerial view
 */
export const getSatelliteImageAsBase64 = async (address: string): Promise<string | null> => {
  try {
    console.log("Fetching Satellite image for:", address);
    
    // Create an image element to load the Satellite image
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
      img.onerror = () => reject(new Error("Failed to load Satellite image"));
      
      // Static map with satellite imagery - using zoom=18 for optimal aerial detail
      img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=600x400&maptype=satellite&key=AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE`;
    });
    
    // Set a timeout to avoid hanging if the image load takes too long
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Satellite image load timeout")), 10000);
    });
    
    const imageData = await Promise.race([imagePromise, timeoutPromise]);
    return imageData;
  } catch (error) {
    console.error("Error fetching Satellite image:", error);
    return null;
  }
};

/**
 * Captures property view images for 3D model generation
 * Captures both street view and satellite images (zoom level 12 and 18)
 */
export const captureStreetViewForModel = async (address: string): Promise<{streetView: string | null, satellite: string | null, aerialView: string | null}> => {
  try {
    console.log("Capturing property views for:", address);
    
    // Try to get both Street View and Satellite images in parallel
    const [streetViewImage, satelliteImage] = await Promise.allSettled([
      getStreetViewImageAsBase64(address),
      getSatelliteImageAsBase64(address)
    ]);
    
    // Get aerial view with zoom level 12 for wider context
    const aerialViewPromise = new Promise<string | null>(async (resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 0.9));
          } else {
            resolve(null);
          }
        };
        
        img.onerror = () => resolve(null);
        img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=12&size=600x400&maptype=satellite&key=AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE`;
        
        setTimeout(() => resolve(null), 10000); // Timeout after 10 seconds
      } catch (error) {
        console.error("Error capturing aerial view:", error);
        resolve(null);
      }
    });
    
    const aerialView = await aerialViewPromise;
    
    // Return all captured images
    return {
      streetView: streetViewImage.status === 'fulfilled' ? streetViewImage.value : null,
      satellite: satelliteImage.status === 'fulfilled' ? satelliteImage.value : null,
      aerialView: aerialView
    };
  } catch (error) {
    console.error("Error capturing views for model:", error);
    return {
      streetView: null,
      satellite: null,
      aerialView: null
    };
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

