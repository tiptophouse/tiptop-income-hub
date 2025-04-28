
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { geocodeAddress, reverseGeocode, getCurrentLocation } from '@/utils/geocodingService';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useImageCapture } from '@/hooks/useImageCapture';

export const useLocationHandler = (
  setMapCenter: (location: { lat: number; lng: number }) => void,
  addRoofOverlay: (location: { lat: number; lng: number }) => void,
  mapRef: React.RefObject<HTMLDivElement>
) => {
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { loadPropertyData, setIsLoadingData } = usePropertyData();
  const { captureAndSendImages } = useImageCapture();

  const handleAddressGeocoding = async (address: string) => {
    setIsLoadingData(true);
    
    geocodeAddress({
      address,
      onSuccess: async (location) => {
        setMapCenter(location);
        addRoofOverlay(location);
        setCurrentLocation(location);
        
        // Capture and send images to webhook before loading property data
        await captureAndSendImages(address, mapRef);
        
        loadPropertyData(location);
      }
    });
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setIsLoadingData(true);
    
    getCurrentLocation(
      (userLocation) => {
        setMapCenter(userLocation);
        addRoofOverlay(userLocation);
        setCurrentLocation(userLocation);
        loadPropertyData(userLocation);
        
        reverseGeocode({
          location: userLocation,
          onSuccess: async (address) => {
            toast({
              title: "Location Found",
              description: `Your current location: ${address}`,
            });
            
            // Capture and send images to webhook
            await captureAndSendImages(address, mapRef);
            
            const addressEvent = new CustomEvent('addressFound', { 
              detail: { address } 
            });
            document.dispatchEvent(addressEvent);
          }
        });
        
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setIsLoadingData(false);
      }
    );
  };

  return {
    isLocating,
    currentLocation,
    handleAddressGeocoding,
    handleGetCurrentLocation
  };
};
