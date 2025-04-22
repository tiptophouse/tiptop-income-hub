import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import GoogleMapsInit from './GoogleMapsInit';
import PropertyMap from './PropertyMap';
import PropertyInsights from './PropertyInsights';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const handleAddressFound = (e: CustomEvent<{ address: string }>) => {
      setAddress(e.detail.address);
      setShowAnalysis(true);
    };
    
    document.addEventListener('addressFound', handleAddressFound as EventListener);
    return () => {
      document.removeEventListener('addressFound', handleAddressFound as EventListener);
    };
  }, []);

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
                setTimeout(() => {
                  const formElement = document.getElementById('asset-form');
                  if (formElement) {
                    formElement.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }
                }, 1500);
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
    <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-poppins"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Discover Your Property's 
          <span className="block">Earning Potential</span>
        </motion.h1>
        
        <motion.form 
          className="w-full max-w-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onSubmit={handleSearch}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Enter your property address..." 
              className="pl-12 pr-28 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
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
              <Button type="submit" className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-6 py-3 h-auto rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-gray-900">
                Analyze Now
              </Button>
            </div>
          </div>
        </motion.form>
        
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              key="analysis-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-6"
            >
              <div className="mt-4 w-full max-w-4xl bg-white rounded-2xl p-4 shadow-md">
                <PropertyMap address={address} />
              </div>
              
              <div className="w-full max-w-4xl">
                <PropertyInsights address={address} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
