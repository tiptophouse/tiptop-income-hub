
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
      icon: <Package className="h-8 w-8 text-amber-500" /> 
    },
    { 
      id: "garden", 
      icon: <Leaf className="h-8 w-8 text-green-500" /> 
    },
    { 
      id: "internet", 
      icon: <Wifi className="h-8 w-8 text-blue-500" /> 
    },
    { 
      id: "house", 
      icon: <Home className="h-8 w-8 text-purple-500" /> 
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
                  className="w-40 h-auto mx-auto" 
                />
              </div>
            </div>
            
            <div className="relative z-10 px-5 pt-10 flex-1">
              <div className="mb-4">
                <h1 className="text-tiptop text-2xl font-bold mb-2">tiptop</h1>
                <h2 className="text-4xl sm:text-5xl font-bold mb-5">
                  Monetize Your Home Assets
                </h2>
              </div>

              <div className="w-full max-w-md mx-auto mb-6">
                <AddressSearchForm 
                  address={address} 
                  setAddress={setAddress} 
                  isLocating={isLocating} 
                  setIsLocating={setIsLocating} 
                  setShowAnalysis={setShowAnalysis} 
                />
              </div>
              
              <div className="mt-auto mb-5 w-full">
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
                        <div className="asset-icon-card">
                          {asset.icon}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-[#2A2A2A]/80 text-white hover:bg-[#3A3A3A]/80 border-none left-2" />
                  <CarouselNext className="bg-[#2A2A2A]/80 text-white hover:bg-[#3A3A3A]/80 border-none right-2" />
                </Carousel>
              </div>
              
              <div className="info-section">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Rent Your Assets, Make Passive Income
                </h2>
                <div className="bg-[#B5A887]/90 rounded-xl p-4 mb-6">
                  <h3 className="text-xl font-semibold">Rooftop</h3>
                  <p className="text-sm text-white/80">Solar panels, gardens</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button className="bg-[#333333]/80 hover:bg-[#444444]/80 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button className="bg-[#333333]/80 hover:bg-[#444444]/80 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                <p className="text-center text-white/90 mt-6">
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
            <div className="w-full mt-4 px-4">
              <AssetOpportunities address={address} />
            </div>
          </div>
        )}
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
