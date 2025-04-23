
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Wifi, CarFront, Droplet, Store, Camera, Car, BatteryCharging, Scissors, Home, Garden } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AssetInfoCard from './AssetInfoCard';

interface AssetAdditionalInfoProps {
  selectedAssets: string[];
  onComplete?: () => void;
}

const AssetAdditionalInfo: React.FC<AssetAdditionalInfoProps> = ({ 
  selectedAssets,
  onComplete 
}) => {
  // Define asset metadata including descriptions and required fields
  const assetInfo: Record<string, {
    title: string;
    icon: JSX.Element;
    description: string;
    detectedInfo: string;
    requiredFields: { name: string; type: 'text' | 'number' | 'checkbox' | 'select'; options?: string[] }[];
  }> = {
    solar: {
      title: "Rooftop Solar",
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      description: "Monetize your roof space by installing solar panels. Our partners handle installation and maintenance.",
      detectedInfo: "We've detected that your roof has excellent solar potential with approximately 92% sun exposure throughout the day.",
      requiredFields: [
        { name: "Roof area in sq ft", type: "number" },
        { name: "Roof material", type: "select", options: ["Asphalt", "Metal", "Tile", "Other"] }
      ]
    },
    bandwidth: {
      title: "Internet Bandwidth",
      icon: <Wifi className="h-8 w-8 text-blue-500" />,
      description: "Share your unused internet bandwidth and earn passive income. Simple setup with our dedicated hardware.",
      detectedInfo: "Your area has high-speed fiber connectivity with stable connection and approximately 0.5% packet loss.",
      requiredFields: [
        { name: "Internet speed (Mbps)", type: "number" },
        { name: "Provider", type: "text" }
      ]
    },
    parking: {
      title: "Parking Space",
      icon: <CarFront className="h-8 w-8 text-purple-500" />,
      description: "Rent out your unused parking spots on an hourly, daily, or monthly basis.",
      detectedInfo: "We've identified 2 potential parking spaces that could be monetized based on your property layout.",
      requiredFields: [
        { name: "Number of spaces", type: "number" },
        { name: "Covered parking?", type: "checkbox" }
      ]
    },
    pool: {
      title: "Swimming Pool",
      icon: <Droplet className="h-8 w-8 text-blue-500" />,
      description: "Rent your pool by the hour during times you're not using it. All renters are pre-vetted and insured.",
      detectedInfo: "Your swimming pool appears to be approximately 400 sq ft with good access from outside the main living areas.",
      requiredFields: [
        { name: "Pool size (sq ft)", type: "number" },
        { name: "Heated pool?", type: "checkbox" }
      ]
    },
    storage: {
      title: "Storage Space",
      icon: <Store className="h-8 w-8 text-green-500" />,
      description: "Unused garage, attic, or basement space can be rented out for secure storage.",
      detectedInfo: "Based on your property layout, you have approximately 200 sq ft of potential storage space to monetize.",
      requiredFields: [
        { name: "Storage area (sq ft)", type: "number" },
        { name: "Climate controlled?", type: "checkbox" }
      ]
    },
    items: {
      title: "Items (Equipment)",
      icon: <Camera className="h-8 w-8 text-gray-500" />,
      description: "Rent out cameras, tools, and other equipment you don't use frequently.",
      detectedInfo: "Many homeowners in your area are successfully monetizing equipment with an average of 3 rentals per month.",
      requiredFields: [
        { name: "Item category", type: "select", options: ["Electronics", "Tools", "Sports", "Other"] },
        { name: "Approximate value", type: "number" }
      ]
    },
    car: {
      title: "Car Sharing",
      icon: <Car className="h-8 w-8 text-red-500" />,
      description: "Share your vehicle when you're not using it. All drivers are pre-screened and fully insured.",
      detectedInfo: "Car sharing in your neighborhood has a 95% utilization rate with average earnings of $45/day.",
      requiredFields: [
        { name: "Vehicle make", type: "text" },
        { name: "Vehicle year", type: "number" }
      ]
    },
    'ev-charger': {
      title: "EV Charger",
      icon: <BatteryCharging className="h-8 w-8 text-green-600" />,
      description: "Allow EV owners to use your charging station, earning money with every charge.",
      detectedInfo: "Your area has a 250% increase in EV adoption over the past year, creating high demand for charging.",
      requiredFields: [
        { name: "Charger type", type: "select", options: ["Level 1", "Level 2", "DC Fast"] },
        { name: "Publicly accessible?", type: "checkbox" }
      ]
    },
    salon: {
      title: "Salon Space",
      icon: <Scissors className="h-8 w-8 text-pink-500" />,
      description: "Convert a room into a rentable salon space for stylists looking for flexible locations.",
      detectedInfo: "Properties with your layout have successfully converted spaces into part-time salon studios.",
      requiredFields: [
        { name: "Room size (sq ft)", type: "number" },
        { name: "Separate entrance?", type: "checkbox" }
      ]
    },
    'full-house': {
      title: "Full House Rental",
      icon: <Home className="h-8 w-8 text-indigo-500" />,
      description: "Rent your entire home on platforms like Airbnb when you're away.",
      detectedInfo: "Homes in your area average $180/night on short-term rental platforms with 68% occupancy rates.",
      requiredFields: [
        { name: "Number of bedrooms", type: "number" },
        { name: "Days available per year", type: "number" }
      ]
    },
    garden: {
      title: "Garden Space",
      icon: <Garden className="h-8 w-8 text-green-400" />,
      description: "Rent garden space to local gardeners or for community gardening projects.",
      detectedInfo: "Your property has approximately 400 sq ft of suitable garden space with good sun exposure.",
      requiredFields: [
        { name: "Garden area (sq ft)", type: "number" },
        { name: "Water source available?", type: "checkbox" }
      ]
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-8 mb-12 w-full"
      id="additional-info"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
        Additional Information Required
      </h2>
      
      {selectedAssets.map((assetId) => {
        const asset = assetInfo[assetId];
        if (!asset) return null;
        
        return (
          <AssetInfoCard
            key={assetId}
            assetId={assetId}
            title={asset.title}
            icon={asset.icon}
          >
            <div className="mb-4">
              <p className="text-gray-700 mb-3">{asset.description}</p>
              <div className="bg-[#F3ECFF] p-3 rounded-md text-[#6E59A5] mb-4">
                <strong className="font-medium">We detected:</strong> {asset.detectedInfo}
              </div>
            </div>
            
            <div className="space-y-4">
              {asset.requiredFields.map((field) => (
                <div key={`${assetId}-${field.name}`} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.name}
                  </label>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AA94E2]"
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input 
                      type="number" 
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AA94E2]"
                    />
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-[#AA94E2] focus:ring-[#AA94E2] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </div>
                  )}
                  
                  {field.type === 'select' && (
                    <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AA94E2]">
                      <option value="">Select {field.name}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </AssetInfoCard>
        );
      })}
      
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={onComplete}
          className="bg-[#AA94E2] hover:bg-[#9b87f5] text-[#FFFDED] px-8 py-6 h-auto text-lg rounded-full font-fahkwang"
        >
          Complete & View Earnings Estimate
        </Button>
      </div>
    </motion.div>
  );
};

export default AssetAdditionalInfo;
