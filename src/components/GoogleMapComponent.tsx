
import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { geocodeAddress, reverseGeocode, getCurrentLocation } from '@/utils/geocodingService';
import LocationButton from '@/components/LocationButton';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Use our custom hook for Google Maps
  const { map, marker, isLoaded, setMapCenter, addRoofOverlay } = useGoogleMap({
    mapRef
  });
  
  // Update map when address changes
  useEffect(() => {
    if (!isLoaded || !address) return;
    
    geocodeAddress({
      address,
      onSuccess: (location) => {
        setMapCenter(location);
        addRoofOverlay(location);
      }
    });
  }, [address, isLoaded, setMapCenter, addRoofOverlay]);

  // Handle getting user's current location
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    
    getCurrentLocation(
      (userLocation) => {
        setMapCenter(userLocation);
        addRoofOverlay(userLocation);
        
        // Reverse geocode to get address
        reverseGeocode({
          location: userLocation,
          onSuccess: (address) => {
            toast({
              title: "Location Found",
              description: `Your current location: ${address}`,
            });
            
            // Dispatch a custom event with the address for other components to use
            const addressEvent = new CustomEvent('addressFound', { 
              detail: { address } 
            });
            document.dispatchEvent(addressEvent);
          }
        });
        
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full h-80 rounded-lg shadow-md border border-gray-200"
        style={{ 
          opacity: isLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!isLoaded && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Loading map...
        </div>
      )}
      {isLoaded && (
        <LocationButton 
          onClick={handleGetCurrentLocation} 
          isLocating={isLocating} 
        />
      )}
    </div>
  );
};

export default GoogleMapComponent;
