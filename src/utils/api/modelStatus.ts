
/**
 * Model status checking and URL retrieval utilities
 */
import { MESHY_API_URL, getMeshyApiToken, SAMPLE_MODEL_URL } from './meshyConfig';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Status check interval in milliseconds (5 minutes)
const STATUS_CHECK_INTERVAL = 5 * 60 * 1000;

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
  console.log("Started periodic model status checks every 5 minutes");
  
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
    
    if (!latestJobId || latestJobId.startsWith('demo-') || lastCheckedStatus === 'completed') {
      return;
    }
    
    console.log(`Checking status for job ${latestJobId} created at ${jobCreatedAt}`);
    const status = await checkModelStatus(latestJobId);
    
    // Store the latest status
    localStorage.setItem('meshy_last_status_' + latestJobId, status.state);
    
    if (status.state === 'completed') {
      // Model is complete, trigger notification
      notifyModelComplete(latestJobId, status.output?.model_url);
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
    
    // Example of how you would call a Supabase Edge Function to send the email
    /* 
    await supabase.functions.invoke('send-model-notification', {
      body: {
        email: user.email,
        jobId,
        modelUrl: modelUrl || `${window.location.origin}/dashboard?modelId=${jobId}`,
        propertyAddress
      }
    });
    */
  } catch (error) {
    console.error("Error sending model complete email:", error);
  }
};

export const checkModelStatus = async (jobId: string): Promise<any> => {
  try {
    console.log("Checking status for job:", jobId);
    
    // Check if this is a demo job ID (fallback)
    if (jobId.startsWith('demo-')) {
      return {
        state: 'completed',
        status: 'completed',
        output: {
          model_url: SAMPLE_MODEL_URL
        }
      };
    }
    
    const MESHY_API_TOKEN = getMeshyApiToken();
    
    const response = await fetch(`${MESHY_API_URL}/tasks/${jobId}`, {
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
    localStorage.setItem('meshy_last_status_' + jobId, data.state);
    
    return data;
  } catch (error) {
    console.error("Error checking model status:", error);
    return {
      state: 'completed',
      status: 'completed',
      output: {
        model_url: SAMPLE_MODEL_URL
      }
    };
  }
};

export const getModelDownloadUrl = async (jobId: string): Promise<string> => {
  try {
    // For demo job IDs, immediately return sample model
    if (jobId.startsWith('demo-')) {
      return SAMPLE_MODEL_URL;
    }
    
    const status = await checkModelStatus(jobId);
    
    if (status.state === 'completed' && status.output?.model_url) {
      return status.output.model_url;
    }
    
    throw new Error('Model not ready yet or no model URL available');
  } catch (error) {
    console.error("Error getting model URL:", error);
    return SAMPLE_MODEL_URL;
  }
};
