
import { useState, useEffect } from 'react';
import { checkModelStatus, getModelDownloadUrl, startPeriodicStatusCheck } from '@/utils/api/modelStatus';

type ModelStatus = 'loading' | 'processing' | 'completed' | 'failed';

// Sample model URL as fallback
const SAMPLE_MODEL_URL = "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb";
// House model URL for demo purposes
const HOUSE_MODEL_URL = "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf";

export const use3DModel = (jobId: string) => {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing model...');
  const [progress, setProgress] = useState<number>(0);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;
    
    console.log("use3DModel: Initializing with jobId:", jobId);
    
    // Function to fetch model status
    const fetchModelStatus = async () => {
      try {
        if (!jobId) {
          setIsLoading(false);
          return;
        }

        // Update progress based on time passed (estimated 5 minute completion time)
        const now = new Date();
        const elapsedTime = (now.getTime() - lastCheckTime.getTime()) / 1000; // in seconds
        const estimatedTotalTime = 300; // 5 minutes in seconds
        let newProgress = Math.min(95, (elapsedTime / estimatedTotalTime) * 100);
        
        setStatusMessage('Checking model status...');
        const status = await checkModelStatus(jobId);
        setLastCheckTime(new Date());

        console.log("use3DModel: Model status check result:", status);

        if (!isMounted) return;

        if (status.state === 'processing') {
          setModelStatus('processing');
          setStatusMessage('Building 3D model... This can take up to 5 minutes.');
          setProgress(Math.min(newProgress, 95));
          
          // Check again in 30 seconds
          timer = setTimeout(fetchModelStatus, 30000);
        } else if (status.state === 'completed') {
          setModelStatus('completed');
          setStatusMessage('3D model ready!');
          setProgress(100);
          
          try {
            console.log("use3DModel: Getting model download URL for jobId:", jobId);
            const url = await getModelDownloadUrl(jobId);
            if (isMounted) {
              console.log("use3DModel: Model URL retrieved:", url);
              setModelUrl(url);
              setIsLoading(false);
            }
          } catch (urlError) {
            if (isMounted) {
              console.error("use3DModel: Error getting URL:", urlError);
              // Use house model as fallback
              setModelUrl(HOUSE_MODEL_URL);
              setError(urlError instanceof Error ? urlError : new Error('Failed to get model URL'));
              setIsLoading(false);
            }
          }
        } else if (status.state === 'failed') {
          setModelStatus('failed');
          setStatusMessage('Model generation failed.');
          setError(new Error('Model generation failed'));
          // Use house model as fallback
          setModelUrl(HOUSE_MODEL_URL);
          setIsLoading(false);
        } else {
          // Unknown state, treat as processing
          setModelStatus('processing');
          setStatusMessage(`Processing model (${status.state || 'unknown'})...`);
          setProgress(Math.min(newProgress, 90));
          
          // Check again in 30 seconds
          timer = setTimeout(fetchModelStatus, 30000);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching 3D model status:", error);
        
        // For demo models or errors, show house model
        if (jobId.startsWith('demo-')) {
          setModelStatus('completed');
          setStatusMessage('Demo model ready!');
          setProgress(100);
          setModelUrl(HOUSE_MODEL_URL);
          setIsLoading(false);
        } else {
          setError(error instanceof Error ? error : new Error('Failed to get model status'));
          setModelStatus('failed');
          setModelUrl(HOUSE_MODEL_URL);
          setIsLoading(false);
        }
      }
    };

    fetchModelStatus();
    
    // Listen for model completed events from the periodic checker
    const handleModelCompleted = (event: CustomEvent) => {
      if (event.detail && event.detail.jobId === jobId) {
        console.log("use3DModel: Received modelCompleted event:", event.detail);
        setModelStatus('completed');
        setStatusMessage('3D model ready!');
        setProgress(100);
        setModelUrl(event.detail.modelUrl || HOUSE_MODEL_URL);
        setIsLoading(false);
      }
    };
    
    document.addEventListener('modelCompleted', handleModelCompleted as EventListener);
    
    // Start periodic status checking when this hook is used
    const stopStatusCheck = startPeriodicStatusCheck();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener('modelCompleted', handleModelCompleted as EventListener);
      stopStatusCheck();
    };
  }, [jobId, lastCheckTime]);

  // Function to manually refresh the model status
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setStatusMessage('Refreshing model status...');
    try {
      console.log("use3DModel: Refreshing model for jobId:", jobId);
      const url = await getModelDownloadUrl(jobId);
      setModelUrl(url);
      setModelStatus('completed');
      setStatusMessage('3D model ready!');
      setProgress(100);
    } catch (error) {
      console.error("use3DModel: Refresh error:", error);
      setError(error instanceof Error ? error : new Error('Failed to refresh model'));
      setModelStatus('failed');
      // Use house model as fallback
      setModelUrl(HOUSE_MODEL_URL);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    modelStatus,
    modelUrl,
    isLoading,
    error,
    statusMessage,
    progress,
    handleRefresh,
  };
};
