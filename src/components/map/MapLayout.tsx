
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LocationButton from '@/components/LocationButton';

interface MapLayoutProps {
  mapRef: React.RefObject<HTMLDivElement>;
  isLoaded: boolean;
  onGetLocation: () => void;
  isLocating: boolean;
}

const MapLayout: React.FC<MapLayoutProps> = ({
  mapRef,
  isLoaded,
  onGetLocation,
  isLocating,
}) => {
  const isMobile = useIsMobile();

  return (
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
          onClick={onGetLocation} 
          isLocating={isLocating} 
        />
      )}
    </div>
  );
};

export default MapLayout;
