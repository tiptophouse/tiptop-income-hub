import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import html2canvas from 'html2canvas';
import { getWebhookUrl } from '@/utils/webhookConfig';
import { getStreetViewImageUrl, checkStreetViewAvailability } from '@/utils/streetViewService';

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
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(12);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasExecutedZoom = useRef(false);
  const screenshotCaptured = useRef(false);

  const { mapInstance, isLoaded, zoomMap } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    initialZoom: 12,
    onZoomComplete: () => {
      console.log("Map initial loading complete");
    }
  });

  useEffect(() => {
    if (!isLoaded || !mapInstance || !isAnalyzing || hasExecutedZoom.current) return;
    
    console.log("Starting property analysis timer");
    
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }
    
    if (zoomTimerRef.current) {
      clearTimeout(zoomTimerRef.current);
    }
    
    analysisTimerRef.current = setTimeout(() => {
      console.log("Analysis complete, preparing to zoom");
      setIsAnalyzing(false);
      
      zoomTimerRef.current = setTimeout(() => {
        console.log("Executing zoom to level 18");
        
        hasExecutedZoom.current = true;
        
        const success = zoomMap(18);
        
        if (success) {
          setCurrentZoomLevel(18);
          console.log("Zoom operation initiated to level 18");
          
          setTimeout(() => {
            if (onZoomComplete) {
              onZoomComplete();
            }
            
            if (!screenshotCaptured.current) {
              captureAndSendPropertyScreenshot();
            }
          }, 1500);
        } else {
          console.error("Zoom operation failed");
          if (mapInstance) {
            try {
              console.log("Attempting direct zoom to level 18");
              mapInstance.setZoom(18);
              setCurrentZoomLevel(18);
              
              setTimeout(() => {
                if (!screenshotCaptured.current) {
                  captureAndSendPropertyScreenshot();
                }
              }, 1500);
            } catch (e) {
              console.error("Direct zoom failed:", e);
            }
          }
        }
      }, 500);
    }, 3000);
    
    return () => {
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
      if (zoomTimerRef.current) {
        clearTimeout(zoomTimerRef.current);
      }
    };
  }, [isLoaded, mapInstance, isAnalyzing, onZoomComplete, zoomMap]);

  useEffect(() => {
    if (!mapInstance) return;
    
    const zoomListener = mapInstance.addListener('zoom_changed', () => {
      const newZoom = mapInstance.getZoom();
      console.log(`Map zoom changed to: ${newZoom}`);
      setCurrentZoomLevel(newZoom);
    });
    
    return () => {
      if (window.google && window.google.maps && zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [mapInstance]);

  useEffect(() => {
    if (mapInstance && !isAnalyzing && currentZoomLevel < 18 && !hasExecutedZoom.current) {
      console.log("Backup zoom mechanism triggered, current zoom:", currentZoomLevel);
      hasExecutedZoom.current = true;
      
      try {
        console.log("Forcing zoom to level 18");
        mapInstance.setZoom(18);
        setCurrentZoomLevel(18);
      } catch (e) {
        console.error("Backup zoom failed:", e);
      }
    }
  }, [mapInstance, isAnalyzing, currentZoomLevel]);

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

  const captureAndSendPropertyScreenshot = async () => {
    try {
      console.log("Capturing property screenshot...");
      screenshotCaptured.current = true;
      
      const webhookUrl = getWebhookUrl();
      if (!webhookUrl) {
        console.log("No webhook URL configured, skipping screenshot sending");
        return;
      }

      let imageData = null;
      if (mapInstance) {
        const center = mapInstance.getCenter();
        const location = {
          lat: center.lat(),
          lng: center.lng()
        };

        const hasStreetView = await checkStreetViewAvailability(location);
        
        if (hasStreetView) {
          const streetViewUrl = getStreetViewImageUrl(address);
          console.log("Using Street View image:", streetViewUrl);
          
          try {
            const response = await fetch(streetViewUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            
            imageData = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("Error fetching Street View image:", error);
          }
        }
      }

      if (!imageData) {
        console.log("Falling back to map screenshot");
        imageData = await captureMapImage();
      }
      
      console.log("Sending property image to webhook:", webhookUrl);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: address,
          image: imageData,
          timestamp: new Date().toISOString(),
          source: "TipTop Property Analysis"
        }),
        mode: "no-cors"
      });
      
      console.log("Property image sent to webhook successfully");
      
      toast({
        title: "Property Captured",
        description: "Property image has been sent for 3D model generation",
      });
    } catch (error) {
      console.error("Error sending property image to webhook:", error);
      
      toast({
        title: "Screenshot Error",
        description: "Failed to capture or send property image",
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
      
      toast({
        title: "Processing",
        description: "Generating 3D model from satellite imagery...",
      });

      try {
        const jobId = await generateModelFromImage(imageData);
        console.log("3D model generation job created:", jobId);
        setModelJobId(jobId);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Success",
          description: "3D model generation started! It may take a few minutes to complete.",
        });
      } catch (error) {
        console.error("Error calling Meshy API:", error);
        
        const demoJobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
        setModelJobId(demoJobId);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId: demoJobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Using Demo Model",
          description: "We encountered an issue with the 3D model API. Showing a demo model instead.",
        });
      }
    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again later.",
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
            {isAnalyzing ? 'Analyzing Property...' : view === 'satellite' ? 'Satellite View' : 'Map View'}
          </div>
        </>
      )}
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
    </motion.div>
  );
};

export default PropertyMap;
