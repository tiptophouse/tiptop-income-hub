
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!jobId) return;

    const initializeModel = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing 3D model with job ID:", jobId);
        
        // For demo jobs or if we already have the URL, skip API calls
        if (jobId.startsWith('demo-')) {
          console.log("Using demo model");
          await simulateProgressWithDelay(5000);
          setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
          setModelStatus("completed");
          setIsLoading(false);
          setProgress(100);
          return;
        }
        
        // For real jobs, check status with the API
        console.log("Checking model status for job:", jobId);
        setStatusMessage(`Checking model generation status (Attempt ${checkCount + 1})...`);
        const status = await checkModelStatus(jobId);
        
        if (status.state === 'completed') {
          console.log("Model generation completed. Getting download URL...");
          setStatusMessage("Model completed! Loading 3D view...");
          setProgress(95);
          const url = await getModelDownloadUrl(jobId);
          setModelUrl(url);
          setModelStatus("completed");
          setProgress(100);
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
          await simulateProgressWithDelay(1000);
          setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
          setModelStatus("completed");
          setProgress(100);
        } else {
          // Still processing, schedule another check with exponential backoff
          console.log("Model still processing. Scheduling another check...");
          const backoffTime = Math.min(5000 * Math.pow(1.5, checkCount), 30000); // Max 30 seconds
          const progressIncrement = Math.min(10 + (checkCount * 5), 20); // Increase progress with each check
          setProgress(Math.min(progress + progressIncrement, 90)); // Cap at 90% until complete
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
        await simulateProgressWithDelay(1000);
        setModelUrl("https://storage.googleapis.com/realestate-3d-models/demo-property.glb");
        setModelStatus("completed");
        setProgress(100);
        
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
  }, [jobId, checkCount, progress]);

  // Helper function to simulate progress with delay for demo models
  const simulateProgressWithDelay = async (totalTime: number) => {
    const startProgress = progress;
    const targetProgress = 95;
    const steps = 10;
    const stepTime = totalTime / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepTime));
      const newProgress = startProgress + ((targetProgress - startProgress) * (i + 1)) / steps;
      setProgress(Math.min(newProgress, 95));
      setStatusMessage(`Processing 3D model... ${Math.round(newProgress)}%`);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setModelStatus("processing");
    setCheckCount(0);
    setError(null);
    setProgress(0);
    setStatusMessage("Refreshing 3D model...");
  };

  return {
    modelStatus,
    modelUrl,
    isLoading,
    error,
    statusMessage,
    progress,
    handleRefresh
  };
};
