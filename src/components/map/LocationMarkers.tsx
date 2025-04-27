
import React from 'react';
import { motion } from 'framer-motion';

interface MarkerProps {
  type: 'solar' | 'internet' | 'ev' | 'storage' | 'garden';
  position: { top: string; left: string };
  label: string;
}

const colors = {
  solar: '#FFD700',
  internet: '#4287f5',
  ev: '#42f57b',
  storage: '#f542cb',
  garden: '#7ef542'
};

const icons = {
  solar: '☀️',
  internet: '📶',
  ev: '🔌',
  storage: '📦',
  garden: '🌱'
};

const Marker: React.FC<MarkerProps> = ({ type, position, label }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
      style={{ top: position.top, left: position.left }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: isHovered ? -5 : 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer"
          style={{ backgroundColor: colors[type] }}
        >
          <span className="text-lg">{icons[type]}</span>
        </div>
        <div className="w-4 h-4 bg-white rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2" />
        
        {isHovered && (
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-md whitespace-nowrap text-xs"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface LocationMarkersProps {
  markers: Array<MarkerProps>;
}

const LocationMarkers: React.FC<LocationMarkersProps> = ({ markers }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {markers.map((marker, index) => (
        <div className="pointer-events-auto" key={index}>
          <Marker {...marker} />
        </div>
      ))}
    </div>
  );
};

export default LocationMarkers;
