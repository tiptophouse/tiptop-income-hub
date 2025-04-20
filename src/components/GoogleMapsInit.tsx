
import React, { useEffect, useState } from 'react';

interface GoogleMapsInitProps {
  apiKey?: string;
  children: React.ReactNode;
}

const GoogleMapsInit: React.FC<GoogleMapsInitProps> = ({ 
  apiKey = "AIzaSyBnSoqI0PTCuN0_1HGWvUgPLgGQnVnYcEY",
  children 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Skip if already loaded or an error occurred
    if (window.google?.maps || hasError) {
      setIsLoaded(true);
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      setIsLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Google Maps API:', error);
      setHasError(true);
    };
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [apiKey, hasError]);

  if (hasError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>Failed to load Google Maps. Please try again later.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tiptop-accent"></div>
        <span className="ml-2">Loading maps...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsInit;
