
import React, { useEffect } from 'react';

const ModelViewerScript: React.FC = () => {
  useEffect(() => {
    // Add script tag for model-viewer if not already present
    if (!document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.type = 'module';
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default ModelViewerScript;
