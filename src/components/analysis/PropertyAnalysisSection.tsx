
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropertyMap from '../PropertyMap';
import PropertyInsights from '../PropertyInsights';
import Property3DModel from '../Property3DModel';
import { captureStreetViewForModel } from '@/utils/streetView';
import { storePropertyData } from '@/utils/meshyApi';
import { supabase } from '@/integrations/supabase/client';

interface PropertyAnalysisSectionProps {
  address: string;
  show: boolean;
}

const PropertyAnalysisSection = ({ address, show }: PropertyAnalysisSectionProps) => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const captureAndStoreImage = async () => {
      try {
        // Only capture and store image if we have an address
        if (address) {
          const imageData = await captureStreetViewForModel(address);
          await storePropertyData(address, imageData);
        }
      } catch (error) {
        console.error('Error capturing and storing image:', error);
      }
    };

    captureAndStoreImage();
  }, [address]);
  
  useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail && event.detail.jobId) {
        setCurrentJobId(event.detail.jobId);
      }
    };

    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    };
  }, []);

  // Check auth status and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && currentJobId) {
        // Store the return URL in localStorage
        localStorage.setItem('redirectAfterAuth', window.location.pathname);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [currentJobId, navigate]);
  
  if (!show) return null;

  return (
    <motion.div
      key="analysis-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-10 py-12 px-4 sm:px-0"
    >
      <div className="mx-auto w-full max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30"
        >
          <h2 className="text-2xl font-bold text-[#8B5CF6] mb-4 text-center">Property 3D Model & Map View</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PropertyMap address={address} />
            </div>
            <div>
              <Property3DModel 
                jobId={currentJobId} 
                address={address} 
                className="h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="mx-auto w-full max-w-5xl">
        <PropertyInsights address={address} />
      </div>
    </motion.div>
  );
};

export default PropertyAnalysisSection;
