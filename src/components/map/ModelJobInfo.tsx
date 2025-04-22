
import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface ModelJobInfoProps {
  jobId: string;
}

const ModelJobInfo: React.FC<ModelJobInfoProps> = ({ jobId }) => {
  return (
    <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md flex items-center gap-2">
      <Check className="h-4 w-4 text-green-500" />
      <p className="text-xs text-gray-600">3D Model Processing: 
        <span className="font-semibold ml-1">#{jobId.substring(0, 6)}</span>
      </p>
    </div>
  );
};

export default ModelJobInfo;
