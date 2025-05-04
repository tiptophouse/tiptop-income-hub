
import { useState, useEffect } from 'react';
import { checkModelStatus, getModelDownloadUrl } from '@/utils/api/modelStatus';
import { getModelFromCache } from '@/utils/modelCache';

export type ModelQuality = 'low' | 'medium' | 'high';

interface ModelOptions {
  quality?: ModelQuality;
}

export const use3DModel = (jobId: string | null, options?: ModelOptions) => {
  const [modelStatus, setModelStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Initializing 3D model...');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('queue');
  const [quality, setQuality] = useState<ModelQuality>(options?.quality || 'medium');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  // Load model on jobId change
  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      setError('No model job ID provided');
      setModelStatus('failed');
      return;
    }

    const loadModel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Loading model for job ID:", jobId);
        
        // Check if we have a cached model first
        const cachedModel = getModelFromCache(jobId);
        if (cachedModel) {
          console.log("Found cached model:", cachedModel);
          setModelUrl(cachedModel.modelUrl);
          setModelStatus('completed');
          setProgress(100);
          setStage('finished');
          setStatusMessage('3D model loaded from cache');
          setIsLoading(false);
          return;
        }
        
        // If not cached, check the status
        const status = await checkModelStatus(jobId);
        console.log("Model status:", status);
        
        // Update UI based on status
        setProgress(status.progress || 0);
        setStage(status.stage || 'processing');
        
        // Set time remaining based on progress
        if (status.progress && status.progress < 100) {
          // Rough estimate: if we're at X% progress and it took Y seconds to get here,
          // then the remaining time is (100-X)/X * Y seconds
          const jobStartTime = localStorage.getItem('meshy_job_created_at');
          if (jobStartTime) {
            const startTime = new Date(jobStartTime).getTime();
            const currentTime = new Date().getTime();
            const elapsedSeconds = (currentTime - startTime) / 1000;
            
            if (status.progress > 0) {
              const estimatedTotal = elapsedSeconds * 100 / status.progress;
              const remaining = estimatedTotal - elapsedSeconds;
              setEstimatedTimeRemaining(Math.max(0, remaining));
            }
          }
        }
        
        if (status.state === 'completed') {
          // For completed models, get the URL
          const url = await getModelDownloadUrl(jobId);
          console.log("Model URL:", url);
          setModelUrl(url);
          setModelStatus('completed');
          setStatusMessage('3D model ready');
        } else {
          // Update status message based on stage
          setModelStatus('processing');
          switch (status.stage) {
            case 'queue':
              setStatusMessage('Queued for processing...');
              break;
            case 'processing':
              setStatusMessage('Processing property images...');
              break;
            case 'meshing':
              setStatusMessage('Creating 3D mesh structure...');
              break;
            case 'texturing':
              setStatusMessage('Applying textures and materials...');
              break;
            case 'finalizing':
              setStatusMessage('Finalizing 3D model...');
              break;
            default:
              setStatusMessage('Processing 3D model...');
          }
          
          // Set a timeout to check again
          const checkAgainTimeout = setTimeout(() => loadModel(), 15000); // Check every 15 seconds
          return () => clearTimeout(checkAgainTimeout);
        }
      } catch (error) {
        console.error("Error loading model:", error);
        setError(error instanceof Error ? error.message : 'Unknown error loading model');
        setModelStatus('failed');
        
        // Use a demo model URL for fallback
        setModelUrl("https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf");
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [jobId, quality]);

  // Function to manually refresh the model status
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Refreshing model status for job ID:", jobId);
      
      if (!jobId) {
        throw new Error("No job ID provided");
      }
      
      // Check the current status
      const status = await checkModelStatus(jobId);
      console.log("Refreshed model status:", status);
      
      // Update the UI based on status
      setProgress(status.progress || 0);
      
      if (status.state === 'completed') {
        const url = await getModelDownloadUrl(jobId);
        setModelUrl(url);
        setModelStatus('completed');
        setStatusMessage('3D model ready');
      } else {
        setModelStatus('processing');
        setStatusMessage('Processing 3D model...');
      }
    } catch (error) {
      console.error("Error refreshing model:", error);
      setError(error instanceof Error ? error.message : 'Unknown error refreshing model');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change quality settings
  const changeQuality = (newQuality: ModelQuality) => {
    if (quality !== newQuality) {
      setQuality(newQuality);
      // Quality change might require processing adjustments in a real implementation
      console.log(`Model quality changed to ${newQuality}`);
    }
  };

  return {
    modelStatus,
    modelUrl,
    isLoading,
    error,
    statusMessage,
    progress,
    stage,
    quality,
    estimatedTimeRemaining,
    changeQuality,
    handleRefresh
  };
};
