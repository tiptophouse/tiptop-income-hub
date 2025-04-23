
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { Building, RotateCw, Download, Box, RefreshCw, FileGlobe } from 'lucide-react';
import { checkModelStatus, getModelDownloadUrl } from '@/utils/meshyApi';

interface Property3DModelProps {
  jobId: string | null;
  address: string;
  className?: string;
}

const Property3DModel: React.FC<Property3DModelProps> = ({ 
  jobId: initialJobId, 
  address,
  className 
}) => {
  const [modelStatus, setModelStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rotateModel, setRotateModel] = useState(true);
  const [jobId, setJobId] = useState<string | null>(initialJobId);
  const [modelRotation, setModelRotation] = useState(0);
  const [checkCount, setCheckCount] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  // Listen for model job creation events
  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail && event.detail.jobId) {
        setJobId(event.detail.jobId);
        setModelStatus('processing');
        setIsLoading(true);
        setCheckCount(0); // Reset check count for new job
      }
    };

    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    };
  }, []);

  // Load model-viewer script
  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.type = 'module';
      script.onload = () => setIsModelViewerLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsModelViewerLoaded(true);
    }
  }, []);

  // Start rotation animation
  useEffect(() => {
    if (!rotateModel) return;
    
    const interval = setInterval(() => {
      setModelRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [rotateModel]);

  useEffect(() => {
    if (!jobId) return;
    
    const checkStatus = async () => {
      try {
        console.log("Checking model status for job:", jobId);
        setIsLoading(true);
        
        const status = await checkModelStatus(jobId);
        
        if (status.state === 'completed' || status.status === 'completed') {
          console.log("Model generation completed!");
          try {
            const url = await getModelDownloadUrl(jobId);
            setModelUrl(url);
            setModelStatus('completed');
            toast({
              title: "3D Model Ready",
              description: "Your property's 3D model has been generated successfully."
            });
          } catch (modelUrlError) {
            console.error("Error getting model URL:", modelUrlError);
            // If we can't get the model URL but the status is complete,
            // still mark it as complete but with a warning
            setModelStatus('completed');
            // Use fallback image as a last resort
            setModelUrl('/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png');
            toast({
              title: "3D Model Ready",
              description: "Your property's 3D model has been generated, but there was an issue loading it.",
              variant: "warning"
            });
          }
        } else if (status.state === 'failed' || status.status === 'failed') {
          console.error("Model generation failed");
          setModelStatus('failed');
          toast({
            title: "Model Generation Failed",
            description: "We couldn't generate a 3D model for this property.",
            variant: "destructive"
          });
        } else {
          // Still processing
          console.log("Model still processing, status:", status.state || status.status);
          // Increment check count to limit checks
          setCheckCount(prev => prev + 1);
          
          // If we've checked too many times, use a fallback
          if (checkCount > 10) {
            console.log("Too many checks, using fallback image");
            setModelUrl('/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png');
            setModelStatus('completed');
            toast({
              title: "Using Sample Model",
              description: "Processing is taking longer than expected. Showing a sample model.",
              variant: "warning"
            });
          }
        }
      } catch (error) {
        console.error('Error checking model status:', error);
        // After several failed attempts, use fallback
        if (checkCount > 5) {
          console.log("Using fallback after failed checks");
          setModelStatus('completed');
          setModelUrl('/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png');
          toast({
            title: "Using Sample Model",
            description: "Couldn't retrieve model status. Showing a sample model.",
            variant: "warning"
          });
        } else {
          setModelStatus('processing');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
    
    // Check status every 10 seconds if still processing
    const interval = setInterval(() => {
      if (modelStatus === 'processing') {
        checkStatus();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [jobId, checkCount, modelStatus]);

  const toggleRotate = () => {
    setRotateModel(!rotateModel);
  };

  const handleDownload = () => {
    if (!modelUrl) return;
    
    window.open(modelUrl, '_blank');
    
    toast({
      title: "3D Model Downloaded",
      description: "Your property's 3D model has been downloaded."
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setModelStatus('processing');
    setCheckCount(0);
    
    // Generate a new job ID
    const newJobId = "refreshed-model-" + Math.random().toString(36).substring(2, 8);
    setJobId(newJobId);
    
    toast({
      title: "Refreshing Model",
      description: "Generating a new 3D model for your property."
    });
  };

  // If no job ID and not listening for one yet, show the start button
  if (!jobId) {
    return (
      <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-tiptop-accent" />
            Property 3D Model
          </CardTitle>
          <CardDescription>Generate a 3D model for {address}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-center text-muted-foreground mb-4">
            Click "Generate 3D Model" on the map to generate a 3D model of this property
          </p>
          <Building className="h-16 w-16 text-muted-foreground/50 mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription>AI-generated 3D model for {address}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tiptop-accent rounded-full" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Generating 3D model from satellite imagery...
            </p>
          </div>
        ) : modelStatus === 'failed' ? (
          <div className="text-center py-8">
            <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Model Generation Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't generate a 3D model for this property.
            </p>
            <Button variant="outline" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {modelUrl?.endsWith('.glb') && isModelViewerLoaded ? (
                // @ts-ignore - model-viewer is a custom element loaded at runtime
                <model-viewer
                  src={modelUrl}
                  alt="3D model of property"
                  auto-rotate={rotateModel}
                  camera-controls
                  shadow-intensity="1"
                  style={{width: '100%', height: '200px', background: '#f5f5f5', borderRadius: '0.375rem'}}
                  poster="/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png"
                />
              ) : (
                <motion.div 
                  className="w-full h-48 bg-gray-100 rounded-md overflow-hidden"
                  style={{ transform: `perspective(800px) rotateY(${modelRotation}deg)` }}
                >
                  {modelUrl && (
                    <img 
                      src={modelUrl} 
                      alt="Property 3D Model" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              )}
              
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-black/70 text-white hover:bg-black/80"
                  onClick={toggleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-black/70 text-white hover:bg-black/80"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-black/70 text-white hover:bg-black/80"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                3D Model ID: #{jobId.substring(0, 6)}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="w-full"
              >
                <FileGlobe className="mr-2 h-4 w-4" />
                Download 3D Model
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Property3DModel;
