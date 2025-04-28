
import React, { useEffect, useRef } from 'react';
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
            <LocationDetectButton 
              onClick={handleLocationDetection}
              isLocating={isLocating}
              isMobile={true}
            />
            <div className="relative flex-1">
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
          <div className="relative">
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
