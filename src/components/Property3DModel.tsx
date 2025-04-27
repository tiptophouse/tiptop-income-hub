
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
  const [hasSatelliteImage, setHasSatelliteImage] = useState(false);

  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail) {
        if (event.detail.jobId) {
          setJobId(event.detail.jobId);
        }
        
        if (event.detail.hasSatelliteImage !== undefined) {
          setHasSatelliteImage(event.detail.hasSatelliteImage);
        }
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

  useEffect(() => {
    // Check user metadata for satellite image info when component mounts
    const checkSatelliteImageAvailability = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.user_metadata?.propertySatelliteImage) {
          setHasSatelliteImage(true);
        }
      } catch (error) {
        console.error("Error checking satellite image availability:", error);
      }
    };
    
    checkSatelliteImageAvailability();
  }, []);

  if (!jobId) {
    return <Property3DModelNoJob address={address} className={className} />;
  }

  return (
    <Property3DModelDisplay 
      jobId={jobId} 
      address={address} 
      className={className}
      hasSatelliteImage={hasSatelliteImage}
    />
  );
};

export default Property3DModel;
