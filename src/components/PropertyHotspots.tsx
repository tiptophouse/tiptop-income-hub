
import React from 'react';
import { 
  Home, 
  Sun, 
  Ev, 
  Wifi, 
  ParkingSquare,
  Droplets,
  Pool
} from 'lucide-react';

interface PropertyHotspotsProps {
  features: {
    roofSize?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasEVCharging?: boolean;
  };
}

const PropertyHotspots: React.FC<PropertyHotspotsProps> = ({ features }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Solar Panel Hotspot */}
      <div className="absolute top-[15%] right-[30%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="relative group">
          <div className="bg-yellow-500 text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg pulse-animation">
            <Sun size={14} />
          </div>
          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
            {features.roofSize ? `Solar Panels (${features.roofSize}sq ft roof)` : "Solar Panel Potential"}
          </div>
        </div>
      </div>

      {/* Internet Antenna Hotspot */}
      <div className="absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="relative group">
          <div className="bg-blue-500 text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg">
            <Wifi size={14} />
          </div>
          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
            Internet Antenna Placement
          </div>
        </div>
      </div>
      
      {/* EV Charging Hotspot */}
      {features.hasParking && (
        <div className="absolute top-[75%] right-[60%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div className="bg-green-500 text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg">
              <Ev size={14} />
            </div>
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
              EV Charging Station Potential
            </div>
          </div>
        </div>
      )}
      
      {/* Garden Hotspot */}
      {features.hasGarden && (
        <div className="absolute top-[70%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div className="bg-emerald-500 text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg">
              <Droplets size={14} />
            </div>
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
              Smart Irrigation System
            </div>
          </div>
        </div>
      )}
      
      {/* Swimming Pool Hotspot */}
      {features.hasPool && (
        <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div className="bg-cyan-500 text-white h-7 w-7 rounded-full flex items-center justify-center shadow-lg">
              <Pool size={14} />
            </div>
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
              Smart Pool System
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyHotspots;
