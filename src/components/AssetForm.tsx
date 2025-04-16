
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import GoogleMapComponent from './GoogleMapComponent';
import PropertyInsights from './PropertyInsights';
import { Search } from 'lucide-react';

interface FormData {
  address: string;
  assets: {
    rooftop: boolean;
    internet: boolean;
    pool: boolean;
    parking: boolean;
    storage: boolean;
  };
}

const AssetForm = () => {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    assets: {
      rooftop: false,
      internet: false,
      pool: false,
      parking: false,
      storage: false,
    }
  });
  const [addressSubmitted, setAddressSubmitted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, address: e.target.value }));
  };

  const handleAssetChange = (asset: keyof FormData['assets']) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        [asset]: !prev.assets[asset]
      }
    }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your property address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Address submitted:", formData.address);
    setAddressSubmitted(true);
    
    // Scroll to map
    setTimeout(() => {
      mapRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the form inputs
    console.log("Form submitted:", formData);
    
    // Show a success toast
    toast({
      title: "Assets Submitted",
      description: "We've received your property information. Redirecting to recommendations...",
    });
    
    // This would redirect to a dashboard in a real app
    setTimeout(() => {
      document.getElementById('dashboard-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  const assetOptions = [
    { id: 'rooftop', label: 'Rooftop' },
    { id: 'internet', label: 'Internet Bandwidth' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'parking', label: 'Parking Space' },
    { id: 'storage', label: 'Storage Space' },
  ];

  return (
    <section id="asset-form" className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-tiptop-accent/20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Unlock Your Property's Earning Potential</h2>
        
        {!addressSubmitted ? (
          <form onSubmit={handleAddressSubmit} className="mb-6">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="address" className="text-lg">Property Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder="Enter your property address"
                  className="flex-1"
                  value={formData.address}
                  onChange={handleAddressChange}
                />
                <Button type="submit" className="bg-tiptop-accent hover:bg-tiptop-accent/90">
                  <Search className="mr-2 h-4 w-4" /> Locate
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div ref={mapRef}>
                <GoogleMapComponent address={formData.address} />
              </div>
              <PropertyInsights address={formData.address} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-medium mb-4">What assets would you like to monetize?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {assetOptions.map((asset) => (
                  <div key={asset.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={asset.id} 
                      checked={formData.assets[asset.id as keyof FormData['assets']]}
                      onCheckedChange={() => handleAssetChange(asset.id as keyof FormData['assets'])}
                      className="border-tiptop-accent data-[state=checked]:bg-tiptop-accent"
                    />
                    <Label 
                      htmlFor={asset.id}
                      className="text-base cursor-pointer"
                    >
                      {asset.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-tiptop-accent hover:bg-tiptop-accent/90 py-6"
              >
                Calculate My Earning Potential
              </Button>
            </form>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default AssetForm;
