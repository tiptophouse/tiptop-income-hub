
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationButtonProps {
  onClick: () => void;
  isLocating: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onClick, isLocating }) => {
  const isMobile = useIsMobile();
  
  return (
    <button 
      onClick={onClick} 
      disabled={isLocating}
      className={`mt-2 px-3 py-1.5 bg-tiptop-accent text-white rounded-md text-sm flex items-center justify-center hover:bg-tiptop-accent/90 transition-colors duration-200 w-full ${isMobile ? 'text-xs py-1' : ''}`}
    >
      {isLocating ? (
        <>
          <svg className={`animate-spin -ml-1 mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isMobile ? 'Finding...' : 'Locating...'}
        </>
      ) : (
        <>
          <svg className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {isMobile ? 'Use Location' : 'Use My Current Location'}
        </>
      )}
    </button>
  );
};

export default LocationButton;
