
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelStatusDisplayProps {
  jobId: string;
  modelStatus: 'processing' | 'completed' | 'failed';
}

const ModelStatusDisplay: React.FC<ModelStatusDisplayProps> = ({ jobId, modelStatus }) => {
  return (
    <div className="text-center mt-2">
      <p className="text-sm text-muted-foreground">
        Model ID: #{jobId.substring(0, 6)}
        {modelStatus === 'processing' && ' (Processing...)'}
        {modelStatus === 'completed' && ' (Ready)'}
        {modelStatus === 'failed' && ' (Failed)'}
      </p>
    </div>
  );
};

export default ModelStatusDisplay;
