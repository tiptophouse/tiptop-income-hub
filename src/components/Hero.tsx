
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyAnalysisSection from './analysis/PropertyAnalysisSection';
import { Card } from "@/components/ui/card";
import { Wifi, Sun, CarFront, Pool, Store } from 'lucide-react';
import PropertyMap from './PropertyMap';
import AssetOpportunities from './AssetOpportunities';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <GoogleMapsInit>
      <section className="pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center w-full"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#AA94E2] font-fahkwang">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-[#552B1B] max-w-2xl mx-auto mb-8 font-work-sans">
            Turn your property's untapped resources into monthly income
          </p>
          
          <AddressSearchForm
            address={address}
            setAddress={setAddress}
            isLocating={isLocating}
            setIsLocating={setIsLocating}
            setShowAnalysis={setShowAnalysis}
          />
        </motion.div>

        {!showAnalysis ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative w-full h-80 bg-gradient-to-b from-[#F3ECFF] to-[#E5DEFF] rounded-xl overflow-hidden shadow-md mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png" 
                  alt="3D House Visualization" 
                  className="w-auto h-64 object-contain"
                />
              </div>
              
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#E5DEFF] to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#6E59A5]">
                Enter your address to analyze
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-16 mt-40">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <Wifi className="h-8 w-8 text-blue-500" />
                  <CarFront className="h-8 w-8 text-purple-500" />
                  <Store className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full mb-8"
            >
              <PropertyMap 
                address={address} 
                onZoomComplete={() => console.log("Map zoom completed")} 
              />
            </motion.div>
            
            <AssetOpportunities address={address} />
            
            <PropertyAnalysisSection 
              address={address}
              show={showAnalysis}
            />
          </>
        )}
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
