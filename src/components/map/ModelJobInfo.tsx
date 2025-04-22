
import React from 'react';

interface ModelJobInfoProps {
  jobId: string;
}

const ModelJobInfo: React.FC<ModelJobInfoProps> = ({ jobId }) => {
  return (
    <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md">
      <p className="text-xs text-gray-600">3D Model Job ID: {jobId}</p>
    </div>
  );
};

export default ModelJobInfo;
