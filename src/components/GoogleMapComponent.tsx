
import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { geocodeAddress, reverseGeocode, getCurrentLocation } from '@/utils/geocodingService';
import { fetchWeatherData } from '@/utils/weatherService';
import LocationButton from '@/components/LocationButton';
import PropertyDetails from '@/components/PropertyDetails';
import ProfitAnalysis from '@/components/ProfitAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
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
  
  // Update map when address changes
  useEffect(() => {
    if (!isLoaded || !address) return;
    
    setIsLoadingData(true);
    
    geocodeAddress({
      address,
      onSuccess: (location) => {
        setMapCenter(location);
        addRoofOverlay(location);
        setCurrentLocation(location);
        
        // Get weather data
        fetchWeatherData({
          location,
          onSuccess: (data) => {
            setWeatherData(data);
            setIsLoadingData(false);
          },
          onError: () => setIsLoadingData(false)
        });
      }
    });
  }, [address, isLoaded, setMapCenter, addRoofOverlay]);

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
            setIsLoadingData(false);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div 
            ref={mapRef} 
            className={`w-full ${isMobile ? 'h-64' : 'h-80'} rounded-lg shadow-md border border-gray-200`}
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
        
        <div className="space-y-4">
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
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
