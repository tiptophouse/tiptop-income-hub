import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { geocodeAddress, reverseGeocode, getCurrentLocation } from '@/utils/geocodingService';
import { fetchWeatherData } from '@/utils/weatherService';
import { analyzePropertyImage, PropertyAnalysisResult } from '@/utils/api/propertyAnalysis';
import LocationButton from '@/components/LocationButton';
import PropertyDetails from '@/components/PropertyDetails';
import ProfitAnalysis from '@/components/ProfitAnalysis';
import SolarInsightsCard from '@/components/SolarInsightsCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { getStreetViewImageAsBase64 } from '@/utils/streetViewService';
import { captureMapScreenshot,  } from '@/utils/streetViewService';
import { sendImagesWebhook } from '@/utils/webhookConfig';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysisResult | null>(null);
  const isMobile = useIsMobile();
  
  // Use our custom hook for Google Maps
  const { 
    map, 
    marker, 
    isLoaded, 
    setMapCenter, 
    addRoofOverlay, 
    createStreetView,
    propertyDetails
  } = useGoogleMap({
    mapRef
  });

  // Function to capture and send images to webhook
  const captureAndSendImages = async (location: { lat: number; lng: number }) => {
    try {
      // Get Street View image
      const streetViewImage = await getStreetViewImageAsBase64(address || '');
      
      // Get map screenshot
      const mapImage = mapRef.current ? await captureMapScreenshot(mapRef) : null;
      
      // Send both images to webhook
      await sendImagesWebhook(address || '', mapImage, streetViewImage);
      
      toast({
        title: "Images Sent",
        description: "Property views have been sent to your webhook",
      });
    } catch (error) {
      console.error("Error capturing and sending images:", error);
      toast({
        title: "Error",
        description: "Failed to send property views to webhook",
        variant: "destructive",
      });
    }
  };
  
  // Update map when address changes
  useEffect(() => {
    if (!isLoaded || !address) return;
    
    setIsLoadingData(true);
    
    geocodeAddress({
      address,
      onSuccess: async (location) => {
        setMapCenter(location);
        addRoofOverlay(location);
        setCurrentLocation(location);
        
        // Capture and send images when location is set
        await captureAndSendImages(location);
        
        // Get weather data
        fetchWeatherData({
          location,
          onSuccess: (data) => {
            setWeatherData(data);
            
            // Get property analysis data
            getPropertyAnalysis();
          },
          onError: () => setIsLoadingData(false)
        });
      }
    });
  }, [address, isLoaded, setMapCenter, addRoofOverlay]);

  // Get property analysis data
  const getPropertyAnalysis = async () => {
    try {
      // In a real app, you'd use actual image data
      const result = await analyzePropertyImage('dummy-image-data');
      setPropertyAnalysis(result);
      setIsLoadingData(false);
    } catch (error) {
      console.error("Error analyzing property:", error);
      setIsLoadingData(false);
    }
  };

  // Handle getting user's current location
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setIsLoadingData(true);
    
    getCurrentLocation(
      (userLocation) => {
        setMapCenter(userLocation);
        addRoofOverlay(userLocation);
        setCurrentLocation(userLocation);
        
        // Get weather data for the location
        fetchWeatherData({
          location: userLocation,
          onSuccess: (data) => {
            setWeatherData(data);
            
            // Get property analysis
            getPropertyAnalysis();
          },
          onError: () => setIsLoadingData(false)
        });
        
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
      () => {
        setIsLocating(false);
        setIsLoadingData(false);
      }
    );
  };

  return (
    <div className="w-full px-2 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="md:col-span-2">
          <div 
            ref={mapRef} 
            className={`w-full ${isMobile ? 'h-52' : 'h-80'} rounded-lg shadow-md border border-gray-200`}
            style={{ 
              opacity: isLoaded ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
          />
          {!isLoaded && (
            <div className="mt-2 text-center text-xs sm:text-sm text-gray-500">
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
        
        <div className="space-y-3 md:space-y-4">
          <PropertyDetails 
            location={currentLocation}
            propertyDetails={propertyDetails}
            createStreetView={createStreetView}
            weatherData={weatherData}
            isLoading={isLoadingData}
          />
          
          <ProfitAnalysis 
            propertyDetails={propertyDetails}
            weatherData={weatherData}
            isLoading={isLoadingData}
            propertyAnalysis={propertyAnalysis || undefined}
          />
        </div>
      </div>
      
      {propertyAnalysis && (
        <div className="mt-6">
          <SolarInsightsCard 
            propertyAnalysis={propertyAnalysis}
            isLoading={isLoadingData}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
