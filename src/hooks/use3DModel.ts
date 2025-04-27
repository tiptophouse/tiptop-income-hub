
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { checkModelStatus, getModelDownloadUrl } from '@/utils/meshyApi';

export const use3DModel = (jobId: string) => {
  const [modelStatus, setModelStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
        const status = await checkModelStatus(jobId);
        
        if (status.state === 'completed') {
          console.log("Model generation completed. Getting download URL...");
          const url = await getModelDownloadUrl(jobId);
          setModelUrl(url);
          setModelStatus("completed");
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
        } else if (checkCount < 10) {
          // Still processing, schedule another check
          console.log("Model still processing. Scheduling another check...");
          setTimeout(() => {
            setCheckCount(prevCount => prevCount + 1);
          }, 5000);
        } else {
          console.error("Model processing timeout");
          setModelStatus("failed");
          setError("Model processing timeout");
          
          // Use demo model as fallback after timeout
          console.log("Using demo model as fallback after timeout");
          setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
          setModelStatus("completed");
          
          toast({
            title: "Processing Timeout",
            description: "3D model processing took too long. Using demo model instead.",
            variant: "destructive",
          });
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
  };

  return {
    modelStatus,
    modelUrl,
    isLoading,
    error,
    handleRefresh
  };
};
