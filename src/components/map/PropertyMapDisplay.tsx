
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sun } from 'lucide-react';

interface PropertyMapDisplayProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  isLoaded: boolean;
  weatherTemp: string;
  isAnalyzing: boolean;
  analysisText: string;
  view: 'satellite' | 'map';
}

const PropertyMapDisplay: React.FC<PropertyMapDisplayProps> = ({
  mapContainerRef,
  isLoaded,
  weatherTemp,
  isAnalyzing,
  analysisText,
  view,
}) => {
  return (
    <motion.div
      className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-lg border border-[#E5DEFF]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]" />
        </div>
      )}
      {isLoaded && (
        <>
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-[#552B1B] rounded-full py-1 px-3 flex items-center justify-center shadow-md">
            <Sun className="text-yellow-500 mr-1.5" size={16} />
            <span className="text-sm font-medium">{weatherTemp}</span>
          </div>
          <motion.div 
            className={`absolute top-4 left-4 ${isAnalyzing ? 'bg-[#8B5CF6]/90' : 'bg-green-500/80'} backdrop-blur-sm text-white rounded-lg px-4 py-1.5 text-xs font-semibold shadow-lg flex items-center`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-pulse mr-2 h-2 w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            ) : (
              <>
                <div className="mr-2 h-2 w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default PropertyMapDisplay;
