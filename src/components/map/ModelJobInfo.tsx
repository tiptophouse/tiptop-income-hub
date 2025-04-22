
import React from 'react';
import { Check } from 'lucide-react';

interface ModelJobInfoProps {
  jobId: string;
}

const ModelJobInfo: React.FC<ModelJobInfoProps> = ({ jobId }) => {
  return (
    <div className="absolute bottom-20 right-4 bg-black/70 p-2 rounded-lg shadow-md text-white flex items-center gap-2 text-xs">
      <Check className="h-4 w-4 text-green-500" />
      <p>3D Model Ready: 
        <span className="font-semibold ml-1">#{jobId.substring(0, 6)}</span>
      </p>
    </div>
  );
};

export default ModelJobInfo;
