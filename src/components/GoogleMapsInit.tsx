
import React, { useEffect, useState } from 'react';
import { getGoogleMapsApiKey } from '../utils/api/meshyConfig';
import { toast } from './ui/use-toast';

interface GoogleMapsInitProps {
  children: React.ReactNode;
}

const GoogleMapsInit: React.FC<GoogleMapsInitProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Check if the Google Maps API is already loaded
    if (window.google?.maps) {
      console.info('Google Maps API already loaded');
      setIsLoaded(true);
      return;
    }

    const loadGoogleMapsAPI = async () => {
      try {
        // Get API key from config or environment
        const apiKey = await getGoogleMapsApiKey();

        // Create the script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=googleMapsCallback`;
        script.async = true;
        script.defer = true;

        // Define the callback function
        window.googleMapsCallback = () => {
          console.info('Google Maps API loaded successfully');
          setIsLoaded(true);
        };

        // Handle errors
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setIsError(true);
          toast({
            title: "Maps Error",
            description: "Failed to load Google Maps. Some features may not work correctly.",
            variant: "destructive",
          });
        };

        // Add the script to the document
        document.head.appendChild(script);

        // Clean up
        return () => {
          if (window.googleMapsCallback) {
            delete window.googleMapsCallback;
          }
        };
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
        setIsError(true);
        toast({
          title: "Maps Error",
          description: "Failed to load Google Maps. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };

    loadGoogleMapsAPI();
  }, []);

  // If there was an error loading the API, still render children
  // but internal components should handle missing Google Maps gracefully
  if (isError) {
    console.warn('Rendering with Google Maps API unavailable');
  }

  // Always render children - components that need Google Maps should check for its availability
  return <>{children}</>;
};

// Add the type definition to the Window interface
declare global {
  interface Window {
    googleMapsCallback?: () => void;
  }
}

export default GoogleMapsInit;
