
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import AssetSearch from './AssetSearch';
import PropertyAnalysisSection from './analysis/PropertyAnalysisSection';

const Hero = () => {
  const [address, setAddress] = useState('');
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

  const handleAddressSubmit = (submittedAddress: string) => {
    setAddress(submittedAddress);
    setShowAnalysis(true);
    
    // Create and dispatch a custom event for the address
    const addressEvent = new CustomEvent('addressFound', {
      detail: { address: submittedAddress }
    });
    document.dispatchEvent(addressEvent);
  };

  return (
    <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <AssetSearch onAddressSubmit={handleAddressSubmit} />
        
        <PropertyAnalysisSection 
          address={address}
          show={showAnalysis}
        />
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
