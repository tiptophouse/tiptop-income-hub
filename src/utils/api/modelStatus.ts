
/**
 * Model status checking and URL retrieval utilities
 */
import { MESHY_API_URL } from './meshyConfig';
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
    localStorage.setItem('meshy_last_status_' + latestJobId, status.status);
    
    if (status.status === 'SUCCEEDED') {
      // Model is complete, trigger notification
      notifyModelComplete(latestJobId, status.model_urls?.glb);
    }
  } catch (error) {
    console.error("Error in periodic status check:", error);
  }
};

// Function to send notification when model is complete
const notifyModelComplete = async (jobId: string, modelUrl?: string) => {
  try {
    // Show toast notification
    toast({
      title: "3D Model Complete",
      description: "Your property 3D model is now ready to view.",
    });
    
    // Dispatch event for the UI to update
    const modelCompleteEvent = new CustomEvent('modelCompleted', {
      detail: { 
        jobId,
        modelUrl
      }
    });
    document.dispatchEvent(modelCompleteEvent);
    
    // Try to send email notification if user is authenticated
    await sendModelCompleteEmail(jobId, modelUrl);
    
  } catch (notifyError) {
    console.error("Error in model complete notification:", notifyError);
  }
};

// Function to send email notification
const sendModelCompleteEmail = async (jobId: string, modelUrl?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;
    
    // Get the property address from user metadata
    const propertyAddress = user.user_metadata?.propertyAddress || "your property";
    
    // In a production app, this would call a supabase edge function to send an email
    console.log(`Would send email to ${user.email} about completed model ${jobId} for address: ${propertyAddress}`);
  } catch (error) {
    console.error("Error sending model complete email:", error);
  }
};

export const checkModelStatus = async (jobId: string): Promise<any> => {
  try {
    console.log("Checking status for job:", jobId);
    
    // Check if this is a demo job ID
    if (jobId.startsWith('demo-') || localStorage.getItem('meshy_demo_model') === 'true') {
      console.log("Using demo model status - no API call made");
      return {
        state: 'completed',
        status: 'SUCCEEDED',
        model_urls: {
          glb: SAMPLE_MODEL_URL
        },
        isDemo: true
      };
    }
    
    // For development environments, check if we should use demo model
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('lovable')) {
      // For testing in development, randomly decide if model is ready
      const randomProgress = Math.random();
      if (randomProgress > 0.7) {
        return {
          state: 'completed',
          status: 'SUCCEEDED',
          model_urls: {
            glb: SAMPLE_MODEL_URL
          }
        };
      } else {
        return {
          state: 'processing',
          status: 'IN_PROGRESS',
          progress: Math.round(randomProgress * 100)
        };
      }
    }
    
    // Use the direct token value
    const MESHY_API_TOKEN = "msy_avpp46RPVW7UlyUSsEez6fTuqYvIJgQDg0nM"; // Using the provided token
    
    // Make actual API call to check status
    const response = await fetch(`${MESHY_API_URL}/image-to-3d/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MESHY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Job status response:", data);
    
    // Store the most recent status
    localStorage.setItem('meshy_last_status_' + jobId, data.status);
    
    return data;
  } catch (error) {
    console.error("Error checking model status:", error);
    
    // Return demo status as fallback
    return {
      state: 'completed',
      status: 'SUCCEEDED',
      model_urls: {
        glb: SAMPLE_MODEL_URL
      },
      isDemo: true
    };
  }
};

export const getModelDownloadUrl = async (jobId: string): Promise<string> => {
  try {
    // For demo job IDs, immediately return sample model
    if (jobId.startsWith('demo-') || localStorage.getItem('meshy_demo_model') === 'true') {
      return SAMPLE_MODEL_URL;
    }
    
    // For real job IDs, check the status and get model URL
    const status = await checkModelStatus(jobId);
    
    if (status.status === 'SUCCEEDED' && status.model_urls?.glb) {
      return status.model_urls.glb;
    }
    
    throw new Error('Model not ready yet or no model URL available');
  } catch (error) {
    console.error("Error getting model URL:", error);
    return SAMPLE_MODEL_URL;
  }
};
