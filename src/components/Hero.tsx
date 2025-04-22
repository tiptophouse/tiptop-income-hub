
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import PropertyAnalysisSection from './analysis/PropertyAnalysisSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Undo } from 'lucide-react';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['address'] }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setAddress(place.formatted_address);
          setShowAnalysis(true);
          
          const addressEvent = new CustomEvent('addressFound', {
            detail: { address: place.formatted_address }
          });
          document.dispatchEvent(addressEvent);
        }
      });
    }
  }, []);

  const assetInfo = [
    {
      title: "Rooftop Solar",
      description: "Generate income with solar panels",
      icon: "☀️"
    },
    {
      title: "Internet Bandwidth",
      description: "Share unused bandwidth",
      icon: "🌐"
    },
    {
      title: "Parking Space",
      description: "Rent out your parking space",
      icon: "🅿️"
    },
    {
      title: "Garden Space",
      description: "Share garden space",
      icon: "🌱"
    }
  ];

  return (
    <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center w-full"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-tiptop-accent font-poppins">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Turn your property's untapped resources into monthly income
          </p>

          <div className="relative max-w-2xl mx-auto mb-12">
            <Input 
              ref={inputRef}
              type="text" 
              placeholder="Enter your property address..." 
              className="pl-4 pr-28 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                type="submit"
                className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-6 py-3 h-auto rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-gray-900"
                onClick={() => setShowAnalysis(true)}
              >
                Analyze Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {assetInfo.map((asset, index) => (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-md text-center"
              >
                <div className="text-3xl mb-2">{asset.icon}</div>
                <h3 className="font-medium text-sm">{asset.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{asset.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <PropertyAnalysisSection 
          address={address}
          show={showAnalysis}
        />
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
