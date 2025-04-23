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
  return <GoogleMapsInit>
      <section className="pt-8 md:pt-14 pb-14 px-2 md:px-0 flex flex-col items-center max-w-6xl mx-auto w-full">
        <div className="w-full text-center mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#AA94E2] font-fahkwang">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-[#552B1B] max-w-2xl mx-auto mb-6 font-work-sans">
            Turn your property's untapped resources into monthly income
          </p>
        </div>

        <div className="w-full flex justify-center items-center mb-6">
          <AddressSearchForm address={address} setAddress={setAddress} isLocating={isLocating} setIsLocating={setIsLocating} setShowAnalysis={setShowAnalysis} />
        </div>

        <div className="w-full max-w-3xl">
          {!showAnalysis ? <div className="w-full relative flex flex-col items-center">
              <div className="w-full h-80 overflow-hidden bg-gradient-to-b from-[#F3ECFF] to-[#E5DEFF] shadow-md flex items-center justify-center relative mb-3 rounded-3xl bg-[#000a00]/0">
                <img alt="3D House Visualization" className="w-auto h-64 object-contain" style={{
              zIndex: 1
            }} src="/lovable-uploads/b2b09e18-36b8-4e94-b1a1-042c72b8cee0.jpg" />
                <div className="absolute flex flex-row w-full justify-around bottom-8 left-0 px-8 pointer-events-none z-10">
                  <Sun className="h-9 w-9 text-yellow-500 bg-white rounded-full shadow p-1" />
                  <Wifi className="h-9 w-9 text-blue-500 bg-white rounded-full shadow p-1" />
                  <CarFront className="h-9 w-9 text-purple-500 bg-white rounded-full shadow p-1" />
                  <Droplet className="h-9 w-9 text-blue-400 bg-white rounded-full shadow p-1" />
                  <Store className="h-9 w-9 text-green-500 bg-white rounded-full shadow p-1" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#E5DEFF] to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#6E59A5] shadow">
                Enter your address to analyze
              </div>
            </div> : <>
              <div className="w-full mb-8">
                <PropertyMap address={address} onZoomComplete={() => console.log("Map zoom completed")} />
              </div>
              <div className="w-full">
                <AssetOpportunities address={address} />
              </div>
            </>}
        </div>
      </section>
    </GoogleMapsInit>;
};
export default Hero;