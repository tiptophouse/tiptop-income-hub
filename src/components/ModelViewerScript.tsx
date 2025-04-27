
import React, { useEffect, useState } from 'react';

const ModelViewerScript: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]');
    
    if (existingScript) {
      console.log("model-viewer script already loaded");
      setIsLoaded(true);
      return;
    }
    
    // Add script tag for model-viewer if not already present
    console.log("Loading model-viewer script");
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    
    script.onload = () => {
      console.log("model-viewer script loaded successfully");
      setIsLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error("Error loading model-viewer script:", error);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // No need to remove the script when component unmounts
      // as it should persist for the entire app lifecycle
    };
  }, []);

  return null;
};

export default ModelViewerScript;
