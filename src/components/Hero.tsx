
import React, { useState } from 'react';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyMap from './PropertyMap';
import AssetOpportunities from './AssetOpportunities';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const assetLabels = [
    "Parking Space",
    "Items",
    "Unused Bandwidth",
    "Rooftop",
    "Swimming Pool",
    "Garden",
    "Storage Space",
    "Car"
  ];

  return (
    <GoogleMapsInit>
      <section className="pt-6 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto" style={{ overflow: 'visible' }}>
        {!showAnalysis ? (
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#2D2D2D] leading-tight">
                Unlock Your Home's<br />Earning Potential
              </h1>
              <p className="text-xl md:text-2xl text-[#2D2D2D] mb-8">
                Discover new ways to turn your property into income.
              </p>
            </div>
            
            <div className="w-full flex justify-center mb-10">
              <div className="w-full max-w-md">
                <AddressSearchForm 
                  address={address} 
                  setAddress={setAddress} 
                  isLocating={isLocating} 
                  setIsLocating={setIsLocating} 
                  setShowAnalysis={setShowAnalysis} 
                />
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-lg">
                <img 
                  src="/lovable-uploads/81a1fa89-5bba-4533-a21c-9df12ace20b3.png" 
                  alt="Home with income opportunities" 
                  className="w-full object-contain"
                />
                
                <Button 
                  className="mt-8 bg-[#7E69AB] hover:bg-[#6E59A5] text-white font-semibold text-xl py-6 px-12 rounded-full w-full max-w-xs mx-auto"
                  onClick={() => setShowAnalysis(true)}
                >
                  Get started
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto">
            <div className="w-full mb-8">
              <PropertyMap 
                address={address} 
                onZoomComplete={() => console.log("Map zoom completed")} 
              />
            </div>
            <div className="w-full">
              <AssetOpportunities address={address} />
            </div>
          </div>
        )}
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
