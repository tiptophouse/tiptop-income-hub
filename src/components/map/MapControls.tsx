
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Satellite, Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  view: 'satellite' | 'map';
  onToggleView: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ view, onToggleView }) => {
  return (
    <>
      <motion.div 
        className="absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-4 flex flex-col gap-1 sm:gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button 
          onClick={onToggleView}
          className="map-control-button"
          title={view === 'satellite' ? 'Switch to Map View' : 'Switch to Satellite View'}
        >
          {view === 'satellite' ? 
            <Map size={14} className="sm:h-4 sm:w-4 md:h-5 md:w-5" /> : 
            <Satellite size={14} className="sm:h-4 sm:w-4 md:h-5 md:w-5" />
          }
        </button>
      </motion.div>
      
      <motion.div
        className="zoom-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button className="zoom-button" title="Zoom In">
          <Plus size={14} className="sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>
        <div className="border-t border-white/20"></div>
        <button className="zoom-button" title="Zoom Out">
          <Minus size={14} className="sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>
      </motion.div>
    </>
  );
};

export default MapControls;
