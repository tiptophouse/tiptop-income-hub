
import React, { useEffect } from 'react';

const ModelViewerScript: React.FC = () => {
  useEffect(() => {
    // Add script tag for model-viewer if not already present
    if (!document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]')) {
      console.log("Loading model-viewer script");
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.type = 'module';
      script.onload = () => {
        console.log("model-viewer script loaded successfully");
      };
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default ModelViewerScript;
