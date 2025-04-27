
import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PropertyMapDisplayProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  isLoaded: boolean;
  weatherTemp: string;
  isAnalyzing: boolean;
  view: 'satellite' | 'map';
  showError?: boolean;
}

const PropertyMapDisplay: React.FC<PropertyMapDisplayProps> = ({
  mapContainerRef,
  isLoaded,
  weatherTemp,
  isAnalyzing,
  view,
  showError = false,
}) => {
  return (
    <motion.div
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-md border border-gray-200"
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent" />
        </div>
      )}
      {isLoaded && (
        <>
          <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full p-2 flex items-center justify-center">
            <span className="text-yellow-300 mr-1">☀</span>{weatherTemp}
          </div>
          <div className="absolute top-4 left-4 bg-tiptop-accent/90 text-white rounded-lg px-3 py-1 text-xs font-bold shadow-lg">
            {isAnalyzing ? 'Analyzing Property...' : view === 'satellite' ? 'Satellite View' : 'Map View'}
          </div>
          
          {showError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-10">
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to generate 3D model.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default PropertyMapDisplay;
