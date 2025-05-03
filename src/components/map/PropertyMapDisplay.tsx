
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
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
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
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-[#8B5CF6]" />
        </div>
      )}
      
      {isLoaded && (
        <>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur-sm text-white rounded-full py-0.5 px-1.5 sm:py-1 sm:px-2 md:px-3 flex items-center justify-center shadow-md">
            <Sun className="text-yellow-500 mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 md:mr-1.5" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium">{weatherTemp}</span>
          </div>
          
          <motion.div 
            className={`absolute top-2 sm:top-3 left-2 sm:left-3 md:top-4 md:left-4 ${isAnalyzing ? 'bg-[#8B5CF6]/90' : 'bg-green-500/80'} backdrop-blur-sm text-white rounded-lg px-1.5 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg flex items-center`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-pulse mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            ) : (
              <>
                <div className="mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 rounded-full bg-white"></div>
                {analysisText}
              </>
            )}
          </motion.div>
          
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="px-0.5 sm:px-1 md:px-2 py-0.5 text-[8px] sm:text-[10px] md:text-xs text-white/80 flex items-center gap-0.5 sm:gap-1">
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_42x16dp.png" alt="Google" className="h-2 sm:h-2.5 md:h-4" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PropertyMapDisplay;
