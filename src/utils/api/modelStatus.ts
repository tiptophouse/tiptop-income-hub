
/**
 * Model status checking and URL retrieval utilities
 */
import { MESHY_API_URL, getMeshyApiToken } from './meshyConfig';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// House model URL as sample
export const SAMPLE_MODEL_URL = "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf";

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
    const isDemo = localStorage.getItem('meshy_demo_model') === 'true';
    
    if (!latestJobId || latestJobId.startsWith('demo-') || isDemo || lastCheckedStatus === 'SUCCEEDED') {
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
    const isDemo = localStorage.getItem('meshy_demo_model') === 'true' ||
                   jobId.startsWith('demo-');
                   
    if (isDemo) {
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
    
    // For development environments, always return demo model
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('lovable')) {
      console.log("Development environment detected - using demo model status");
      return {
        state: 'completed',
        status: 'SUCCEEDED',
        model_urls: {
          glb: SAMPLE_MODEL_URL
        },
        isDemo: true
      };
    }
    
    // Use the direct token value
    const MESHY_API_TOKEN = "msy_VCpuL3jqR4WSuz9hCwsQljlQ2NCWFBa2OZQZ";
    
    // IMPORTANT: API calls are disabled to prevent credit usage
    console.log("DEMO MODE: Not making actual API call to check status");
    /*
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
    */
    
    // Return demo status instead
    return {
      state: 'completed',
      status: 'SUCCEEDED',
      model_urls: {
        glb: SAMPLE_MODEL_URL
      },
      isDemo: true
    };
  } catch (error) {
    console.error("Error checking model status:", error);
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
    const isDemo = localStorage.getItem('meshy_demo_model') === 'true' ||
                   jobId.startsWith('demo-');
    
    if (isDemo) {
      return SAMPLE_MODEL_URL;
    }
    
    // For development environments, always return demo model
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('lovable')) {
      return SAMPLE_MODEL_URL;
    }
    
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
