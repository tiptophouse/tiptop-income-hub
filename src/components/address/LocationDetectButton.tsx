
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationDetectButtonProps {
  onClick: () => void;
  isLocating: boolean;
  isMobile?: boolean;
}

const LocationDetectButton: React.FC<LocationDetectButtonProps> = ({ 
  onClick, 
  isLocating,
  isMobile = false 
}) => {
  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="icon" 
      className={`${isMobile ? 'h-12 w-12' : 'p-1 h-9 w-9'} rounded-full hover:bg-tiptop-accent/10`}
      onClick={onClick}
      disabled={isLocating}
    >
      {isLocating ? (
        <svg className={`animate-spin ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-tiptop-accent`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <MapPin className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-tiptop-accent`} />
      )}
    </Button>
  );
};

export default LocationDetectButton;
