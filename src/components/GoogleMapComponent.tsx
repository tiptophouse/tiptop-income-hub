
import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { geocodeAddress, reverseGeocode, getCurrentLocation } from '@/utils/geocodingService';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useImageCapture } from '@/hooks/useImageCapture';
import PropertyDetails from '@/components/PropertyDetails';
import ProfitAnalysis from '@/components/ProfitAnalysis';
import SolarInsightsCard from '@/components/SolarInsightsCard';
import MapLayout from '@/components/map/MapLayout';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const { weatherData, isLoadingData, propertyAnalysis, loadPropertyData, setIsLoadingData } = usePropertyData();
  const { captureAndSendImages } = useImageCapture();
  
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

  useEffect(() => {
    if (!isLoaded || !address) return;
    
    setIsLoadingData(true);
    
    geocodeAddress({
      address,
      onSuccess: async (location) => {
        setMapCenter(location);
        addRoofOverlay(location);
        setCurrentLocation(location);
        await captureAndSendImages(address, mapRef);
        loadPropertyData(location);
      }
    });
  }, [address, isLoaded, setMapCenter, addRoofOverlay]);

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
          onSuccess: (address) => {
            toast({
              title: "Location Found",
              description: `Your current location: ${address}`,
            });
            
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
        <MapLayout
          mapRef={mapRef}
          isLoaded={isLoaded}
          onGetLocation={handleGetCurrentLocation}
          isLocating={isLocating}
        />
        
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
