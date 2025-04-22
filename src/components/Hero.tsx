
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyAnalysisSection from './analysis/PropertyAnalysisSection';

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
        
        <AddressSearchForm
          address={address}
          setAddress={setAddress}
          isLocating={isLocating}
          setIsLocating={setIsLocating}
          setShowAnalysis={setShowAnalysis}
        />
        
        <PropertyAnalysisSection 
          address={address}
          show={showAnalysis}
        />
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
