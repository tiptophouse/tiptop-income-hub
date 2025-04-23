
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Building } from "lucide-react";
import Property3DModelFailed from "./3d/Property3DModelFailed";
import Property3DModelViewer from "./3d/Property3DModelViewer";
import Property3DModelLoading from "./Property3DModelLoading";
import { generateModelFromImage, checkModelStatus, getModelDownloadUrl } from "@/utils/meshyApi";

interface Property3DModelDisplayProps {
  jobId: string;
  address: string;
  className?: string;
}

const Property3DModelDisplay: React.FC<Property3DModelDisplayProps> = ({
  jobId,
  address,
  className,
}) => {
  const [modelStatus, setModelStatus] = useState<
    "processing" | "completed" | "failed"
  >("processing");
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rotateModel, setRotateModel] = useState(true);
  const [modelRotation, setModelRotation] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    if (!jobId) return;

    const checkAndUpdateModelStatus = async () => {
      try {
        setIsLoading(true);
        
        // If this is a demo job or we've already found the URL, skip API calls
        if (jobId.startsWith('demo-') && !modelUrl) {
          // Simulate API delay for demo jobs
          await new Promise(resolve => setTimeout(resolve, 2000));
          setModelUrl(`https://storage.googleapis.com/realestate-3d-models/demo-property.glb`);
          setModelStatus("completed");
          setIsLoading(false);
          return;
        }
        
        // For real jobs, check status with the API
        if (!jobId.startsWith('demo-')) {
          const status = await checkModelStatus(jobId);
          
          if (status.state === 'completed') {
            const url = await getModelDownloadUrl(jobId);
            setModelUrl(url);
            setModelStatus("completed");
          } else if (status.state === 'failed') {
            setModelStatus("failed");
            toast({
              title: "3D Model Failed",
              description: "Could not generate the 3D model. Please try again.",
              variant: "destructive",
            });
          } else if (checkCount < 10) {
            // Still processing, schedule another check after delay
            setTimeout(() => {
              setCheckCount(prevCount => prevCount + 1);
            }, 5000); // Check every 5 seconds
          } else {
            // Too many checks, assume failure
            setModelStatus("failed");
            toast({
              title: "Processing Timeout",
              description: "3D model processing took too long. Please try again later.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error checking 3D model status:", error);
        setModelStatus("failed");
        toast({
          title: "Error",
          description: "Failed to check 3D model status. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAndUpdateModelStatus();
  }, [jobId, checkCount, modelUrl]);

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      script.type = "module";
      script.onload = () => setIsModelViewerLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsModelViewerLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!rotateModel) return;
    const interval = setInterval(() => {
      setModelRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [rotateModel]);

  const handleDownload = () => {
    if (!modelUrl) return;
    window.open(modelUrl, "_blank");
    toast({
      title: "3D Model Downloaded",
      description: "Your property's 3D model has been downloaded.",
    });
  };
  
  const handleRefresh = async () => {
    setIsLoading(true);
    setModelStatus("processing");
    setCheckCount(0);
    // Re-fetch the model (in a real app, you might want to regenerate it)
    setTimeout(() => {
      checkAndUpdateModelStatus();
    }, 1000);
  };

  if (isLoading) {
    return <Property3DModelLoading />;
  }

  if (modelStatus === "failed") {
    return <Property3DModelFailed onRetry={handleRefresh} />;
  }

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription>
          3D model for {address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Property3DModelViewer
          modelUrl={modelUrl}
          isModelViewerLoaded={isModelViewerLoaded}
          rotateModel={rotateModel}
          modelRotation={modelRotation}
          toggleRotate={() => setRotateModel(!rotateModel)}
          handleRefresh={handleRefresh}
          handleDownload={() => handleDownload()}
          jobId={jobId}
        />
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;
