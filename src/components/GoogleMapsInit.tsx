
import React, { useEffect, useState } from 'react';

interface GoogleMapsInitProps {
  apiKey?: string;
  children: React.ReactNode;
}

// Track if the API is already loaded globally
let isGoogleMapsLoaded = false;

const GoogleMapsInit: React.FC<GoogleMapsInitProps> = ({ 
  apiKey = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE",
  children 
}) => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsLoaded);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Skip if already loaded globally or an error occurred
    if (isGoogleMapsLoaded || window.google?.maps || hasError) {
      setIsLoaded(true);
      return;
    }
    
    // Check if the script is already being loaded by another instance
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Just wait for the existing script to load
      const checkExisting = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkExisting);
          isGoogleMapsLoaded = true;
          setIsLoaded(true);
        }
      }, 100);
      
      return () => clearInterval(checkExisting);
    }
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      isGoogleMapsLoaded = true;
      setIsLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Google Maps API:', error);
      setHasError(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount, as other components might be using it
      // This prevents reloading the API when components using it unmount and remount
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
