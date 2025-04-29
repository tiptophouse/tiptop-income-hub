
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import Search3D from '@/components/ui/icon/Search3D';
import { toast } from '@/components/ui/use-toast';
import Property3DModelDisplay from '@/components/Property3DModelDisplay';
import { generatePropertyModels } from '@/utils/modelGeneration';

const AddressModelSearch = () => {
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a property address to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setHasSearched(true);
    
    try {
      toast({
        title: "Processing",
        description: "Generating 3D model for this address...",
      });

      // Call the generatePropertyModels function to get the model job ID
      const jobId = await generatePropertyModels(address);
      
      if (jobId) {
        setModelJobId(jobId);
        toast({
          title: "Success",
          description: "3D model generation started. It may take a few minutes to complete.",
        });
      } else {
        throw new Error("Failed to start model generation");
      }
    } catch (error) {
      console.error("Error in 3D model generation:", error);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again.",
        variant: "destructive"
      });
      
      // Create a fallback model ID for demo purposes
      setModelJobId("demo-model-" + Math.random().toString(36).substring(2, 8));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search3D className="h-5 w-5 text-tiptop-accent" />
          Property Model Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                type="text"
                placeholder="Enter property address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
                disabled={isProcessing}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-tiptop-accent hover:bg-tiptop-accent/90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Generate 3D Model"
              )}
            </Button>
          </div>
        </form>
        
        {hasSearched && (
          <div className="mt-4">
            {modelJobId ? (
              <Property3DModelDisplay
                jobId={modelJobId}
                address={address}
              />
            ) : (
              <div className="bg-gray-100 rounded-md p-8 text-center">
                <p className="text-gray-500">Enter an address to generate a 3D model</p>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden map container for potential use by the model generation process */}
        <div ref={mapContainerRef} style={{ display: 'none', height: '400px' }}></div>
      </CardContent>
    </Card>
  );
};

export default AddressModelSearch;
