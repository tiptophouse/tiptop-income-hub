
import React, { useState } from 'react';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import { Wifi, Sun, CarFront, Droplet, Store } from 'lucide-react';
import PropertyMap from './PropertyMap';
import AssetOpportunities from './AssetOpportunities';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <GoogleMapsInit>
      <section className="pt-8 md:pt-14 pb-14 px-2 sm:px-4 lg:px-8 w-full">
        <div className="w-full text-center mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#AA94E2] font-fahkwang">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-[#552B1B] max-w-2xl mx-auto mb-6 font-work-sans">
            Turn your property's untapped resources into monthly income
          </p>
        </div>

        <div className="w-full flex justify-center items-center mb-6">
          <div className="w-full max-w-xl">
            <AddressSearchForm 
              address={address} 
              setAddress={setAddress} 
              isLocating={isLocating} 
              setIsLocating={setIsLocating} 
              setShowAnalysis={setShowAnalysis} 
            />
          </div>
        </div>

        <div className="w-full">
          {!showAnalysis ? (
            <div className="w-full relative flex flex-col items-center">
              <div className="w-full h-80 overflow-hidden bg-white flex items-center justify-center relative mb-3 rounded-3xl">
                <img 
                  alt="3D House Visualization" 
                  className="w-auto h-64 object-contain" 
                  style={{ zIndex: 1 }} 
                  src="/lovable-uploads/b2b09e18-36b8-4e94-b1a1-042c72b8cee0.jpg" 
                />
                <div className="absolute flex flex-row w-full justify-around bottom-8 left-0 px-8 pointer-events-none z-10">
                  <Sun className="h-9 w-9 text-yellow-500 bg-white rounded-full shadow p-1" />
                  <Wifi className="h-9 w-9 text-blue-500 bg-white rounded-full shadow p-1" />
                  <CarFront className="h-9 w-9 text-purple-500 bg-white rounded-full shadow p-1" />
                  <Droplet className="h-9 w-9 text-blue-400 bg-white rounded-full shadow p-1" />
                  <Store className="h-9 w-9 text-green-500 bg-white rounded-full shadow p-1" />
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
        </div>
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;
