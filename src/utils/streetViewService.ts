
import html2canvas from 'html2canvas';

/**
 * Gets Street View image for an address as base64
 */
export const getStreetViewImageAsBase64 = async (address: string): Promise<string | null> => {
  try {
    console.log("Fetching Street View image for:", address);
    
    // Create an image element to load the Street View image
    const img = new Image();
    const imagePromise = new Promise<string>((resolve, reject) => {
      img.crossOrigin = "Anonymous"; // Allow cross-origin image loading
      img.onload = () => {
        // Check if the image is the default "no image" from Google
        // This is a heuristic - if image is too small or appears gray
        if (img.width <= 1 || img.height <= 1) {
          console.log("Received invalid Street View image (too small)");
          reject(new Error("No Street View available"));
          return;
        }
        
        // Create a canvas and draw the image on it
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Convert the canvas to base64 data URL
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          console.log("Street View image captured successfully, size:", dataUrl.length);
          resolve(dataUrl);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = (e) => {
        console.error("Error loading Street View image:", e);
        reject(new Error("Failed to load Street View image"));
      };
      
      // Set the image source after defining the onload handler
      const apiKey = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE"; // Using the existing API key
      img.src = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encodeURIComponent(address)}&key=${apiKey}`;
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
        // Check if the image is valid
        if (img.width <= 1 || img.height <= 1) {
          console.log("Received invalid Satellite image (too small)");
          reject(new Error("No Satellite view available"));
          return;
        }
        
        // Create a canvas and draw the image on it
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Convert the canvas to base64 data URL
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          console.log("Satellite image captured successfully, size:", dataUrl.length);
          resolve(dataUrl);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = (e) => {
        console.error("Error loading Satellite image:", e);
        reject(new Error("Failed to load Satellite image"));
      };
      
      // Static map with satellite imagery - using zoom=19 for better aerial detail
      const apiKey = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE"; // Using the existing API key
      img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=19&size=800x600&maptype=satellite&key=${apiKey}`;
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
    const [streetViewPromise, satellitePromise] = [
      getStreetViewImageAsBase64(address),
      getSatelliteImageAsBase64(address)
    ];
    
    // Wait for both to complete, but handle errors individually
    const streetViewResult = await streetViewPromise.catch(err => {
      console.error("Street view capture failed:", err);
      return null;
    });
    
    const satelliteResult = await satellitePromise.catch(err => {
      console.error("Satellite view capture failed:", err);
      return null;
    });
    
    // Get aerial view with zoom level 12 for wider context
    let aerialView: string | null = null;
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      const aerialPromise = new Promise<string>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 0.9));
          } else {
            reject(new Error("Failed to get canvas context"));
          }
        };
        
        img.onerror = (e) => {
          console.error("Error loading aerial view:", e);
          reject(new Error("Failed to load aerial view"));
        };
        
        const apiKey = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE"; // Using the existing API key
        img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=16&size=800x600&maptype=satellite&key=${apiKey}`;
      });
      
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error("Aerial view load timeout")), 10000);
      });
      
      aerialView = await Promise.race([aerialPromise, timeoutPromise]);
      console.log("Aerial view captured successfully");
    } catch (error) {
      console.error("Error capturing aerial view:", error);
      aerialView = null;
    }
    
    console.log("Image capture results:", {
      streetView: streetViewResult ? "✓" : "✗",
      satellite: satelliteResult ? "✓" : "✗",
      aerialView: aerialView ? "✓" : "✗"
    });
    
    // Return all captured images
    return {
      streetView: streetViewResult,
      satellite: satelliteResult,
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
    
    const canvas = await html2canvas(mapContainerRef.current, {
      useCORS: true,
      allowTaint: true,
      logging: true
    });
    
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    console.log("Map screenshot captured successfully, size:", imageData.length);
    return imageData;
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
    return null;
  }
};
