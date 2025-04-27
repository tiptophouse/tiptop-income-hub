
import { useState, useEffect } from 'react';
import { checkModelStatus, getModelDownloadUrl, startPeriodicStatusCheck } from '@/utils/api/modelStatus';

type ModelStatus = 'loading' | 'processing' | 'completed' | 'failed';

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
            const url = await getModelDownloadUrl(jobId);
            if (isMounted) {
              setModelUrl(url);
              setIsLoading(false);
            }
          } catch (urlError) {
            if (isMounted) {
              setError(urlError instanceof Error ? urlError : new Error('Failed to get model URL'));
              setIsLoading(false);
            }
          }
        } else if (status.state === 'failed') {
          setModelStatus('failed');
          setStatusMessage('Model generation failed.');
          setError(new Error('Model generation failed'));
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
        
        // For demo models, treat any error as completed
        if (jobId.startsWith('demo-')) {
          setModelStatus('completed');
          setStatusMessage('Demo model ready!');
          setProgress(100);
          setModelUrl(null);  // Will use sample model in getModelDownloadUrl
          setIsLoading(false);
        } else {
          setError(error instanceof Error ? error : new Error('Failed to get model status'));
          setModelStatus('failed');
          setIsLoading(false);
        }
      }
    };

    fetchModelStatus();
    
    // Listen for model completed events from the periodic checker
    const handleModelCompleted = (event: CustomEvent) => {
      if (event.detail && event.detail.jobId === jobId) {
        setModelStatus('completed');
        setStatusMessage('3D model ready!');
        setProgress(100);
        setModelUrl(event.detail.modelUrl || null);
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
  }, [jobId]);

  // Function to manually refresh the model status
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setStatusMessage('Refreshing model status...');
    try {
      const url = await getModelDownloadUrl(jobId);
      setModelUrl(url);
      setModelStatus('completed');
      setStatusMessage('3D model ready!');
      setProgress(100);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to refresh model'));
      setModelStatus('failed');
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
