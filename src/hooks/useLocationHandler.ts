
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
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid address to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Geocoding address:", address);
    setIsLoadingData(true);
    
    geocodeAddress({
      address,
      onSuccess: async (location) => {
        console.log("Successfully geocoded address to location:", location);
        setMapCenter(location);
        addRoofOverlay(location);
        setCurrentLocation(location);
        
        // First capture and send images to webhook
        console.log("Capturing and sending images for address:", address);
        try {
          const imageResult = await captureAndSendImages(address, mapRef);
          console.log("Image capture and send result:", imageResult ? "Success" : "Failed");
        } catch (err) {
          console.error("Error during image capture and send:", err);
        }
        console.log("Finished capturing and sending images");
        
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
    console.log("Getting current location...");
    
    getCurrentLocation(
      (userLocation) => {
        console.log("Current location detected:", userLocation);
        setMapCenter(userLocation);
        addRoofOverlay(userLocation);
        setCurrentLocation(userLocation);
        loadPropertyData(userLocation);
        
        reverseGeocode({
          location: userLocation,
          onSuccess: async (address) => {
            console.log("Reverse geocoded to address:", address);
            toast({
              title: "Location Found",
              description: `Your current location: ${address}`,
            });
            
            // Capture and send images to webhook
            console.log("Capturing and sending images for detected location:", address);
            try {
              const imageResult = await captureAndSendImages(address, mapRef);
              console.log("Image capture and send result for current location:", imageResult ? "Success" : "Failed");
            } catch (err) {
              console.error("Error during image capture and send for current location:", err);
            }
            console.log("Finished capturing and sending images for detected location");
            
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
