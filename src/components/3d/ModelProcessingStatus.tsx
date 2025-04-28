
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ModelProcessingStatusProps {
  statusMessage: string;
  progress: number;
}

const ModelProcessingStatus: React.FC<ModelProcessingStatusProps> = ({ 
  statusMessage, 
  progress 
}) => (
  <div className="mb-4 flex flex-col gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{statusMessage}</span>
    </div>
    <Progress value={progress} className="w-full h-1" />
    <p className="text-xs text-amber-500">
      You'll receive an email when your model is ready
    </p>
  </div>
);

export default ModelProcessingStatus;
