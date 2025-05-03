
import React, { useState } from 'react';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyMap from './PropertyMap';
import AssetOpportunities from './AssetOpportunities';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Package, Wifi, Leaf, Home } from 'lucide-react';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const assetIcons = [{
    id: "storage",
    icon: <Package className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-amber-500" />
  }, {
    id: "garden",
    icon: <Leaf className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-500" />
  }, {
    id: "internet",
    icon: <Wifi className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-500" />
  }, {
    id: "house",
    icon: <Home className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-500" />
  }];
  
  return (
    <GoogleMapsInit>
      <section className="relative flex flex-col min-h-screen bg-black">
        {!showAnalysis ? (
          <>
            <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
              <img src="/lovable-uploads/1a967cb3-75d1-4ef6-b63c-fb935cc58f24.png" alt="Map background" className="w-full h-full object-cover opacity-90" style={{
                filter: 'brightness(0.9)'
              }} />
              
              <div className="absolute bottom-0 left-0 w-full">
                
              </div>
            </div>
          </>
        ) : (
          <div className="w-full">
            <div className="w-full">
              <PropertyMap address={address} onZoomComplete={() => console.log("Map zoom completed")} />
            </div>
            <div className="w-full mt-3 sm:mt-4 px-2 sm:px-4">
              <AssetOpportunities address={address} />
            </div>
          </div>
        )}
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
