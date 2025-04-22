import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { Building, RotateCw, Download } from 'lucide-react';
import { checkModelStatus, getModelDownloadUrl } from '@/utils/meshyApi';

interface Property3DModelProps {
  jobId: string | null;
  address: string;
  className?: string;
}

const Property3DModel: React.FC<Property3DModelProps> = ({ 
  jobId, 
  address,
  className 
}) => {
  const [modelStatus, setModelStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rotateModel, setRotateModel] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    
    const checkStatus = async () => {
      try {
        // For demo purposes, we'll simulate a successful model generation
        // In a real app, you would use the actual API
        setTimeout(() => {
          setModelStatus('completed');
          setModelUrl('/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png');
          setIsLoading(false);
        }, 3000);
        
        /* Real API implementation would be:
        const status = await checkModelStatus(jobId);
        if (status.state === 'completed') {
          const url = await getModelDownloadUrl(jobId);
          setModelUrl(url);
          setModelStatus('completed');
        } else if (status.state === 'failed') {
          setModelStatus('failed');
        }
        */
      } catch (error) {
        console.error('Error checking model status:', error);
        setModelStatus('failed');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
    
    // Check status every 10 seconds
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [jobId]);

  const toggleRotate = () => {
    setRotateModel(!rotateModel);
  };

  const handleDownload = () => {
    if (!modelUrl) return;
    
    // In a real implementation, this would download the actual 3D model file
    window.open(modelUrl, '_blank');
    
    toast({
      title: "3D Model Downloaded",
      description: "Your property's 3D model has been downloaded."
    });
  };

  if (!jobId) return null;

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription>AI-generated 3D model for {address}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tiptop-accent rounded-full" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Generating 3D model...
            </p>
          </div>
        ) : modelStatus === 'failed' ? (
          <div className="text-center py-8">
            <Cube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Model Generation Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't generate a 3D model for this property.
            </p>
            <Button variant="outline" onClick={() => setIsLoading(true)}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <motion.div 
                className="w-full h-48 bg-gray-100 rounded-md overflow-hidden"
                animate={{ 
                  rotateY: rotateModel ? 360 : 0 
                }}
                transition={{ 
                  duration: 20, 
                  repeat: rotateModel ? Infinity : 0,
                  ease: "linear"
                }}
              >
                {modelUrl && (
                  <img 
                    src={modelUrl} 
                    alt="Property 3D Model" 
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
              
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-black/70 text-white hover:bg-black/80"
                  onClick={toggleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-black/70 text-white hover:bg-black/80"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Model ID: #{jobId.substring(0, 6)}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="w-full"
              >
                Download 3D Model
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Property3DModel;
