
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Sun, Wifi, CarFront, Flower, Droplet, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AssetAdditionalInfoProps {
  selectedAssets: string[];
  onComplete: () => void;
  insights?: any;
}

const AssetAdditionalInfo: React.FC<AssetAdditionalInfoProps> = ({ 
  selectedAssets,
  onComplete,
  insights
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Pre-populate form with AI insights if available
    const initialData: Record<string, any> = {};
    
    if (insights?.monetization_opportunities) {
      const mo = insights.monetization_opportunities;
      
      if (mo.rooftop_solar && selectedAssets.includes('solar')) {
        initialData.solarRoofArea = mo.rooftop_solar.usable_rooftop_sq_ft || '';
        initialData.solarKwCapacity = mo.rooftop_solar.max_kw_installed || '';
      }
      
      if (mo.internet_bandwidth && selectedAssets.includes('bandwidth')) {
        initialData.internetSpeed = mo.internet_bandwidth.shareable_capacity_mbps || '';
        initialData.internetUploadSpeed = Math.round(mo.internet_bandwidth.shareable_capacity_mbps * 0.3) || '';
      }
      
      if (mo.parking_space && selectedAssets.includes('parking')) {
        initialData.parkingSpaces = mo.parking_space.spaces_available_for_rent || '';
        initialData.parkingType = 'driveway';
      }
      
      if (mo.garden_space && selectedAssets.includes('garden')) {
        initialData.gardenArea = mo.garden_space.garden_sq_ft || '';
        initialData.gardenType = 'vegetable';
      }
    }
    
    // Default values for other fields
    selectedAssets.forEach(asset => {
      if (asset === 'pool' && !initialData.poolSize) {
        initialData.poolSize = '400';
        initialData.poolType = 'inground';
      }
      
      if (asset === 'storage' && !initialData.storageSize) {
        initialData.storageSize = '100';
        initialData.storageType = 'garage';
      }
    });
    
    return initialData;
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user) {
        // In a real app, you would save this data to your database
        console.log('Submitting asset data:', { 
          userId: user.id,
          selectedAssets,
          assetDetails: formData
        });
        
        toast({
          title: "Details saved successfully",
          description: "We'll now redirect you to authenticate with Google"
        });
      }
      
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      console.error('Error saving asset details:', error);
      toast({
        title: "Error",
        description: "Failed to save your asset details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (assetId: string) => {
    switch (assetId) {
      case 'solar':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'bandwidth':
        return <Wifi className="h-6 w-6 text-blue-500" />;
      case 'parking':
        return <CarFront className="h-6 w-6 text-purple-500" />;
      case 'pool':
        return <Droplet className="h-6 w-6 text-blue-400" />;
      case 'storage':
        return <Store className="h-6 w-6 text-green-500" />;
      case 'garden':
        return <Flower className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };

  const getAssetForm = (assetId: string) => {
    switch (assetId) {
      case 'solar':
        return (
          <div className="space-y-4" id="additional-info">
            <div>
              <Label htmlFor="solarRoofArea">Available Roof Area (sq ft)</Label>
              <Input 
                id="solarRoofArea"
                name="solarRoofArea"
                type="number"
                value={formData.solarRoofArea || ''}
                onChange={handleChange}
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <Label htmlFor="solarKwCapacity">Potential kW Capacity</Label>
              <Input 
                id="solarKwCapacity"
                name="solarKwCapacity"
                type="number" 
                step="0.1"
                value={formData.solarKwCapacity || ''}
                onChange={handleChange}
                placeholder="e.g. 5.5"
              />
            </div>
            <div>
              <Label htmlFor="solarRoofType">Roof Type</Label>
              <select
                id="solarRoofType"
                name="solarRoofType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.solarRoofType || 'flat'}
                onChange={handleSelectChange}
              >
                <option value="flat">Flat</option>
                <option value="sloped">Sloped</option>
                <option value="metal">Metal</option>
                <option value="tile">Tile</option>
              </select>
            </div>
          </div>
        );
      
      case 'bandwidth':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="internetSpeed">Download Speed (Mbps)</Label>
              <Input 
                id="internetSpeed"
                name="internetSpeed"
                type="number"
                value={formData.internetSpeed || ''}
                onChange={handleChange}
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <Label htmlFor="internetUploadSpeed">Upload Speed (Mbps)</Label>
              <Input 
                id="internetUploadSpeed"
                name="internetUploadSpeed"
                type="number"
                value={formData.internetUploadSpeed || ''}
                onChange={handleChange}
                placeholder="e.g. 20"
              />
            </div>
            <div>
              <Label htmlFor="internetProvider">Internet Provider</Label>
              <Input 
                id="internetProvider"
                name="internetProvider"
                type="text"
                value={formData.internetProvider || ''}
                onChange={handleChange}
                placeholder="e.g. Comcast"
              />
            </div>
          </div>
        );
      
      case 'parking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="parkingSpaces">Number of Spaces</Label>
              <Input 
                id="parkingSpaces"
                name="parkingSpaces"
                type="number"
                value={formData.parkingSpaces || ''}
                onChange={handleChange}
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <Label htmlFor="parkingType">Parking Type</Label>
              <select
                id="parkingType"
                name="parkingType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.parkingType || 'driveway'}
                onChange={handleSelectChange}
              >
                <option value="driveway">Driveway</option>
                <option value="garage">Garage</option>
                <option value="carport">Carport</option>
                <option value="street">Street</option>
              </select>
            </div>
          </div>
        );
      
      case 'pool':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="poolSize">Pool Size (sq ft)</Label>
              <Input 
                id="poolSize"
                name="poolSize"
                type="number"
                value={formData.poolSize || ''}
                onChange={handleChange}
                placeholder="e.g. 400"
              />
            </div>
            <div>
              <Label htmlFor="poolType">Pool Type</Label>
              <select
                id="poolType"
                name="poolType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.poolType || 'inground'}
                onChange={handleSelectChange}
              >
                <option value="inground">In-ground</option>
                <option value="aboveground">Above Ground</option>
                <option value="infinity">Infinity</option>
                <option value="lap">Lap Pool</option>
              </select>
            </div>
          </div>
        );
      
      case 'storage':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="storageSize">Storage Size (sq ft)</Label>
              <Input 
                id="storageSize"
                name="storageSize"
                type="number"
                value={formData.storageSize || ''}
                onChange={handleChange}
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <Label htmlFor="storageType">Storage Type</Label>
              <select
                id="storageType"
                name="storageType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.storageType || 'garage'}
                onChange={handleSelectChange}
              >
                <option value="garage">Garage</option>
                <option value="basement">Basement</option>
                <option value="attic">Attic</option>
                <option value="shed">Shed</option>
              </select>
            </div>
          </div>
        );
        
      case 'garden':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="gardenArea">Garden Area (sq ft)</Label>
              <Input 
                id="gardenArea"
                name="gardenArea"
                type="number"
                value={formData.gardenArea || ''}
                onChange={handleChange}
                placeholder="e.g. 200"
              />
            </div>
            <div>
              <Label htmlFor="gardenType">Garden Type</Label>
              <select
                id="gardenType"
                name="gardenType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.gardenType || 'vegetable'}
                onChange={handleSelectChange}
              >
                <option value="vegetable">Vegetable Garden</option>
                <option value="flower">Flower Garden</option>
                <option value="herb">Herb Garden</option>
                <option value="community">Community Garden</option>
              </select>
            </div>
          </div>
        );
  
      default:
        return (
          <div className="text-gray-500 italic">
            No additional information needed.
          </div>
        );
    }
  };

  return (
    <motion.div
      id="additional-info"
      className="w-full mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
        Additional Information Required
      </h2>
      <p className="mb-8 text-gray-600">
        Please provide some additional details for each selected asset to help us create a personalized monetization plan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedAssets.map(asset => (
            <Card key={asset} className="border-[#E5DEFF]">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-[#F3ECFF] p-2 rounded-full">
                  {getAssetIcon(asset)}
                </div>
                <CardTitle className="text-lg">{asset.charAt(0).toUpperCase() + asset.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                {getAssetForm(asset)}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            type="submit"
            className="bg-[#AA94E2] hover:bg-[#9b87f5] text-white px-8 py-4 text-lg rounded-full font-fahkwang transition-all shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Complete & Authenticate"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssetAdditionalInfo;
