
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
      className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#8B5CF6]" />
        </div>
      )}
      
      {isLoaded && (
        <>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-sm text-white rounded-full py-1 px-2 sm:px-3 flex items-center justify-center shadow-md">
            <Sun className="text-yellow-500 mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
            <span className="text-xs sm:text-sm font-medium">{weatherTemp}</span>
          </div>
          
          <motion.div 
            className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${isAnalyzing ? 'bg-[#8B5CF6]/90' : 'bg-green-500/80'} backdrop-blur-sm text-white rounded-lg px-2 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold shadow-lg flex items-center`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-pulse mr-1 sm:mr-2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            ) : (
              <>
                <div className="mr-1 sm:mr-2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            )}
          </motion.div>
          
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="px-1 sm:px-2 py-1 text-xs text-white/80 flex items-center gap-0.5 sm:gap-1">
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_42x16dp.png" alt="Google" className="h-3 sm:h-4" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PropertyMapDisplay;
