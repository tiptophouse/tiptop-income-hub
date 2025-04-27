
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, AlertCircle, Loader2 } from "lucide-react";
import Property3DModelFailed from "./3d/Property3DModelFailed";
import Property3DModelViewer from "./3d/Property3DModelViewer";
import Property3DModelLoading from "./Property3DModelLoading";
import ModelStatusDisplay from "./3d/ModelStatusDisplay";
import { use3DModel } from "@/hooks/use3DModel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";

interface Property3DModelDisplayProps {
  jobId: string;
  address: string;
  className?: string;
  hasSatelliteImage?: boolean;
}

const Property3DModelDisplay: React.FC<Property3DModelDisplayProps> = ({
  jobId,
  address,
  className,
  hasSatelliteImage = false
}) => {
  const [rotateModel, setRotateModel] = useState(true);
  const [modelRotation, setModelRotation] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(105);
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5");
  const [showControls, setShowControls] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const isMobile = useIsMobile();

  const { modelStatus, modelUrl, isLoading, error, statusMessage, handleRefresh } = use3DModel(jobId);

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
    return (
      <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
            Property 3D Model
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{address}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent" />
          <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
          <Progress value={modelStatus === 'processing' ? 75 : 100} className="w-3/4 max-w-xs" />
        </CardContent>
      </Card>
    );
  }

  if (modelStatus === "failed" && !modelUrl) {
    return <Property3DModelFailed onRetry={handleRefresh} />;
  }

  const backgroundOptions = ["#f5f5f5", "#1a1a1a", "#e0f2fe", "#f0fdf4", "#fffbeb"];

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm flex justify-between items-center">
          <span className="truncate">{address}</span>
          <Button 
            variant="link" 
            className="p-0 h-auto text-[10px] sm:text-xs text-tiptop-accent" 
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? "Hide advanced controls" : "Show advanced controls"}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && !errorDismissed && (
          <Alert variant="destructive" className="mb-4 border-2 border-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">Failed to generate 3D model. Using demo model instead.</span>
              <Button variant="ghost" size="sm" onClick={() => setErrorDismissed(true)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {modelStatus === 'processing' && (
          <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{statusMessage}</span>
          </div>
        )}
        
        {showControls && (
          <div className="mb-4 space-y-4 p-2 sm:p-4 bg-gray-50 rounded-md">
            <div>
              <label className="text-xs sm:text-sm font-medium block mb-2">Zoom Level</label>
              <Slider
                value={[zoomLevel]}
                min={50}
                max={200}
                step={5}
                onValueChange={(value) => setZoomLevel(value[0])}
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium block mb-2">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {backgroundOptions.map((color) => (
                  <div 
                    key={color}
                    className={`w-6 h-6 rounded-full cursor-pointer ${backgroundColor === color ? 'ring-2 ring-tiptop-accent' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBackgroundColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
          zoomLevel={zoomLevel}
          backgroundColor={backgroundColor}
          hasSatelliteImage={hasSatelliteImage}
        />
        
        {hasSatelliteImage && (
          <div className="mt-2 text-xs text-center text-tiptop-accent font-medium">
            Enhanced 3D model using satellite imagery for better accuracy
          </div>
        )}
        
        <ModelStatusDisplay jobId={jobId} modelStatus={modelStatus} />
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;
