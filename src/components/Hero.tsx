
import React, { useState } from 'react';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
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
            <div className="w-full h-80 overflow-hidden bg-[#FFFDED] flex flex-col items-center justify-center relative mb-3 rounded-3xl">
              <img 
                alt="3D House Visualization" 
                className="w-auto h-64 object-contain" 
                style={{ zIndex: 1 }} 
                src="/lovable-uploads/10603114-d9a7-40ea-afe1-229cb7a86511.png" 
              />
              <div className="absolute top-0 left-0 w-full h-full z-10">
                <div className="absolute top-4 left-4">
                  <p className="text-lg font-semibold text-[#552B1B] mb-2">Rent your</p>
                  <div className="flex flex-col gap-3">
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Parking Space</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Items</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Unused Bandwidth</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Rooftop</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Swimming Pool</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Garden</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Storage Space</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#552B1B]">Car</span>
                  </div>
                </div>
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
