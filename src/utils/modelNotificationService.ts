
import { supabase } from '@/integrations/supabase/client';
import { checkModelStatus } from './api/modelStatus';
import { toast } from '@/components/ui/use-toast';

// Status check interval in milliseconds (5 minutes = 300000ms)
const CHECK_INTERVAL = 5 * 60 * 1000;

let checkInterval: number | null = null;

/**
 * Start periodic checking for model completion
 */
export const startModelCompletionChecker = () => {
  if (checkInterval) {
    window.clearInterval(checkInterval);
  }
  
  // Do an immediate check
  checkPendingModels();
  
  // Set up periodic checking
  checkInterval = window.setInterval(checkPendingModels, CHECK_INTERVAL);
  
  console.log("Started model completion checker (5-minute interval)");
  
  return () => {
    if (checkInterval) {
      window.clearInterval(checkInterval);
      checkInterval = null;
    }
  };
};

/**
 * Check for any pending models and notify if complete
 */
const checkPendingModels = async () => {
  try {
    console.log("Checking for pending models...");
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user logged in, skipping model check");
      return;
    }
    
    // Check if there's a pending model job ID in user metadata
    const modelJobId = user.user_metadata?.propertyModelJobId;
    if (!modelJobId) {
      console.log("No model job ID found in user metadata");
      return;
    }
    
    // Check if we've already completed this model
    const completedModels = JSON.parse(localStorage.getItem('completed_model_jobs') || '[]');
    if (completedModels.includes(modelJobId)) {
      console.log(`Model ${modelJobId} already marked as complete, skipping`);
      return;
    }
    
    // Check the status
    console.log(`Checking status of model job ${modelJobId}`);
    const status = await checkModelStatus(modelJobId);
    
    // If complete, notify the user
    if (status.state === 'completed') {
      console.log(`Model ${modelJobId} is complete!`);
      
      // Store as completed to avoid repeat notifications
      completedModels.push(modelJobId);
      localStorage.setItem('completed_model_jobs', JSON.stringify(completedModels));
      
      // Send notification
      await sendModelCompletionNotification(modelJobId, status.output?.model_url, user);
      
      // Dispatch event for the UI to update
      const modelCompleteEvent = new CustomEvent('modelCompleted', {
        detail: { 
          jobId: modelJobId,
          modelUrl: status.output?.model_url
        }
      });
      document.dispatchEvent(modelCompleteEvent);
    } else {
      console.log(`Model ${modelJobId} is not ready yet (status: ${status.state})`);
    }
  } catch (error) {
    console.error("Error checking model status:", error);
  }
};

/**
 * Send a notification about completed 3D model
 */
const sendModelCompletionNotification = async (jobId: string, modelUrl: string | undefined, user: any) => {
  try {
    // Show toast notification
    toast({
      title: "3D Model Complete!",
      description: "Your property 3D model is now ready to view and download.",
      duration: 10000
    });
    
    // Get the property address
    const propertyAddress = user.user_metadata?.propertyAddress || "your property";
    
    // In production, you would call a Supabase Edge Function to send the email notification
    console.log(`Would send email notification to ${user.email} about completed 3D model for ${propertyAddress}`);
    
    // Update user metadata to indicate model is ready
    const { error } = await supabase.auth.updateUser({
      data: { 
        propertyModelComplete: true,
        propertyModelUrl: modelUrl
      }
    });
    
    if (error) {
      console.error("Error updating user metadata:", error);
    }
    
    /* In production, you would call a function like:
    
    await supabase.functions.invoke('send-model-completion-email', {
      body: {
        email: user.email,
        propertyAddress,
        modelJobId: jobId,
        modelUrl: modelUrl || `${window.location.origin}/model/${jobId}`
      }
    });
    
    */
  } catch (error) {
    console.error("Error sending model completion notification:", error);
  }
};

/**
 * Check for a specific model's status
 */
export const checkSpecificModel = async (jobId: string) => {
  if (!jobId) return;
  
  try {
    const status = await checkModelStatus(jobId);
    
    if (status.state === 'completed') {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await sendModelCompletionNotification(jobId, status.output?.model_url, user);
      }
      
      // Dispatch event for the UI to update
      const modelCompleteEvent = new CustomEvent('modelCompleted', {
        detail: { 
          jobId,
          modelUrl: status.output?.model_url
        }
      });
      document.dispatchEvent(modelCompleteEvent);
    }
    
    return status;
  } catch (error) {
    console.error("Error checking specific model:", error);
    return null;
  }
};
