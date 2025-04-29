
import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { usePropertyData } from '@/hooks/usePropertyData';
import PropertyDetails from '@/components/PropertyDetails';
import ProfitAnalysis from '@/components/ProfitAnalysis';
import SolarInsightsCard from '@/components/SolarInsightsCard';
import MapLayout from '@/components/map/MapLayout';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const { 
    map, 
    isLoaded, 
    setMapCenter, 
    addRoofOverlay, 
    createStreetView,
    propertyDetails
  } = useGoogleMap({
    mapRef,
    gestureHandling: 'cooperative', // Add cooperative gesture handling to require two-finger panning
  });

  const { weatherData, isLoadingData, propertyAnalysis } = usePropertyData();
  const { isLocating, currentLocation, handleAddressGeocoding, handleGetCurrentLocation } = 
    useLocationHandler(setMapCenter, addRoofOverlay, mapRef);

  useEffect(() => {
    if (!isLoaded || !address) return;
    handleAddressGeocoding(address);
  }, [address, isLoaded]);

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
