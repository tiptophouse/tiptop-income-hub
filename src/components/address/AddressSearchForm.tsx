import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddressSearchFormProps {
  address: string;
  setAddress: (address: string) => void;
  isLocating: boolean;
  setIsLocating: (isLocating: boolean) => void;
  setShowAnalysis: (show: boolean) => void;
}

const AddressSearchForm = ({
  address,
  setAddress,
  isLocating,
  setIsLocating,
  setShowAnalysis
}: AddressSearchFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const isMobile = useIsMobile();

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'us' }
    });
    
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);
        setShowAnalysis(true);
      }
    });
    
    return () => {
      if (listener && window.google?.maps?.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [setAddress, setShowAnalysis]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }

    setShowAnalysis(true);

    const addressEvent = new CustomEvent('addressFound', {
      detail: { address }
    });
    document.dispatchEvent(addressEvent);
  };

  const handleLocationDetection = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({
              location: latlng
            }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const detectedAddress = results[0].formatted_address;
                setAddress(detectedAddress);
                toast({
                  title: "Location Detected",
                  description: `Your location: ${detectedAddress}`
                });
                setShowAnalysis(true);
                const addressEvent = new CustomEvent('addressFound', {
                  detail: {
                    address: detectedAddress
                  }
                });
                document.dispatchEvent(addressEvent);
              } else {
                toast({
                  title: "Location Error",
                  description: "Unable to determine your address.",
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
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please check your browser permissions.",
            variant: "destructive"
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  };

  return (
    <motion.form 
      className="w-full max-w-xl mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      onSubmit={handleSearch}
    >
      <div className="relative">
        {isMobile ? (
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="shrink-0 h-12 w-12 rounded-full hover:bg-tiptop-accent/10"
              onClick={handleLocationDetection}
              disabled={isLocating}
            >
              {isLocating ? (
                <svg className="animate-spin h-5 w-5 text-tiptop-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <MapPin className="h-5 w-5 text-tiptop-accent" />
              )}
            </Button>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input 
                ref={inputRef}
                type="text" 
                placeholder="Enter your property address..." 
                className="pl-10 pr-24 py-6 w-full rounded-full text-base shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-tiptop-accent hover:bg-tiptop-accent/90 px-4 py-2 h-auto rounded-full text-xs font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-[#FFFDED] whitespace-nowrap"
              >
                Analyze
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              ref={inputRef}
              type="text" 
              placeholder="Enter your property address..." 
              className="pl-12 pr-32 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <MapPin className="h-4 w-4 text-tiptop-accent" />
                )}
              </Button>
              <Button 
                type="submit" 
                className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-4 sm:px-6 py-3 h-auto rounded-full text-xs sm:text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-[#FFFDED] font-fahkwang whitespace-nowrap"
              >
                Analyze Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.form>
  );
};

export default AddressSearchForm;
