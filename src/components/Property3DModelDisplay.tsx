import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building } from "lucide-react";
import Property3DModelFailed from "./3d/Property3DModelFailed";
import Property3DModelViewer from "./3d/Property3DModelViewer";
import Property3DModelLoading from "./Property3DModelLoading";
import ModelStatusDisplay from "./3d/ModelStatusDisplay";
import { use3DModel } from "@/hooks/use3DModel";

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
  const [rotateModel, setRotateModel] = useState(true);
  const [modelRotation, setModelRotation] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  const { modelStatus, modelUrl, isLoading, handleRefresh } = use3DModel(jobId);

  React.useEffect(() => {
    if (!rotateModel) return;
    const interval = setInterval(() => {
      setModelRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [rotateModel]);

  React.useEffect(() => {
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
          handleDownload={() => {
            if (modelUrl) {
              window.open(modelUrl, "_blank");
            }
          }}
          jobId={jobId}
        />
        <ModelStatusDisplay jobId={jobId} modelStatus={modelStatus} />
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;
