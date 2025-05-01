
import React from 'react';
import { Sun, Wifi, ParkingSquare, Flower, Box, Antenna } from 'lucide-react';

export type AssetIconType = 'solar' | 'internet' | 'parking' | 'garden' | 'storage' | 'antenna' | 'pool';

interface AssetIconProps {
  assetType: AssetIconType;
  className?: string;
}

const AssetIcon: React.FC<AssetIconProps> = ({ assetType, className = "h-8 w-8" }) => {
  switch (assetType) {
    case 'solar':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'internet':
      return <Wifi className={`${className} text-blue-500`} />;
    case 'parking':
      return <ParkingSquare className={`${className} text-purple-500`} />;
    case 'garden':
    case 'pool':
      return <Flower className={`${className} ${assetType === 'pool' ? 'text-blue-500' : 'text-green-500'}`} />;
    case 'storage':
      return <Box className={`${className} text-orange-500`} />;
    case 'antenna':
      return <Antenna className={`${className} text-indigo-500`} />;
    default:
      return <Box className={`${className} text-gray-500`} />;
  }
};

export default AssetIcon;
