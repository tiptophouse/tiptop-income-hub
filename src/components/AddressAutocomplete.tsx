
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string) => void;
  value: string;
  onChange: (value: string) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  value,
  onChange
}) => {
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    
    // Clear any previous instances to prevent duplicates
    if (autocompleteRef.current) {
      if (window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
    }

    try {
      console.log('Initializing Google Places Autocomplete...');
      const options = {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      };

      // Create new autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // Add place_changed listener
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        console.log('Place selected:', place);
        if (place?.formatted_address) {
          onChange(place.formatted_address);
          onAddressSelect(place.formatted_address);
        }
      });

      setAutocompleteInitialized(true);
      console.log('Google Places Autocomplete initialized successfully');
      
      return () => {
        if (window.google?.maps?.event) {
          window.google.maps.event.removeListener(listener);
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  }, [onAddressSelect, onChange]); // Remove isMobile dependency to ensure it always initializes

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const detectedAddress = results[0].formatted_address;
              onChange(detectedAddress);
              onAddressSelect(detectedAddress);
              toast({
                title: "Location Found",
                description: `Your location: ${detectedAddress}`
              });
            } else {
              toast({
                title: "Location Error",
                description: "Could not determine your address.",
                variant: "destructive"
              });
            }
            setIsLocating(false);
          });
        } else {
          toast({
            title: "Maps API Not Loaded",
            description: "Please try entering your address manually.",
            variant: "destructive"
          });
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Error",
          description: "Could not access your location. Please check browser permissions.",
          variant: "destructive"
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onAddressSelect(value);
      }
    }
  };

  return (
    <div className="relative w-full" style={{ overflow: 'visible' }}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your property address..."
        className="pl-12 pr-28 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
        autoComplete="street-address"
        inputMode="text"
        spellCheck="false"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="p-1 h-9 w-9 rounded-full hover:bg-tiptop-accent/10"
          onClick={handleLocationDetection}
          disabled={isLocating}
        >
          {isLocating ? (
            <svg className="animate-spin h-4 w-4 text-tiptop-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MapPin className="h-4 w-4 text-tiptop-accent" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddressAutocomplete;
