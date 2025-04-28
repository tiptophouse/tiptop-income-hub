
import React, { useState, useEffect } from "react";
import Property3DModelNoJob from "./Property3DModelNoJob";
import Property3DModelDisplay from "./Property3DModelDisplay";

interface Property3DModelProps {
  jobId: string | null;
  address: string;
  className?: string;
}

interface PropertyFeatures {
  roofSize?: number;
  solarPotentialKw?: number;
  internetMbps?: number;
  parkingSpaces?: number;
  gardenSqFt?: number;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasParking?: boolean;
  hasEVCharging?: boolean;
}

const Property3DModel: React.FC<Property3DModelProps> = ({
  jobId: initialJobId,
  address,
  className,
}) => {
  const [jobId, setJobId] = useState<string | null>(initialJobId);
  const [hasSatelliteImage, setHasSatelliteImage] = useState(false);
  const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeatures | null>(null);

  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail) {
        if (event.detail.jobId) {
          console.log("3D Model: Received modelJobCreated event with jobId:", event.detail.jobId);
          setJobId(event.detail.jobId);
        }
        
        if (event.detail.hasSatelliteImage !== undefined) {
          setHasSatelliteImage(event.detail.hasSatelliteImage);
        }
        
        if (event.detail.propertyFeatures) {
          setPropertyFeatures(event.detail.propertyFeatures);
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
    // Check user metadata for satellite image and property features info when component mounts
    const checkUserMetadata = async () => {
      try {
        console.log("3D Model: Checking user metadata for property info");
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.user_metadata?.propertySatelliteImage) {
          setHasSatelliteImage(true);
        }
        
        if (user?.user_metadata?.propertyFeatures) {
          console.log("3D Model: Found property features in user metadata");
          setPropertyFeatures(user.user_metadata.propertyFeatures);
        } else {
          // Default property features if none are available
          console.log("3D Model: Using default property features");
          setPropertyFeatures({
            roofSize: 950,
            solarPotentialKw: 6.5,
            internetMbps: 100,
            parkingSpaces: 2,
            gardenSqFt: 300,
            hasPool: Math.random() > 0.6,
            hasGarden: Math.random() > 0.4,
            hasParking: Math.random() > 0.3,
            hasEVCharging: Math.random() > 0.8
          });
        }
      } catch (error) {
        console.error("Error checking user metadata:", error);
      }
    };
    
    checkUserMetadata();
  }, []);

  if (!jobId) {
    console.log("3D Model: No job ID, showing Property3DModelNoJob");
    return <Property3DModelNoJob address={address} className={className} />;
  }

  console.log("3D Model: Rendering Property3DModelDisplay with jobId:", jobId);
  return (
    <Property3DModelDisplay 
      jobId={jobId} 
      address={address} 
      className={className}
      hasSatelliteImage={hasSatelliteImage}
      propertyFeatures={propertyFeatures}
    />
  );
};

export default Property3DModel;
