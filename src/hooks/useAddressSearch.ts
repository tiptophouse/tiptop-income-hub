
import { FormEvent } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sendAddressToWebhook } from '@/utils/webhookConfig';

export const useAddressSearch = (
  address: string,
  setAddress: (value: string) => void,
  setIsLocating: (value: boolean) => void,
  setShowAnalysis: (value: boolean) => void
) => {
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a property address to analyze",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processing",
      description: "Sending address to webhook and waiting for response...",
    });
    
    // Send to webhook including images - wait for actual webhook response
    const result = await sendAddressToWebhook(address);
    if (result) {
      console.log("Address analysis webhook completed successfully");
      
      toast({
        title: "Analysis Started",
        description: "Property data sent for analysis. Waiting for webhook response...",
      });
      
      // Only show analysis when we get confirmation back
      setShowAnalysis(true);
    } else {
      console.warn("Address analysis webhook had issues");
      toast({
        title: "Error",
        description: "Unable to process address. Please try again.",
        variant: "destructive"
      });
      // Don't show analysis if webhook failed
      setShowAnalysis(false);
    }
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Convert the coordinates to an address
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          geocoder.geocode({ location: latlng }, async (results, status) => {
            setIsLocating(false);
            
            if (status === "OK" && results && results[0]) {
              const detectedAddress = results[0].formatted_address;
              setAddress(detectedAddress);
              
              toast({
                title: "Location Detected",
                description: `Found your location: ${detectedAddress}`,
              });
            } else {
              toast({
                title: "Location Error",
                description: "Could not determine your address from location",
                variant: "destructive"
              });
            }
          });
        },
        (error) => {
          setIsLocating(false);
          
          let errorMessage = "Location access denied. Please enable location permissions.";
          if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out. Please try again.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information is unavailable.";
          }
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive"
      });
    }
  };

  return { handleSearch, handleLocationDetection };
};
