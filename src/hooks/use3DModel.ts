
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { checkModelStatus, getModelDownloadUrl } from '@/utils/meshyApi';

export const use3DModel = (jobId: string) => {
  const [modelStatus, setModelStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Initializing 3D model...");

  useEffect(() => {
    if (!jobId) return;

    const initializeModel = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing 3D model with job ID:", jobId);
        
        // For demo jobs or if we already have the URL, skip API calls
        if (jobId.startsWith('demo-')) {
          console.log("Using demo model");
          await new Promise(resolve => setTimeout(resolve, 2000));
          setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
          setModelStatus("completed");
          setIsLoading(false);
          return;
        }
        
        // For real jobs, check status with the API
        console.log("Checking model status for job:", jobId);
        setStatusMessage(`Checking model generation status (Attempt ${checkCount + 1})...`);
        const status = await checkModelStatus(jobId);
        
        if (status.state === 'completed') {
          console.log("Model generation completed. Getting download URL...");
          setStatusMessage("Model completed! Loading 3D view...");
          const url = await getModelDownloadUrl(jobId);
          setModelUrl(url);
          setModelStatus("completed");
          toast({
            title: "3D Model Ready",
            description: "Your property's 3D model is now ready to view.",
          });
        } else if (status.state === 'failed') {
          console.error("Model generation failed");
          setModelStatus("failed");
          setError("Model generation failed");
          toast({
            title: "3D Model Failed",
            description: "Could not generate the 3D model. Using demo model instead.",
            variant: "destructive",
          });
          
          // Use demo model as fallback
          setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
          setModelStatus("completed");
        } else {
          // Still processing, schedule another check with exponential backoff
          console.log("Model still processing. Scheduling another check...");
          const backoffTime = Math.min(5000 * Math.pow(1.5, checkCount), 30000); // Max 30 seconds
          setStatusMessage(`Model generation in progress... (${Math.round(backoffTime/1000)}s until next update)`);
          
          setTimeout(() => {
            setCheckCount(prevCount => prevCount + 1);
          }, backoffTime);
        }
      } catch (error) {
        console.error("Error checking 3D model status:", error);
        setModelStatus("failed");
        setError(error instanceof Error ? error.message : "Unknown error");
        
        // Use demo model as fallback
        console.log("Using demo model as fallback due to error");
        setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
        setModelStatus("completed");
        
        toast({
          title: "Error",
          description: "Failed to check 3D model status. Using demo model instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeModel();
  }, [jobId, checkCount]);

  const handleRefresh = () => {
    setIsLoading(true);
    setModelStatus("processing");
    setCheckCount(0);
    setError(null);
    setStatusMessage("Refreshing 3D model...");
  };

  return {
    modelStatus,
    modelUrl,
    isLoading,
    error,
    statusMessage,
    handleRefresh
  };
};
