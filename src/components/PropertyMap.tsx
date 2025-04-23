
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import html2canvas from 'html2canvas';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  const [weatherTemp, setWeatherTemp] = useState<string>("26°");
  const [tiltAngle, setTiltAngle] = useState(45);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [captureProgress, setCaptureProgress] = useState(0);

  const { mapInstance, isLoaded } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    onZoomComplete
  });

  // Add effect for enhanced 3D tilt and rotation
  useEffect(() => {
    if (!mapInstance) return;
    
    // Slowly increase tilt for more dynamic 3D effect
    const tiltInterval = setInterval(() => {
      setTiltAngle(prev => {
        const newTilt = (prev + 0.5) % 60;
        if (mapInstance) {
          mapInstance.setOptions({ tilt: newTilt > 0 ? newTilt : 1 });
        }
        return newTilt;
      });
    }, 500);
    
    // Slowly rotate heading for dynamic view
    const rotateInterval = setInterval(() => {
      setRotationAngle(prev => {
        const newRotation = (prev + 0.3) % 360;
        if (mapInstance) {
          mapInstance.setOptions({ heading: newRotation });
        }
        return newRotation;
      });
    }, 800);
    
    return () => {
      clearInterval(tiltInterval);
      clearInterval(rotateInterval);
    };
  }, [mapInstance]);

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  // Capture map image at current angle
  const captureMapImage = async (): Promise<string> => {
    try {
      if (!mapContainerRef.current) {
        throw new Error("Map container not found");
      }

      // Use html2canvas to capture the map container
      const canvas = await html2canvas(mapContainerRef.current);
      const imageData = canvas.toDataURL('image/png');
      console.log("Map image captured successfully");
      return imageData;
    } catch (error) {
      console.error("Error capturing map image:", error);
      throw error;
    }
  };

  // Capture multiple angles of the property
  const captureMultipleAngles = async (): Promise<string[]> => {
    if (!mapInstance) return [];
    
    const capturedImages: string[] = [];
    const totalAngles = 4;
    
    // Store original map settings to restore later
    const originalHeading = mapInstance.getHeading();
    const originalTilt = mapInstance.getTilt();
    
    try {
      // Capture front view (0 degrees)
      mapInstance.setOptions({ heading: 0, tilt: 45 });
      setCaptureProgress(25);
      await new Promise(resolve => setTimeout(resolve, 500));
      const frontImage = await captureMapImage();
      capturedImages.push(frontImage);
      
      // Capture side view (90 degrees)
      mapInstance.setOptions({ heading: 90, tilt: 45 });
      setCaptureProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));
      const sideImage = await captureMapImage();
      capturedImages.push(sideImage);
      
      // Capture rear view (180 degrees)
      mapInstance.setOptions({ heading: 180, tilt: 45 });
      setCaptureProgress(75);
      await new Promise(resolve => setTimeout(resolve, 500));
      const rearImage = await captureMapImage();
      capturedImages.push(rearImage);
      
      // Capture top-down view
      mapInstance.setOptions({ heading: 0, tilt: 0 });
      setCaptureProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      const topImage = await captureMapImage();
      capturedImages.push(topImage);
      
      return capturedImages;
    } catch (error) {
      console.error("Error capturing multiple angles:", error);
      return capturedImages.length > 0 ? capturedImages : [];
    } finally {
      // Restore original map settings
      mapInstance.setOptions({ heading: originalHeading, tilt: originalTilt });
      setCaptureProgress(0);
    }
  };

  const generateHouse3DModel = async () => {
    if (!isLoaded || is3DModelGenerating) return;
    
    try {
      setIs3DModelGenerating(true);
      toast({
        title: "Processing",
        description: "Capturing property from multiple angles...",
      });
      
      // Capture property from multiple angles
      const images = await captureMultipleAngles();
      
      if (images.length === 0) {
        throw new Error("Failed to capture any property images");
      }
      
      toast({
        title: "Processing",
        description: `Sending ${images.length} images to generate 3D model...`,
      });
      
      // Use the best image for 3D model generation
      // In a production app, you could send all images to Meshy if their API supports it
      const bestImage = images[0]; // Front view is usually best for house modeling
      
      console.log("Sending image to Meshy API for 3D model generation");
      const jobId = await generateModelFromImage(bestImage);
      console.log("3D model generation job created:", jobId);
      
      setModelJobId(jobId);
      
      // Dispatch event so other components can use the job ID
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId }
      });
      document.dispatchEvent(modelEvent);
      
      toast({
        title: "Success",
        description: "3D model generation started. This may take a few minutes to complete.",
      });
    } catch (error) {
      console.error("Error generating 3D model:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again later.",
        variant: "destructive"
      });
      
      // Since API failed, let's provide a fallback ID for demo purposes
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      setModelJobId(fallbackId);
      
      // Dispatch event with fallback ID
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId: fallbackId }
      });
      document.dispatchEvent(modelEvent);
    } finally {
      setIs3DModelGenerating(false);
    }
  };

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
          <MapControls
            view={view}
            onToggleView={toggleMapType}
            onGenerate3DModel={generateHouse3DModel}
            isGenerating={is3DModelGenerating}
          />
          
          {/* Weather display similar to the reference image */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full p-2 flex items-center justify-center">
            <span className="text-yellow-300 mr-1">☀</span>{weatherTemp}
          </div>
          
          {/* 3D Info badge */}
          <div className="absolute top-4 left-4 bg-tiptop-accent/90 text-white rounded-lg px-3 py-1 text-xs font-bold shadow-lg">
            3D View Active
          </div>
          
          {/* Capture progress indicator */}
          {captureProgress > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white rounded-lg p-4 text-center">
              <div className="mb-2">Capturing property...</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-tiptop-accent h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${captureProgress}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs">{captureProgress}%</div>
            </div>
          )}
        </>
      )}
      
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
    </motion.div>
  );
};

export default PropertyMap;
