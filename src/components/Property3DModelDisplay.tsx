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

  useEffect(() => {
    if (!jobId) return;

    const fetchModel = async () => {
      try {
        setIsLoading(true);
        // Here you would make the API call to your 3D model service
        // For now, using a sample GLB file
        const modelUrl = `https://storage.googleapis.com/realestate-3d-models/${jobId}.glb`;
        
        // Verify the model exists
        const response = await fetch(modelUrl, { method: 'HEAD' });
        if (response.ok) {
          setModelUrl(modelUrl);
          setModelStatus("completed");
        } else {
          setModelStatus("failed");
          toast({
            title: "3D Model Failed",
            description: "Could not load the 3D model. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading 3D model:", error);
        setModelStatus("failed");
        toast({
          title: "Error",
          description: "Failed to load the 3D model. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [jobId]);

  useEffect(() => {
    // Load model-viewer script
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

  const toggleRotate = () => {
    setRotateModel(!rotateModel);
  };
  const handleDownload = () => {
    if (!modelUrl) return;
    window.open(modelUrl, "_blank");
    toast({
      title: "3D Model Downloaded",
      description: "Your property's 3D model has been downloaded.",
    });
  };
  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <Property3DModelLoading />;
  }

  if (modelStatus === "failed") {
    return <Property3DModelFailed onRetry={() => window.location.reload()} />;
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
          handleRefresh={() => window.location.reload()}
          handleDownload={() => window.open(modelUrl || '', '_blank')}
          jobId={jobId}
        />
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;
