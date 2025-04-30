
import { useRef, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

export function useAddressAutocomplete(inputRef: React.RefObject<HTMLInputElement>, setAddress: (address: string) => void, setShowAnalysis: (show: boolean) => void) {
  const autocompleteRef = useRef<any>(null);
  const isMobile = useIsMobile();
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places || autocompleteInitialized) return;
    
    try {
      console.log('Initializing Google Places Autocomplete...');
      
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
        console.log('Place selected:', place);
        if (place && place.formatted_address) {
          setAddress(place.formatted_address);
          setShowAnalysis(true);
          document.dispatchEvent(new CustomEvent('addressFound', { 
            detail: { address: place.formatted_address } 
          }));
        }
      });
      
      setAutocompleteInitialized(true);
      console.log('Google Places Autocomplete initialized successfully');
      
      return () => {
        if (listener && window.google?.maps?.event) {
          window.google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
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
  }, [isMobile, setAddress, setShowAnalysis]);

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
  }, [autocompleteInitialized, setAddress, setShowAnalysis]);

  return { autocompleteInitialized };
}
