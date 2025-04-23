
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

  const { mapInstance, isLoaded } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    onZoomComplete
  });

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  const captureMapImage = async (): Promise<string> => {
    try {
      if (!mapContainerRef.current) {
        throw new Error("Map container not found");
      }
      const canvas = await html2canvas(mapContainerRef.current);
      const imageData = canvas.toDataURL('image/png');
      console.log("Map image captured successfully");
      return imageData;
    } catch (error) {
      console.error("Error capturing map image:", error);
      throw error;
    }
  };

  const sendToWebhook = async (imageData: string) => {
    try {
      const response = await fetch('https://hook.eu1.make.com/dcb3jxlcvxsw55vnwiwjme7gu7pcjvq7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Required for cross-origin requests
        body: JSON.stringify({
          address: address,
          timestamp: new Date().toISOString(),
          satelliteImage: imageData,
          origin: window.location.origin,
        }),
      });

      console.log("Data sent to webhook successfully");
      toast({
        title: "Success",
        description: "Property information sent for processing",
      });
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast({
        title: "Warning",
        description: "Continuing with 3D generation, but couldn't send property data",
        variant: "destructive"
      });
    }
  };

  const generate3DModel = async () => {
    if (is3DModelGenerating) return;
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Capturing property view...",
      });
      
      const imageData = await captureMapImage();
      
      // Send to webhook before starting 3D generation
      await sendToWebhook(imageData);
      
      toast({
        title: "Processing",
        description: "Generating 3D model from satellite imagery...",
      });

      // Try to generate model via API
      let jobId;
      try {
        jobId = await generateModelFromImage(imageData);
        console.log("3D model generation job created:", jobId);
      } catch (error) {
        console.error("Error from Meshy API:", error);
        jobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
        
        toast({
          title: "Using Sample Model",
          description: "We encountered an issue with the 3D model service. Showing a sample model instead.",
        });
      }
      
      setModelJobId(jobId);
      
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId }
      });
      document.dispatchEvent(modelEvent);

    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      
      toast({
        title: "Error",
        description: "Failed to process the property view. Please try again later.",
        variant: "destructive"
      });
      
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      setModelJobId(fallbackId);
      
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
            onGenerate3DModel={generate3DModel}
            isGenerating={is3DModelGenerating}
          />
          <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full p-2 flex items-center justify-center">
            <span className="text-yellow-300 mr-1">☀</span>{weatherTemp}
          </div>
          <div className="absolute top-4 left-4 bg-tiptop-accent/90 text-white rounded-lg px-3 py-1 text-xs font-bold shadow-lg">
            3D View Active
          </div>
        </>
      )}
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
    </motion.div>
  );
};

export default PropertyMap;
