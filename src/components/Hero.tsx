import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { geocodeAddress } from '@/utils/geocodingService';
import GoogleMapsInit from './GoogleMapsInit';
const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the address
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }

    // Show satellite view first
    setShowSatellite(true);

    // Then scroll to asset form
    setTimeout(() => {
      const formElement = document.getElementById('asset-form');
      if (formElement) {
        formElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 1500);

    // Custom event to pass address to other components
    const addressEvent = new CustomEvent('addressFound', {
      detail: {
        address
      }
    });
    document.dispatchEvent(addressEvent);
  };
  const handleLocationDetection = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
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
              setShowSatellite(true);
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
      }, error => {
        console.error('Error getting location:', error);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please check your browser permissions.",
          variant: "destructive"
        });
        setIsLocating(false);
      });
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  };
  return <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-poppins" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }}>
          Discover Your Property's 
          <span className="block">Earning Potential</span>
        </motion.h1>
        
        <motion.p className="text-lg sm:text-xl mb-10 text-muted-foreground max-w-2xl" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.2
      }}>
          Monetize your rooftop, bandwidth, parking, and more — instantly.
        </motion.p>
        
        <motion.form className="w-full max-w-xl mb-8" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.4
      }} onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input type="text" placeholder="Enter your property address..." className="pl-12 pr-28 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300" value={address} onChange={e => setAddress(e.target.value)} />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" className="p-1 h-9 w-9 rounded-full hover:bg-tiptop-accent/10" onClick={handleLocationDetection} disabled={isLocating}>
                {isLocating ? <svg className="animate-spin h-4 w-4 text-tiptop-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg> : <MapPin className="h-4 w-4 text-tiptop-accent" />}
              </Button>
              <Button type="submit" className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-6 py-3 h-auto rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-gray-900">
                Analyze Now
              </Button>
            </div>
          </div>
        </motion.form>
        
        <AnimatePresence>
          {!showSatellite ? <motion.div key="house-image" className="mt-4 w-full max-w-4xl bg-white rounded-2xl p-4 shadow-md" initial={{
          opacity: 0,
          y: 40
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} transition={{
          duration: 0.7,
          delay: 0.6
        }}>
              <div className="relative">
                <img alt="House with Assets" className="w-full h-auto rounded-xl" src="/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg" />
                
                {/* Asset Indicators */}
                <div className="absolute top-[20%] right-[15%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                  <span className="text-xs font-medium">Solar</span>
                </div>
                
                <div className="absolute top-[65%] left-[20%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                  <span className="text-xs font-medium">Internet</span>
                </div>
                
                <div className="absolute bottom-[25%] right-[30%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                  <span className="text-xs font-medium">Parking</span>
                </div>
              </div>
            </motion.div> : <motion.div key="satellite-view" className="mt-4 w-full max-w-4xl bg-white rounded-2xl p-4 shadow-md" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5
        }}>
              <div className="relative">
                <img src="/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png" alt="Satellite View" className="w-full h-auto rounded-xl" />
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-16 w-16 border-4 border-tiptop-accent rounded-full flex items-center justify-center animate-pulse">
                    <div className="h-4 w-4 bg-tiptop-accent rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </section>
    </GoogleMapsInit>;
};
export default Hero;