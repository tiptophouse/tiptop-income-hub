
import React from 'react';
import { 
  Sun, 
  Wifi, 
  ParkingSquare,
  Flower,
  Box,
  Antenna
} from 'lucide-react';

interface PropertyHotspotsProps {
  features: {
    roofSize?: number;
    solarPotentialKw?: number;
    internetMbps?: number;
    parkingSpaces?: number;
    gardenSqFt?: number;
    storageVolume?: number;
    antenna5gArea?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasStorage?: boolean;
    hasEVCharging?: boolean;
    has5G?: boolean;
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
    solar: { value: features.solarPotentialKw ? Math.round(features.solarPotentialKw * 0.4) : 120, unit: 'month' },
    internet: { value: features.internetMbps ? Math.round(features.internetMbps * 0.8) : 200, unit: 'month' },
    parking: { value: features.parkingSpaces ? Math.round(features.parkingSpaces * 15) : 300, unit: 'month' },
    garden: { value: features.gardenSqFt ? Math.round(features.gardenSqFt * 0.2) : 80, unit: 'month' },
    storage: { value: features.storageVolume ? Math.round(features.storageVolume * 0.05) : 100, unit: 'month' },
    antenna: { value: features.antenna5gArea ? Math.round(features.antenna5gArea * 15) : 250, unit: 'month' }
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
      {(features.hasParking || features.parkingSpaces) && (
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
      {(features.hasGarden || features.gardenSqFt) && (
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
      
      {/* Storage Space Hotspot */}
      {(features.hasStorage || features.storageVolume) && (
        <div className="absolute top-[60%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div 
              className={`${selectedAsset === 'storage' ? 'bg-orange-600 scale-110' : 'bg-orange-500'} 
                         text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                         hover:scale-110 transition-all cursor-pointer`}
              onClick={() => onSelectAsset(selectedAsset === 'storage' ? null : 'storage')}
            >
              <Box size={16} />
            </div>
            <div className={`absolute ${selectedAsset === 'storage' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                            bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                            text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
              <div className="font-semibold mb-1">Storage Space</div>
              <div className="text-orange-300 font-bold">${financialData.storage.value}/{financialData.storage.unit}</div>
              <div className="text-xs mt-1">
                {features.storageVolume ? `${features.storageVolume} cubic meters available` : "Storage space available"}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 5G Antenna Hotspot */}
      {(features.has5G || features.antenna5gArea) && (
        <div className="absolute top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group">
            <div 
              className={`${selectedAsset === 'antenna' ? 'bg-indigo-600 scale-110' : 'bg-indigo-500'} 
                         text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg
                         hover:scale-110 transition-all cursor-pointer`}
              onClick={() => onSelectAsset(selectedAsset === 'antenna' ? null : 'antenna')}
            >
              <Antenna size={16} />
            </div>
            <div className={`absolute ${selectedAsset === 'antenna' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                            bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white 
                            text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-200 z-20`}>
              <div className="font-semibold mb-1">5G Antenna Hosting</div>
              <div className="text-indigo-300 font-bold">${financialData.antenna.value}/{financialData.antenna.unit}</div>
              <div className="text-xs mt-1">
                {features.antenna5gArea ? `${features.antenna5gArea} sq meters available` : "Rooftop space for 5G antennas"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyHotspots;
