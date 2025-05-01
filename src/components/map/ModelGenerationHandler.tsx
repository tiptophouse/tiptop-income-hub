
import React, { useState, useEffect } from 'react';
import ModelJobInfo from './ModelJobInfo';
import { toast } from '@/components/ui/use-toast';

interface ModelGenerationHandlerProps {
  address: string;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  handleModelGeneration: (mapContainerRef: React.RefObject<HTMLDivElement>) => void;
}

const ModelGenerationHandler: React.FC<ModelGenerationHandlerProps> = ({
  address,
  mapContainerRef,
  handleModelGeneration
}) => {
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail?.jobId) {
        setModelJobId(event.detail.jobId);
        setShowError(false);
      }
    };
    
    const handleModelError = (event: CustomEvent) => {
      if (event.detail?.error) {
        setShowError(true);
        toast({
          title: "Error",
          description: "Failed to generate 3D model. Using demo model instead.",
          variant: "destructive"
        });
      }
    };
    
    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    document.addEventListener('modelGenerationError', handleModelError as EventListener);
    
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
      document.removeEventListener('modelGenerationError', handleModelError as EventListener);
    };
  }, []);

  const generate3DModel = () => {
    handleModelGeneration(mapContainerRef);
  };

  return (
    <>
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
      {showError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg flex items-center">
            <span className="mr-2">⚠️</span>
            <span>Failed to generate 3D model</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelGenerationHandler;
