
import React from 'react';
import { Loader2, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModelProcessingStatusProps {
  statusMessage: string;
  progress: number;
  stage?: string;
  estimatedTimeRemaining?: number;
}

const ModelProcessingStatus: React.FC<ModelProcessingStatusProps> = ({ 
  statusMessage, 
  progress,
  stage = 'processing',
  estimatedTimeRemaining
}) => {
  // Calculate stages based on meshy.ai API documentation
  const stages = [
    { name: 'queue', label: 'In Queue', color: 'text-gray-500 bg-gray-50' },
    { name: 'processing', label: 'Processing', color: 'text-amber-600 bg-amber-50' },
    { name: 'meshing', label: 'Creating Mesh', color: 'text-blue-600 bg-blue-50' },
    { name: 'texturing', label: 'Generating Textures', color: 'text-purple-600 bg-purple-50' },
    { name: 'finalizing', label: 'Finalizing', color: 'text-teal-600 bg-teal-50' }
  ];
  
  const currentStage = stages.find(s => s.name === stage) || stages[1]; // Default to processing
  
  const formatTimeRemaining = () => {
    if (!estimatedTimeRemaining) return 'Estimating...';
    
    if (estimatedTimeRemaining < 60) {
      return `About ${Math.ceil(estimatedTimeRemaining)} seconds remaining`;
    } else {
      const minutes = Math.ceil(estimatedTimeRemaining / 60);
      return `About ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
    }
  };
  
  return (
    <div className={`mb-4 flex flex-col gap-2 text-sm ${currentStage.color} p-3 rounded-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{statusMessage}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Meshy.ai is processing your 3D model using AI. This typically takes 3-5 minutes
                depending on the complexity of the property.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={progress} className="w-full h-1" />
      <div className="flex justify-between text-xs">
        <p>{currentStage.label}</p>
        <p>{formatTimeRemaining()}</p>
      </div>
    </div>
  );
};

export default ModelProcessingStatus;
