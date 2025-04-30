
import React, { useRef, useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { sendAddressToWebhook } from '@/utils/webhookConfig';

interface AssetSearchInputProps {
  address: string;
  isLocating: boolean;
  onAddressChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDetectLocation: () => void;
}

const AssetSearchInput: React.FC<AssetSearchInputProps> = ({
  address,
  isLocating,
  onAddressChange,
  onSubmit,
  onDetectLocation,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const isMobile = useIsMobile();
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);

  // Modified submit handler to send address to webhook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }

    // Send address to webhook before calling the original onSubmit
    await sendAddressToWebhook(address);
    
    // Call the original onSubmit function
    onSubmit(e);
  };

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places || autocompleteInitialized) return;
    
    // Add a small delay for mobile devices
    const delay = isMobile ? 1000 : 500;
    
    const timer = setTimeout(() => {
      try {
        console.log('Initializing Google Places Autocomplete in AssetSearchInput...');
        
        // Clear any previous instances
        if (autocompleteRef.current && window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
        
        const options = {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        };

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        const listener = autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          console.log('Place selected in AssetSearchInput:', place);
          if (place?.formatted_address) {
            onAddressChange(place.formatted_address);
          }
        });

        setAutocompleteInitialized(true);
        console.log('Google Places Autocomplete initialized successfully in AssetSearchInput');
        
        return () => {
          if (listener && window.google?.maps?.event) {
            window.google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
        toast({
          title: "Autocomplete Error",
          description: "Could not initialize address search. Please try typing your address manually.",
          variant: "destructive"
        });
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [onAddressChange, isMobile, autocompleteInitialized]);

  return (
    <motion.form 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      onSubmit={handleSubmit}
      style={{ overflow: 'visible' }}
    >
      <div className="relative" style={{ overflow: 'visible' }}>
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          ref={inputRef}
          type="text" 
          placeholder="Enter your property address..." 
          className="pl-12 pr-28 py-5 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/95 backdrop-blur-sm focus:ring-4 focus:ring-[#9b87f5]/50 transition-all duration-300 placeholder:text-gray-400"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          aria-label="Property address"
          autoComplete="street-address"
          spellCheck="false"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="p-1 h-9 w-9 rounded-full hover:bg-[#9b87f5]/10 text-[#9b87f5]"
            onClick={onDetectLocation}
            disabled={isLocating}
            aria-label="Detect current location"
          >
            {isLocating ? (
              <svg className="animate-spin h-4 w-4 text-[#9b87f5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <MapPin className="h-4 w-4 text-[#9b87f5]" />
            )}
          </Button>
          <Button 
            type="submit" 
            className="bg-[#9b87f5] hover:bg-[#8B5CF6] px-4 sm:px-6 py-3 h-auto rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl text-white whitespace-nowrap"
            aria-label="Analyze address"
          >
            Analyze Now
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default AssetSearchInput;
