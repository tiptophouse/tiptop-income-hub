
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun, Wifi, CarFront, SwimmingPool, Storage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface AssetOpportunitiesProps {
  address: string;
}

const AssetOpportunities: React.FC<AssetOpportunitiesProps> = ({ address }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  
  const immediateOpportunities = [
    {
      id: "solar",
      title: "Rooftop Solar",
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      estimatedIncome: "$120-150/month",
      details: "Your roof has excellent solar potential with 92% sun exposure"
    },
    {
      id: "bandwidth",
      title: "Internet Bandwidth",
      icon: <Wifi className="h-8 w-8 text-blue-500" />,
      estimatedIncome: "$75-95/month",
      details: "Share unused bandwidth with 0.5% packet loss detected"
    },
    {
      id: "parking",
      title: "Parking Space",
      icon: <CarFront className="h-8 w-8 text-purple-500" />,
      estimatedIncome: "$80-120/month",
      details: "2 parking spaces detected available for sharing"
    }
  ];
  
  const additionalOpportunities = [
    {
      id: "pool",
      title: "Swimming Pool",
      icon: <SwimmingPool className="h-8 w-8 text-blue-500" />,
      estimatedIncome: "$200-300/month",
      details: "Rent your pool hourly during summer months"
    },
    {
      id: "storage",
      title: "Storage Space",
      icon: <Storage className="h-8 w-8 text-green-500" />,
      estimatedIncome: "$60-90/month",
      details: "Unused garage or basement space can be rented"
    }
  ];

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to continue",
        variant: "destructive"
      });
      return;
    }
    setShowAdditionalInfo(true);
    
    // Scroll to additional info section
    setTimeout(() => {
      const additionalInfoSection = document.getElementById('additional-info');
      if (additionalInfoSection) {
        additionalInfoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">Immediate Asset Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {immediateOpportunities.map(asset => (
            <Card key={asset.id} className="border border-[#E5DEFF] hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-[#F3ECFF] p-3 rounded-full">
                  {asset.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#6E59A5]">{asset.title}</CardTitle>
                  <p className="text-lg font-bold text-[#8B5CF6]">{asset.estimatedIncome}</p>
                </div>
                <Checkbox 
                  id={`check-${asset.id}`} 
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={() => handleAssetToggle(asset.id)}
                  className="h-6 w-6 border-2 border-[#8B5CF6] rounded-md"
                />
              </CardHeader>
              <CardContent>
                <p className="text-[#552B1B]">{asset.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">Other Monetization Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalOpportunities.map(asset => (
            <Card key={asset.id} className="border border-[#E5DEFF] hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-[#F3ECFF] p-3 rounded-full">
                  {asset.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#6E59A5]">{asset.title}</CardTitle>
                  <p className="text-lg font-bold text-[#8B5CF6]">{asset.estimatedIncome}</p>
                </div>
                <Checkbox 
                  id={`check-${asset.id}`}
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={() => handleAssetToggle(asset.id)}
                  className="h-6 w-6 border-2 border-[#8B5CF6] rounded-md"
                />
              </CardHeader>
              <CardContent>
                <p className="text-[#552B1B]">{asset.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <Button 
          onClick={handleContinue}
          className="bg-[#AA94E2] hover:bg-[#9b87f5] text-white px-8 py-6 text-lg rounded-full"
        >
          Continue with Selected Assets
        </Button>
      </div>

      {showAdditionalInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          id="additional-info"
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">Additional Information Required</h2>
          
          <div className="space-y-8">
            {selectedAssets.includes('solar') && (
              <Card className="border-l-4 border-l-yellow-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6E59A5]">Rooftop Solar Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Roof Area Available (sq. ft)
                    </label>
                    <input 
                      type="text" 
                      defaultValue="750" 
                      className="w-full p-2 border border-[#E5DEFF] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Roof Type
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="flat">Flat</option>
                      <option value="pitched" selected>Pitched</option>
                      <option value="curved">Curved</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedAssets.includes('bandwidth') && (
              <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6E59A5]">Internet Bandwidth Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[#552B1B] mb-2">Packet Loss: <span className="font-semibold text-green-600">0.5% (Excellent)</span></p>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Suggested Bandwidth Allowance
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="100">Limit to 100MB</option>
                      <option value="500" selected>Limit to 500MB</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Available Hours
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="night">Night Only (12am-6am)</option>
                      <option value="offpeak" selected>Off-peak Hours</option>
                      <option value="all">All Hours</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedAssets.includes('parking') && (
              <Card className="border-l-4 border-l-purple-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6E59A5]">Parking Space Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[#552B1B] mb-2">Spaces Available: <span className="font-semibold">2</span></p>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Spaces to Rent
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="1">1 Space</option>
                      <option value="2" selected>2 Spaces</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Availability Schedule
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="weekdays">Weekdays Only</option>
                      <option value="weekends" selected>Weekends Only</option>
                      <option value="all">All Days</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedAssets.includes('pool') && (
              <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6E59A5]">Swimming Pool Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Pool Size
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Available Months
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="summer" selected>Summer Only</option>
                      <option value="extended">Extended Season</option>
                      <option value="all">Year-Round (Heated)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedAssets.includes('storage') && (
              <Card className="border-l-4 border-l-green-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6E59A5]">Storage Space Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Space Type
                    </label>
                    <select className="w-full p-2 border border-[#E5DEFF] rounded-md">
                      <option value="garage" selected>Garage</option>
                      <option value="basement">Basement</option>
                      <option value="shed">Shed/Outbuilding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#552B1B] mb-1">
                      Approximate Size (sq. ft)
                    </label>
                    <input 
                      type="text" 
                      defaultValue="120" 
                      className="w-full p-2 border border-[#E5DEFF] rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-6 text-lg rounded-full"
              >
                Complete & View Earnings Estimate
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssetOpportunities;
