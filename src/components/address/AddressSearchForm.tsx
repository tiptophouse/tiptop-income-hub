
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import LocationDetectButton from './LocationDetectButton';
import AddressInput from './AddressInput';
import AnalyzeButton from './AnalyzeButton';

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
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);

  // Function to initialize Google Places Autocomplete
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places || autocompleteInitialized) return;
    
    try {
      console.log('Initializing Google Places Autocomplete in AddressSearchForm...');
      
      // Clear any previous instances
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry'],
        types: ['address']
      });
      
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        console.log('Place selected in AddressSearchForm:', place);
        if (place && place.formatted_address) {
          setAddress(place.formatted_address);
          setShowAnalysis(true);
          document.dispatchEvent(new CustomEvent('addressFound', { 
            detail: { address: place.formatted_address } 
          }));
        }
      });
      
      setAutocompleteInitialized(true);
      console.log('Google Places Autocomplete initialized successfully in AddressSearchForm');
      
      return () => {
        if (listener && window.google?.maps?.event) {
          window.google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete in AddressSearchForm:", error);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure Google Maps API is fully loaded
    const timer = setTimeout(() => {
      initializeAutocomplete();
    }, isMobile ? 1000 : 500);
    
    return () => {
      clearTimeout(timer);
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isMobile]); // Re-initialize when mobile status changes

  // Re-initialize when the component is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !autocompleteInitialized) {
        initializeAutocomplete();
      }
    }, { threshold: 0.1 });
    
    if (inputRef.current) {
      observer.observe(inputRef.current);
    }
    
    return () => {
      if (inputRef.current) {
        observer.unobserve(inputRef.current);
      }
    };
  }, [autocompleteInitialized]);

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
    document.dispatchEvent(new CustomEvent('addressFound', { detail: { address } }));
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const detectedAddress = results[0].formatted_address;
                setAddress(detectedAddress);
                toast({
                  title: "Location Detected",
                  description: `Your location: ${detectedAddress}`
                });
                setShowAnalysis(true);
                document.dispatchEvent(new CustomEvent('addressFound', {
                  detail: { address: detectedAddress }
                }));
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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
      style={{ overflow: 'visible' }}
    >
      <div className="relative" style={{ overflow: 'visible' }}>
        {isMobile ? (
          <div className="flex items-center gap-2" style={{ overflow: 'visible' }}>
            <LocationDetectButton 
              onClick={handleLocationDetection}
              isLocating={isLocating}
              isMobile={true}
            />
            <div className="relative flex-1" style={{ overflow: 'visible' }}>
              <AddressInput
                ref={inputRef}
                value={address}
                onChange={setAddress}
                isMobile={true}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <AnalyzeButton isMobile={true} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ overflow: 'visible' }}>
            <AddressInput
              ref={inputRef}
              value={address}
              onChange={setAddress}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <LocationDetectButton 
                onClick={handleLocationDetection}
                isLocating={isLocating}
              />
              <AnalyzeButton />
            </div>
          </div>
        )}
      </div>
    </motion.form>
  );
};

export default AddressSearchForm;
