
import React, { useState } from 'react';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyMap from './PropertyMap';
import AssetOpportunities from './AssetOpportunities';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Package, Wifi, Leaf, Home } from 'lucide-react';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const assetIcons = [
    { 
      id: "storage", 
      icon: <Package className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-amber-500" /> 
    },
    { 
      id: "garden", 
      icon: <Leaf className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-500" /> 
    },
    { 
      id: "internet", 
      icon: <Wifi className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-500" /> 
    },
    { 
      id: "house", 
      icon: <Home className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-500" /> 
    }
  ];

  return (
    <GoogleMapsInit>
      <section className="relative flex flex-col min-h-screen bg-black">
        {!showAnalysis ? (
          <>
            <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
              <img 
                src="/lovable-uploads/1a967cb3-75d1-4ef6-b63c-fb935cc58f24.png" 
                alt="Map background" 
                className="w-full h-full object-cover opacity-90"
                style={{ filter: 'brightness(0.9)' }}
              />
              
              <div className="absolute bottom-0 left-0 w-full">
                <img 
                  src="/lovable-uploads/10603114-d9a7-40ea-afe1-229cb7a86511.png" 
                  alt="3D House" 
                  className="w-20 xs:w-24 sm:w-32 md:w-40 h-auto mx-auto" 
                />
              </div>
            </div>
            
            <div className="relative z-10 px-2 xs:px-3 sm:px-4 pt-4 sm:pt-6 md:pt-10 flex-1">
              <div className="mb-2 sm:mb-3 md:mb-4">
                <h1 className="text-tiptop text-lg xs:text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">tiptop</h1>
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-5">
                  Monetize Your Home Assets
                </h2>
              </div>

              <div className="w-full max-w-md mx-auto mb-3 sm:mb-4 md:mb-6">
                <AddressSearchForm 
                  address={address} 
                  setAddress={setAddress} 
                  isLocating={isLocating} 
                  setIsLocating={setIsLocating} 
                  setShowAnalysis={setShowAnalysis} 
                />
              </div>
              
              <div className="mt-auto mb-2 sm:mb-3 md:mb-5 w-full">
                <Carousel
                  opts={{
                    align: "center",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {assetIcons.map((asset) => (
                      <CarouselItem key={asset.id} className="basis-1/4 pl-1 md:pl-2">
                        <div className="asset-icon-card py-2 sm:py-3 md:py-4">
                          {asset.icon}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-[#2A2A2A]/80 text-white hover:bg-[#3A3A3A]/80 border-none left-0.5 sm:left-1 md:left-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  <CarouselNext className="bg-[#2A2A2A]/80 text-white hover:bg-[#3A3A3A]/80 border-none right-0.5 sm:right-1 md:right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </Carousel>
              </div>
              
              <div className="info-section mt-3 sm:mt-4 md:mt-8 pt-3 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-3 md:mb-4">
                  Rent Your Assets, Make Passive Income
                </h2>
                <div className="bg-[#B5A887]/90 rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">Rooftop</h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-white/80">Solar panels, gardens</p>
                </div>
                <div className="flex justify-between mt-2 sm:mt-3 md:mt-4">
                  <button className="bg-[#333333]/80 hover:bg-[#444444]/80 rounded-full p-1 sm:p-1.5 md:p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left sm:w-5 sm:h-5"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button className="bg-[#333333]/80 hover:bg-[#444444]/80 rounded-full p-1 sm:p-1.5 md:p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right sm:w-5 sm:h-5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                <p className="text-center text-white/90 text-[10px] xs:text-xs sm:text-sm mt-3 sm:mt-4 md:mt-6">
                  Check which assets you can start monetizing now! Enter your property address.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full">
            <div className="w-full">
              <PropertyMap 
                address={address} 
                onZoomComplete={() => console.log("Map zoom completed")} 
              />
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
