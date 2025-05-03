
import React, { useState, useEffect } from 'react';
import { Building, Play, Pause, ZoomIn, ZoomOut, RefreshCw, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { checkModelStatus, getModelDownloadUrl } from '@/utils/api/modelStatus';
import ModelViewerScript from '@/components/ModelViewerScript';
import { toast } from '@/components/ui/use-toast';
import { generatePropertyModels } from '@/utils/modelGeneration';
import { supabase } from '@/integrations/supabase/client';

const Property3DModelCard = () => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    // Load the model-viewer Web Component
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    script.onload = () => setModelViewerLoaded(true);
    document.head.appendChild(script);
    
    // Get the property address from user metadata
    const getPropertyAddress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.propertyAddress) {
        setPropertyAddress(user.user_metadata.propertyAddress);
      }
    };
    
    getPropertyAddress();

    // Check for any existing model job ID
    const storedJobId = localStorage.getItem('meshy_latest_job_id');
    if (storedJobId) {
      setJobId(storedJobId);
      loadModel(storedJobId);
    }

    const handleModelCreated = (event: CustomEvent) => {
      if (event.detail?.jobId) {
        console.log("Model created event received:", event.detail);
        setJobId(event.detail.jobId);
        loadModel(event.detail.jobId);
      }
    };

    document.addEventListener('modelJobCreated', handleModelCreated as EventListener);
    return () => {
      document.removeEventListener('modelJobCreated', handleModelCreated as EventListener);
    };
  }, []);

  const loadModel = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Loading model for job ID:", id);
      // First check the status
      const status = await checkModelStatus(id);
      console.log("Model status:", status);
      
      if (status.state === 'completed') {
        const url = await getModelDownloadUrl(id);
        console.log("Model URL:", url);
        setModelUrl(url);
        toast({
          title: "3D Model Ready",
          description: "Your property's 3D model is now available to view."
        });
      } else {
        // If not completed, set a timeout to check again
        console.log("Model not ready yet, will check again in 30 seconds...");
        setTimeout(() => loadModel(id), 30000); // Check every 30 seconds
      }
    } catch (error) {
      console.error("Error loading model:", error);
      // Use a default model URL for demonstration
      setModelUrl("https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (jobId) {
      loadModel(jobId);
    }
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 50));
  };
  
  const generateNewModel = async () => {
    if (!propertyAddress || isGenerating) return;
    
    setIsGenerating(true);
    try {
      toast({
        title: "Generating 3D Model",
        description: `Creating 3D model for ${propertyAddress}`
      });
      
      const jobId = await generatePropertyModels(propertyAddress);
      console.log("New 3D model generation initiated with job ID:", jobId);
    } catch (error) {
      console.error("Error generating model:", error);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Load the ModelViewer Web Component */}
      <ModelViewerScript />
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center text-violet-400 mb-1">
            <Building className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg font-medium">Property 3D Model</CardTitle>
          </div>
          <CardDescription className="text-gray-600 flex justify-between">
            <span>Interactive 3D view of your property</span>
            {!modelUrl && !isLoading && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateNewModel}
                disabled={isGenerating || !propertyAddress}
                className="ml-2 text-xs"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-3 w-3 mr-1 animate-spin" />
                    Generating
                  </>
                ) : "Generate 3D Model"}
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="w-full overflow-hidden rounded-lg bg-gray-50 aspect-video">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-400" />
              </div>
            ) : modelUrl && modelViewerLoaded ? (
              <model-viewer
                src={modelUrl}
                alt="3D model of property"
                shadow-intensity="1"
                camera-controls
                auto-rotate={isPlaying}
                camera-orbit={`0deg 75deg ${zoomLevel}%`}
                style={{ width: "100%", height: "100%" }}
              ></model-viewer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <Building className="h-16 w-16 text-gray-300 mb-2" />
                <p className="text-gray-500">No 3D model available yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  {propertyAddress ? 
                    "Click 'Generate 3D Model' above to create a model" : 
                    "Add your property address in the Property Overview section"}
                </p>
              </div>
            )}
          </div>
          {modelUrl && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-gray-700"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Rotate</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700" 
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700" 
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-gray-700"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
          {jobId && !modelUrl && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">
                3D model generation in progress...
                <span className="block text-xs mt-1">Job ID: {jobId.substring(0, 8)}...</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Property3DModelCard;
