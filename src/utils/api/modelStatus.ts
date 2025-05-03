
/**
 * Model status checking and URL retrieval utilities
 */
import { MESHY_API_URL, MESHY_API_TOKEN } from './meshyConfig';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// House model URL as sample
export const SAMPLE_MODEL_URL = "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf";

// Status check interval in milliseconds (30 seconds)
const STATUS_CHECK_INTERVAL = 30 * 1000;

// Start the periodic status check for any pending jobs
let statusCheckInterval: number | null = null;

export const startPeriodicStatusCheck = () => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
  
  // Check immediately for any pending jobs
  checkPendingJobs();
  
  // Then set up the interval for regular checks
  statusCheckInterval = window.setInterval(checkPendingJobs, STATUS_CHECK_INTERVAL);
  console.log("Started periodic model status checks every 30 seconds");
  
  return () => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      statusCheckInterval = null;
    }
  };
};

const checkPendingJobs = async () => {
  try {
    // Check localStorage for any pending job
    const latestJobId = localStorage.getItem('meshy_latest_job_id');
    const jobCreatedAt = localStorage.getItem('meshy_job_created_at');
    const lastCheckedStatus = localStorage.getItem('meshy_last_status_' + latestJobId);
    const isDemo = localStorage.getItem('meshy_demo_model') === 'true';
    
    if (!latestJobId || isDemo || lastCheckedStatus === 'SUCCEEDED') {
      return;
    }
    
    console.log(`Checking status for job ${latestJobId} created at ${jobCreatedAt}`);
    const status = await checkModelStatus(latestJobId);
    
    // Store the latest status
    localStorage.setItem('meshy_last_status_' + latestJobId, status.state || 'unknown');
    
    if (status.state === 'completed') {
      // Get the model URL
      const modelUrl = await getModelDownloadUrl(latestJobId);
      
      // Dispatch event for any listening components
      const event = new CustomEvent('modelCompleted', {
        detail: {
          jobId: latestJobId,
          modelUrl: modelUrl
        }
      });
      document.dispatchEvent(event);
      
      console.log(`Model ${latestJobId} is completed with URL: ${modelUrl}`);
      
      // Show notification
      toast({
        title: "3D Model Ready",
        description: "Your property's 3D model is ready to view"
      });
    }
  } catch (error) {
    console.error("Error checking pending jobs:", error);
  }
};

export const checkModelStatus = async (jobId: string) => {
  try {
    console.log(`Checking status for model job ${jobId}`);
    
    // For demo models, return a fake "completed" status
    if (jobId.startsWith('demo-')) {
      console.log(`Demo model ${jobId} - returning fake completed status`);
      return { 
        state: 'completed',
        status: 'SUCCEEDED',
        output: { 
          model_url: SAMPLE_MODEL_URL 
        } 
      };
    }
    
    // Use the token directly from meshyConfig
    
    // Check the status using the Meshy API
    const response = await fetch(`${MESHY_API_URL}/task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task_id: jobId
      })
    });

    if (!response.ok) {
      console.error(`Failed to check model status: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to check model status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Model status response for ${jobId}:`, data);
    
    return {
      state: data.result?.state?.toLowerCase() || 'processing',
      status: data.result?.state || 'PROCESSING',
      output: data.result?.output ? {
        model_url: data.result.output.model_url || null
      } : null
    };
  } catch (error) {
    console.error(`Error checking status for model ${jobId}:`, error);
    throw error;
  }
};

export const getModelDownloadUrl = async (jobId: string) => {
  try {
    console.log(`Getting download URL for model ${jobId}`);
    
    // For demo models, return a sample URL
    if (jobId.startsWith('demo-')) {
      console.log(`Demo model ${jobId} - returning sample URL`);
      return SAMPLE_MODEL_URL;
    }
    
    // Check the status first to get the URL
    const status = await checkModelStatus(jobId);
    
    if (status.state !== 'completed') {
      throw new Error(`Model ${jobId} is not completed yet`);
    }
    
    // Return the model URL from the status response
    return status.output?.model_url || SAMPLE_MODEL_URL;
  } catch (error) {
    console.error(`Error getting download URL for model ${jobId}:`, error);
    // Return the sample URL as a fallback
    return SAMPLE_MODEL_URL;
  }
};
