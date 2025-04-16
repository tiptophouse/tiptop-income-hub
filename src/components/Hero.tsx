
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formElement = document.getElementById('asset-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationDetection = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const detectedAddress = results[0].formatted_address;
              setAddress(detectedAddress);
              
              toast({
                title: "Location Detected",
                description: `Your location: ${detectedAddress}`,
              });
              
              const formElement = document.getElementById('asset-form');
              if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
              }
              
              const addressEvent = new CustomEvent('addressFound', { 
                detail: { address: detectedAddress } 
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
    <section className="py-8 md:py-16 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight font-fahkwang text-tiptop-accent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Discover Your Property's 
        <span className="block">Earning Potential</span>
      </motion.h1>
      
      <motion.p 
        className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-10 text-[#552B1B] max-w-2xl font-work-sans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Monetize your rooftop, bandwidth, parking, and more — instantly.
      </motion.p>
      
      <motion.form
        className="w-full max-w-md mb-6 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        onSubmit={handleSearch}
      >
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter your property address..."
            className="pl-10 pr-16 sm:pr-20 py-4 sm:py-6 w-full rounded-lg text-base sm:text-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 sm:gap-2">
            <Button 
              type="button" 
              variant="outline"
              className="px-1 sm:px-2 py-1 h-auto"
              onClick={handleLocationDetection}
              disabled={isLocating}
            >
              {isLocating ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
            <Button 
              type="submit" 
              className="bg-tiptop-accent hover:bg-tiptop-accent/90 text-white px-2 sm:px-4 py-1 h-auto text-xs sm:text-sm whitespace-nowrap"
            >
              Analyze
            </Button>
          </div>
        </div>
      </motion.form>
      
      <motion.div 
        className="mt-4 md:mt-8 w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-xl md:rounded-3xl p-2 md:p-4 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <img 
          src="/lovable-uploads/0716fc81-957a-490a-b8a1-100fda17e403.png"
          alt="House Potential and New Paradigms" 
          className="w-full h-auto rounded-lg md:rounded-2xl" 
        />
      </motion.div>
    </section>
  );
};

export default Hero;
