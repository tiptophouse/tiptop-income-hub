
import React, { useState, useEffect } from 'react';
import { Building, Play, Pause, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { checkModelStatus, getModelDownloadUrl } from '@/utils/meshyApi';

const Property3DModelCard = () => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    // Check for any existing model job ID
    const storedJobId = localStorage.getItem('meshy_latest_job_id');
    if (storedJobId) {
      setJobId(storedJobId);
      loadModel(storedJobId);
    }

    const handleModelCreated = (event: CustomEvent) => {
      if (event.detail?.jobId) {
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
      // First check the status
      const status = await checkModelStatus(id);
      if (status.state === 'completed') {
        const url = await getModelDownloadUrl(id);
        setModelUrl(url);
      } else {
        // If not completed, set a timeout to check again
        setTimeout(() => loadModel(id), 30000); // Check every 30 seconds
      }
    } catch (error) {
      console.error("Error loading model:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (jobId) {
      loadModel(jobId);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center text-violet-400 mb-1">
          <Building className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-medium">Property 3D Model</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          3D view of your property
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full overflow-hidden rounded-lg bg-gray-50 aspect-video">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-400" />
            </div>
          ) : modelUrl ? (
            <model-viewer
              src={modelUrl}
              alt="3D model of property"
              shadow-intensity="1"
              camera-controls
              auto-rotate={isPlaying}
              style={{ width: "100%", height: "100%" }}
            ></model-viewer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <Building className="h-16 w-16 text-gray-300 mb-2" />
              <p className="text-gray-500">No 3D model available yet</p>
              <p className="text-gray-400 text-sm">Use the Meshy API to generate a model</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-gray-700"
            disabled={!modelUrl}
          >
            {isPlaying ? (
              <><Pause className="h-4 w-4 mr-2" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-700" 
            disabled={!modelUrl}
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-700" 
            disabled={!modelUrl}
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
      </CardContent>
    </Card>
  );
};

export default Property3DModelCard;
