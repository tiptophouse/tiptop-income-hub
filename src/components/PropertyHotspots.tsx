
import React from 'react';
import { 
  Sun, 
  Wifi, 
  ParkingSquare,
  Flower
} from 'lucide-react';

interface PropertyHotspotsProps {
  features: {
    roofSize?: number;
    solarPotentialKw?: number;
    internetMbps?: number;
    parkingSpaces?: number;
    gardenSqFt?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasEVCharging?: boolean;
  };
  selectedAsset?: string | null;
  onSelectAsset?: (assetId: string | null) => void;
}

const PropertyHotspots: React.FC<PropertyHotspotsProps> = ({ 
  features, 
  selectedAsset,
  onSelectAsset = () => {}
}) => {
  // Define financial values for each asset
  const financialData = {
    solar: { value: 120, unit: 'month' },
    internet: { value: 200, unit: 'month' },
    parking: { value: 300, unit: 'month' },
    garden: { value: 80, unit: 'month' }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Solar Panel Hotspot */}
      <div className="absolute top-[15%] right-[30%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="relative group">
          <div 
            className={`${selectedAsset === 'solar' ? 'bg-amber-500 scale-110' : 'bg-amber-400'} 
                       text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                       hover:scale-110 transition-all cursor-pointer`}
            onClick={() => onSelectAsset(selectedAsset === 'solar' ? null : 'solar')}
          >
            <Sun size={16} />
          </div>
          <div className={`absolute ${selectedAsset === 'solar' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                          bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                          text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
            <div className="font-semibold mb-1">Rooftop Solar</div>
            <div className="text-amber-300 font-bold">${financialData.solar.value}/{financialData.solar.unit}</div>
            <div className="text-xs mt-1">
              {features.roofSize ? `${features.roofSize} sq ft usable` : "Solar panel potential"}
              {features.solarPotentialKw ? ` with ${features.solarPotentialKw}kW potential` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Internet Antenna Hotspot */}
      <div className="absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="relative group">
          <div 
            className={`${selectedAsset === 'internet' ? 'bg-blue-600 scale-110' : 'bg-blue-500'} 
                       text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                       hover:scale-110 transition-all cursor-pointer`}
            onClick={() => onSelectAsset(selectedAsset === 'internet' ? null : 'internet')}
          >
            <Wifi size={16} />
          </div>
          <div className={`absolute ${selectedAsset === 'internet' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                          bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                          text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
            <div className="font-semibold mb-1">Internet Bandwidth</div>
            <div className="text-blue-300 font-bold">${financialData.internet.value}/{financialData.internet.unit}</div>
            <div className="text-xs mt-1">
              {features.internetMbps ? `${features.internetMbps} Mbps available for sharing` : "Sharable internet bandwidth"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Parking Space Hotspot */}
      {features.hasParking && (
        <div className="absolute top-[75%] right-[40%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div 
              className={`${selectedAsset === 'parking' ? 'bg-purple-600 scale-110' : 'bg-purple-500'} 
                         text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                         hover:scale-110 transition-all cursor-pointer`}
              onClick={() => onSelectAsset(selectedAsset === 'parking' ? null : 'parking')}
            >
              <ParkingSquare size={16} />
            </div>
            <div className={`absolute ${selectedAsset === 'parking' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                            bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                            text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
              <div className="font-semibold mb-1">Parking Space</div>
              <div className="text-purple-300 font-bold">${financialData.parking.value}/{financialData.parking.unit}</div>
              <div className="text-xs mt-1">
                {features.parkingSpaces ? `${features.parkingSpaces} spaces available for rent` : "Parking spaces available"}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Garden Hotspot */}
      {features.hasGarden && (
        <div className="absolute top-[70%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div 
              className={`${selectedAsset === 'garden' ? 'bg-emerald-600 scale-110' : 'bg-emerald-500'} 
                         text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                         hover:scale-110 transition-all cursor-pointer`}
              onClick={() => onSelectAsset(selectedAsset === 'garden' ? null : 'garden')}
            >
              <Flower size={16} />
            </div>
            <div className={`absolute ${selectedAsset === 'garden' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                            bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                            text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
              <div className="font-semibold mb-1">Garden Space</div>
              <div className="text-emerald-300 font-bold">${financialData.garden.value}/{financialData.garden.unit}</div>
              <div className="text-xs mt-1">
                {features.gardenSqFt ? `${features.gardenSqFt} sq ft available` : "Garden space available"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyHotspots;
