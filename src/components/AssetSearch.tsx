
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const detectedAddress = results[0].formatted_address;
                setAddress(detectedAddress);
                
                toast({
                  title: "Location Detected",
                  description: `Your location: ${detectedAddress}`
                });
                
                onAddressSubmit(detectedAddress);
              } else {
                toast({
                  title: "Location Error",
                  description: "Unable to determine your address.",
                  variant: "destructive"
                });
              }
              setIsLocating(false);
            });
          } else {
            toast({
              title: "Maps API Not Loaded",
              description: "Please try entering your address manually.",
              variant: "destructive"
            });
            setIsLocating(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please check your browser permissions.",
            variant: "destructive"
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-tiptop-accent font-poppins">
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
        <TabsList className="w-full grid grid-cols-5 h-auto">
          <TabsTrigger value="all" className="py-3">
            All Assets
          </TabsTrigger>
          <TabsTrigger value="rooftopSolar" className="py-3">
            <span className="hidden sm:inline">Rooftop Solar</span>
            <span className="sm:hidden">☀️</span>
          </TabsTrigger>
          <TabsTrigger value="internetBandwidth" className="py-3">
            <span className="hidden sm:inline">Internet</span>
            <span className="sm:hidden">🌐</span>
          </TabsTrigger>
          <TabsTrigger value="parkingSpace" className="py-3">
            <span className="hidden sm:inline">Parking</span>
            <span className="sm:hidden">🅿️</span>
          </TabsTrigger>
          <TabsTrigger value="gardenSpace" className="py-3">
            <span className="hidden sm:inline">Garden</span>
            <span className="sm:hidden">🌱</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Object.entries(assetInfo).map(([key, asset]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg p-4 shadow-md text-center cursor-pointer"
                onClick={() => setActiveAsset(key)}
              >
                <div className="text-3xl mb-2">{asset.icon}</div>
                <h3 className="font-medium text-sm">{asset.title}</h3>
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
              className="bg-white rounded-lg p-6 shadow-md mb-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{asset.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{asset.title}</h3>
                  <p className="text-gray-600">{asset.description}</p>
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Enter your property address..." 
            className="pl-12 pr-28 py-6 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="p-1 h-9 w-9 rounded-full hover:bg-tiptop-accent/10"
              onClick={handleDetectLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <svg className="animate-spin h-4 w-4 text-tiptop-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <MapPin className="h-4 w-4 text-tiptop-accent" />
              )}
            </Button>
            <Button type="submit" className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-6 py-3 h-auto rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-gray-900">
              Analyze Now
            </Button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AssetSearch;
