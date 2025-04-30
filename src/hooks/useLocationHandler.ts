
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
        
        // First capture and send images to Make.com webhook - this is important to do before loading property data
        console.log("Capturing and sending images for address:", address);
        try {
          const imageResult = await captureAndSendImages(address, mapRef);
          console.log("Image capture and send result to Make.com:", imageResult ? "Success" : "Failed");
        } catch (err) {
          console.error("Error during image capture and send to Make.com:", err);
        }
        console.log("Finished capturing and sending images to Make.com");
        
        // Then load property data
        loadPropertyData(location);
      },
      onError: (error) => {
        console.error("Geocoding error:", error);
        toast({
          title: "Address Error",
          description: "Could not find this address. Please try a different one.",
          variant: "destructive"
        });
        setIsLoadingData(false);
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
            
            // Capture and send images to Make.com webhook
            console.log("Capturing and sending images for detected location to Make.com:", address);
            try {
              const imageResult = await captureAndSendImages(address, mapRef);
              console.log("Image capture and send result for current location to Make.com:", imageResult ? "Success" : "Failed");
            } catch (err) {
              console.error("Error during image capture and send for current location to Make.com:", err);
            }
            console.log("Finished capturing and sending images for detected location to Make.com");
            
            const addressEvent = new CustomEvent('addressFound', { 
              detail: { address } 
            });
            document.dispatchEvent(addressEvent);
          },
          onError: (error) => {
            console.error("Reverse geocoding error:", error);
            toast({
              title: "Location Error",
              description: "Could not determine your address.",
              variant: "destructive"
            });
            setIsLoadingData(false);
          }
        });
        
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Error",
          description: "Could not access your location. Please check browser permissions.",
          variant: "destructive"
        });
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
