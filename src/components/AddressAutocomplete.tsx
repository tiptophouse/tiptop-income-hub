
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

  useEffect(() => {
    // Exit early if no input element, no google maps API, or autocomplete already initialized
    if (!inputRef.current || !window.google?.maps?.places || autocompleteInitialized) return;
    
    console.log("Initializing Google Places Autocomplete");
    
    // Add a delay for mobile devices to ensure the DOM is fully rendered
    const delay = isMobile ? 500 : 100;
    
    const timer = setTimeout(() => {
      try {
        const options = {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        };

        // Create a new autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );
        
        // Add a listener for when a place is selected
        const listener = autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place?.formatted_address) {
            console.log("Place selected:", place.formatted_address);
            onAddressSelect(place.formatted_address);
          }
        });
        
        // Mark as initialized to prevent duplicate initialization
        setAutocompleteInitialized(true);
        console.log("Google Places Autocomplete initialized successfully");
        
        // Return cleanup function
        return () => {
          if (listener && window.google?.maps?.event) {
            window.google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
        toast({
          title: "Address Search Error",
          description: "Failed to initialize address search. Please try entering your address manually.",
          variant: "destructive"
        });
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [onAddressSelect, isMobile, autocompleteInitialized]);

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
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
              } else {
                toast({
                  title: "Location Error",
                  description: "Unable to determine your address.",
                  variant: "destructive"
                });
              }
            });
          } else {
            toast({
              title: "Maps API Not Loaded",
              description: "Please try entering your address manually.",
              variant: "destructive"
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please check your browser permissions.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
    }
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
        >
          <MapPin className="h-4 w-4 text-tiptop-accent" />
        </Button>
      </div>
    </div>
  );
};

export default AddressAutocomplete;
