
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
import { checkModelStatus, getModelDownloadUrl } from "@/utils/meshyApi";
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
  const [checkCount, setCheckCount] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
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

  useEffect(() => {
    if (!jobId) return;

    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const status = await checkModelStatus(jobId);
        if (status.state === "completed" || status.status === "completed") {
          try {
            const url = await getModelDownloadUrl(jobId);
            setModelUrl(url);
            setModelStatus("completed");
            toast({
              title: "3D Model Ready",
              description:
                "Your property's 3D model has been generated successfully.",
            });
          } catch (modelUrlError) {
            setModelStatus("completed");
            setModelUrl(
              "/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png",
            );
            toast({
              title: "3D Model Ready",
              description:
                "Your property's 3D model has been generated, but there was an issue loading it.",
              variant: "destructive",
            });
          }
        } else if (
          status.state === "failed" ||
          status.status === "failed"
        ) {
          setModelStatus("failed");
          toast({
            title: "Model Generation Failed",
            description: "We couldn't generate a 3D model for this property.",
            variant: "destructive",
          });
        } else {
          setCheckCount((prev) => prev + 1);
          if (checkCount > 10) {
            setModelUrl(
              "/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png",
            );
            setModelStatus("completed");
            toast({
              title: "Using Sample Model",
              description:
                "Processing is taking longer than expected. Showing a sample model.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        if (checkCount > 5) {
          setModelStatus("completed");
          setModelUrl(
            "/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png",
          );
          toast({
            title: "Using Sample Model",
            description: "Couldn't retrieve model status. Showing a sample model.",
            variant: "destructive",
          });
        } else {
          setModelStatus("processing");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(() => {
      if (modelStatus === "processing") {
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
    window.open(modelUrl, "_blank");
    toast({
      title: "3D Model Downloaded",
      description: "Your property's 3D model has been downloaded.",
    });
  };
  const handleRefresh = () => {
    setIsLoading(true);
    setModelStatus("processing");
    setCheckCount(0);
    const newJobId =
      "refreshed-model-" + Math.random().toString(36).substring(2, 8);
    setJobId(newJobId);
    toast({
      title: "Refreshing Model",
      description: "Generating a new 3D model for your property.",
    });
  };

  if (isLoading) {
    return <Property3DModelLoading />;
  }

  if (modelStatus === "failed") {
    return <Property3DModelFailed onRetry={handleRefresh} />;
  }

  return (
    <Card
      className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription>
          AI-generated 3D model for {address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Property3DModelViewer
          modelUrl={modelUrl}
          isModelViewerLoaded={isModelViewerLoaded}
          rotateModel={rotateModel}
          modelRotation={modelRotation}
          toggleRotate={toggleRotate}
          handleRefresh={handleRefresh}
          handleDownload={handleDownload}
          jobId={jobId}
        />
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;

