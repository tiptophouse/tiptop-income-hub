
import React, { useState, useEffect } from "react";
import Property3DModelNoJob from "./Property3DModelNoJob";
import Property3DModelDisplay from "./Property3DModelDisplay";

interface Property3DModelProps {
  jobId: string | null;
  address: string;
  className?: string;
}

const Property3DModel: React.FC<Property3DModelProps> = ({
  jobId: initialJobId,
  address,
  className,
}) => {
  const [jobId, setJobId] = useState<string | null>(initialJobId);

  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail && event.detail.jobId) {
        setJobId(event.detail.jobId);
      }
    };
    document.addEventListener(
      "modelJobCreated",
      handleModelJobCreated as EventListener,
    );
    return () => {
      document.removeEventListener(
        "modelJobCreated",
        handleModelJobCreated as EventListener,
      );
    };
  }, []);

  if (!jobId) {
    return <Property3DModelNoJob address={address} className={className} />;
  }

  return (
    <Property3DModelDisplay jobId={jobId} address={address} className={className} />
  );
};

export default Property3DModel;

