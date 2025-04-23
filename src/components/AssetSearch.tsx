import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { geocodeAddress, getCurrentLocation, reverseGeocode } from '@/utils/geocodingService';

interface AssetSearchProps {
  onAddressSubmit: (address: string) => void;
}

const AssetSearch: React.FC<AssetSearchProps> = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [activeAsset, setActiveAsset] = useState<string>('all');

  const assetInfo = {
    rooftopSolar: {
      title: "Rooftop Solar",
      description: "Earn $100-150/month by installing solar panels on your roof",
      icon: "☀️"
    },
    internetBandwidth: {
      title: "Internet Bandwidth",
      description: "Share unused internet bandwidth for $80-120/month",
      icon: "🌐"
    },
    parkingSpace: {
      title: "Parking Space",
      description: "Rent out your parking space when not in use for $70-200/month",
      icon: "🅿️"
    },
    gardenSpace: {
      title: "Garden Space",
      description: "Share garden space with the community for $50-100/month",
      icon: "🌱"
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    onAddressSubmit(address);
  };

  const handleDetectLocation = () => {
    if (isLocating) return;
    
    setIsLocating(true);
    
    getCurrentLocation(
      (userLocation) => {
        reverseGeocode({
          location: userLocation,
          onSuccess: (detectedAddress) => {
            setAddress(detectedAddress);
            
            toast({
              title: "Location Detected",
              description: `Your location: ${detectedAddress}`
            });
            
            onAddressSubmit(detectedAddress);
            setIsLocating(false);
          },
          onError: () => {
            toast({
              title: "Location Error",
              description: "Unable to determine your address.",
              variant: "destructive"
            });
            setIsLocating(false);
          }
        });
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-tiptop-accent font-poppins tracking-tight leading-tight">
          Monetize Your Home Assets
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Turn your property's untapped resources into monthly income
        </p>
      </motion.div>

      <Tabs 
        defaultValue="all" 
        value={activeAsset}
        onValueChange={setActiveAsset}
        className="mb-8"
      >
        <TabsList className="w-full grid grid-cols-5 h-auto rounded-xl bg-[#F3ECFF] shadow-md">
          <TabsTrigger value="all" className="py-3 font-semibold text-[#6E59A5] hover:text-[#8B5CF6] text-xs sm:text-sm md:text-base">
            All Assets
          </TabsTrigger>
          <TabsTrigger value="rooftopSolar" className="py-3 font-semibold text-[#6E59A5] hover:text-[#8B5CF6] text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Rooftop Solar</span>
            <span className="sm:hidden">☀️</span>
          </TabsTrigger>
          <TabsTrigger value="internetBandwidth" className="py-3 font-semibold text-[#6E59A5] hover:text-[#8B5CF6] text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Internet</span>
            <span className="sm:hidden">🌐</span>
          </TabsTrigger>
          <TabsTrigger value="parkingSpace" className="py-3 font-semibold text-[#6E59A5] hover:text-[#8B5CF6] text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Parking</span>
            <span className="sm:hidden">🅿️</span>
          </TabsTrigger>
          <TabsTrigger value="gardenSpace" className="py-3 font-semibold text-[#6E59A5] hover:text-[#8B5CF6] text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Garden</span>
            <span className="sm:hidden">🌱</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {Object.entries(assetInfo).map(([key, asset]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg text-center cursor-pointer border border-transparent hover:border-[#8B5CF6] transition-colors duration-300"
                onClick={() => setActiveAsset(key)}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{asset.icon}</div>
                <h3 className="font-semibold text-xs sm:text-sm tracking-wide text-[#7E69AB] truncate">{asset.title}</h3>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {Object.entries(assetInfo).map(([key, asset]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl mb-6 border border-[#B993FE]/60"
            >
              <div className="flex items-center mb-4 sm:mb-6 gap-3 sm:gap-5">
                <div className="text-4xl sm:text-5xl">{asset.icon}</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#8B5CF6] truncate max-w-[200px] sm:max-w-xs">{asset.title}</h3>
                  <p className="text-gray-700 text-sm sm:text-base line-clamp-2">{asset.description}</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      <motion.form 
        className="w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Enter your property address..." 
            className="pl-12 pr-28 py-5 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/95 backdrop-blur-sm focus:ring-4 focus:ring-[#9b87f5]/50 transition-all duration-300 placeholder:text-gray-400"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            aria-label="Property address"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="p-1 h-9 w-9 rounded-full hover:bg-[#9b87f5]/10 text-[#9b87f5]"
              onClick={handleDetectLocation}
              disabled={isLocating}
              aria-label="Detect current location"
            >
              {isLocating ? (
                <svg className="animate-spin h-4 w-4 text-[#9b87f5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <MapPin className="h-4 w-4 text-[#9b87f5]" />
              )}
            </Button>
            <Button 
              type="submit" 
              className="bg-[#9b87f5] hover:bg-[#8B5CF6] px-4 sm:px-6 py-3 h-auto rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl text-white whitespace-nowrap"
              aria-label="Analyze address"
            >
              Analyze Now
            </Button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AssetSearch;
