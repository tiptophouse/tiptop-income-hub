
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
        className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2"
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
            <Map size={16} className="sm:h-5 sm:w-5" /> : 
            <Satellite size={16} className="sm:h-5 sm:w-5" />
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
          <Plus size={16} className="sm:h-5 sm:w-5" />
        </button>
        <div className="border-t border-white/20"></div>
        <button className="zoom-button" title="Zoom Out">
          <Minus size={16} className="sm:h-5 sm:w-5" />
        </button>
      </motion.div>
    </>
  );
};

export default MapControls;
