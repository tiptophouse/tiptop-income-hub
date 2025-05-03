
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Satellite, Layers } from 'lucide-react';

interface MapControlsProps {
  view: 'satellite' | 'map';
  onToggleView: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ view, onToggleView }) => {
  return (
    <motion.div 
      className="absolute top-4 right-4 flex flex-col gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <button 
        onClick={onToggleView}
        className="map-control-button"
        title={view === 'satellite' ? 'Switch to Map View' : 'Switch to Satellite View'}
      >
        {view === 'satellite' ? <Map size={18} /> : <Satellite size={18} />}
      </button>
      
      <button 
        className="map-control-button"
        title="Layer Options"
      >
        <Layers size={18} />
      </button>
    </motion.div>
  );
};

export default MapControls;
