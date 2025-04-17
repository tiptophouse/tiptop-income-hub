
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import GoogleMapComponent from './GoogleMapComponent';
import PropertyMap from './PropertyMap';
import PropertyInsights from './PropertyInsights';
import { Search, ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface FormData {
  address: string;
  assets: {
    rooftop: boolean;
    internet: boolean;
    pool: boolean;
    parking: boolean;
    storage: boolean;
    garden: boolean;
    car: boolean;
  };
  additionalInfo: {
    rooftop: string;
    internet: string;
    pool: string;
    parking: string;
    storage: string;
    garden: string;
    car: string;
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
      garden: false,
      car: false
    },
    additionalInfo: {
      rooftop: '',
      internet: '',
      pool: '',
      parking: '',
      storage: '',
      garden: '',
      car: ''
    }
  });
  
  const [stage, setStage] = useState<'address' | 'map' | 'analysis' | 'assets' | 'questionnaire' | 'signin'>('address');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAddressFound = (e: CustomEvent<{ address: string }>) => {
      setFormData(prev => ({ ...prev, address: e.detail.address }));
      setStage('map');
      
      // Scroll to map
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    
    document.addEventListener('addressFound', handleAddressFound as EventListener);
    
    return () => {
      document.removeEventListener('addressFound', handleAddressFound as EventListener);
    };
  }, []);

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

  const handleInfoChange = (asset: keyof FormData['additionalInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [asset]: value
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
    
    setStage('map');
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis completion
    setTimeout(() => {
      setAnalysisComplete(true);
      setStage('analysis');
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleContinueToAssets = () => {
    setStage('assets');
  };

  const handleContinueToQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault();
    const hasSelectedAssets = Object.values(formData.assets).some(value => value);
    
    if (!hasSelectedAssets) {
      toast({
        title: "No Assets Selected",
        description: "Please select at least one asset to monetize.",
        variant: "destructive"
      });
      return;
    }
    
    setStage('questionnaire');
  };

  const handleSubmitQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data in localStorage for later retrieval
    localStorage.setItem('assetFormData', JSON.stringify(formData));
    
    // Move to sign in stage
    setStage('signin');
  };

  const handleSignIn = (provider: 'google' | 'email') => {
    // Simulate sign in/up process
    // In a real app, this would redirect to auth provider
    
    // For demo, we'll just redirect to a dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const assetOptions = [
    { id: 'rooftop', label: 'Rooftop', value: '$100/mo', description: 'Solar panel potential available' },
    { id: 'internet', label: 'Internet Bandwidth', value: '$120/mo', description: '25.00 Mbps, FastNet, 35ms, IP: 192.168.1.2' },
    { id: 'pool', label: 'Swimming Pool', value: 'Contact Partner', description: '160 sqft pool detected, restroom available' },
    { id: 'parking', label: 'Parking Space', value: '$80/mo', description: '2 parking spaces detected, with EV charging' },
    { id: 'storage', label: 'Storage Space', value: 'Contact Partner', description: '220 sqft warehouse detected' },
    { id: 'garden', label: 'Garden', value: '$50/mo', description: 'Spacious garden with high yield potential' },
    { id: 'car', label: 'Car', value: 'Contact Partner', description: 'Car monetization details unavailable' },
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
        <AnimatePresence mode="wait">
          {stage === 'address' && (
            <motion.div
              key="address-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Enter Your Property Address</h2>
              
              <form onSubmit={handleAddressSubmit} className="mb-6">
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="address" className="text-lg font-inter text-tiptop-dark">Property Address</Label>
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
            </motion.div>
          )}
          
          {stage === 'map' && (
            <motion.div
              key="map-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={mapRef}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Analyzing Your Property</h2>
              
              <div className="mb-6">
                <PropertyMap 
                  address={formData.address} 
                  onZoomComplete={handleAnalysisComplete}
                />
                
                {isAnalyzing && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-tiptop-accent mr-2"></div>
                    <span className="text-tiptop-accent">Analyzing property potential...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {stage === 'analysis' && (
            <motion.div
              key="analysis-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Property Analysis Complete</h2>
              
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PropertyMap address={formData.address} />
                  <PropertyInsights address={formData.address} />
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleContinueToAssets}
                  className="bg-tiptop-accent hover:bg-tiptop-accent/90 px-8"
                >
                  View Monetization Opportunities <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {stage === 'assets' && (
            <motion.div
              key="assets-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Monetization Opportunities</h2>
              
              <form onSubmit={handleContinueToQuestionnaire}>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 font-inter text-tiptop-accent">Immediate Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assetOptions.slice(0, 4).map((asset) => (
                      <div key={asset.id} className="flex items-start p-3 border rounded-md bg-white/50 hover:shadow-md transition-shadow">
                        <Checkbox 
                          id={asset.id} 
                          checked={formData.assets[asset.id as keyof FormData['assets']]}
                          onCheckedChange={() => handleAssetChange(asset.id as keyof FormData['assets'])}
                          className="mt-1 border-tiptop-accent data-[state=checked]:bg-tiptop-accent"
                        />
                        <div className="ml-3">
                          <Label 
                            htmlFor={asset.id}
                            className="text-base cursor-pointer font-medium font-inter text-tiptop-dark"
                          >
                            {asset.label}
                          </Label>
                          <div className="text-tiptop-accent font-medium">{asset.value}</div>
                          <p className="text-sm text-gray-500">{asset.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 font-inter text-tiptop-accent">More Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assetOptions.slice(4).map((asset) => (
                      <div key={asset.id} className="flex items-start p-3 border rounded-md bg-white/50 hover:shadow-md transition-shadow">
                        <Checkbox 
                          id={asset.id} 
                          checked={formData.assets[asset.id as keyof FormData['assets']]}
                          onCheckedChange={() => handleAssetChange(asset.id as keyof FormData['assets'])}
                          className="mt-1 border-tiptop-accent data-[state=checked]:bg-tiptop-accent"
                        />
                        <div className="ml-3">
                          <Label 
                            htmlFor={asset.id}
                            className="text-base cursor-pointer font-medium font-inter text-tiptop-dark"
                          >
                            {asset.label}
                          </Label>
                          <div className="text-tiptop-accent font-medium">{asset.value}</div>
                          <p className="text-sm text-gray-500">{asset.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-tiptop-accent hover:bg-tiptop-accent/90 py-6"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}
          
          {stage === 'questionnaire' && (
            <motion.div
              key="questionnaire-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Additional Information Required</h2>
              
              <form onSubmit={handleSubmitQuestionnaire}>
                {Object.entries(formData.assets)
                  .filter(([_, selected]) => selected)
                  .map(([asset]) => {
                    const assetOption = assetOptions.find(opt => opt.id === asset);
                    return (
                      <div key={asset} className="mb-6 p-4 border rounded-md bg-white/80">
                        <h3 className="font-medium mb-2 font-inter text-tiptop-dark">{assetOption?.label}:</h3>
                        <p className="text-sm mb-3 text-gray-500">{assetOption?.description}</p>
                        
                        {asset === 'rooftop' && (
                          <div>
                            <p className="text-sm mb-2">Solar panel potential available</p>
                            <Label htmlFor={`${asset}-info`} className="text-sm mb-1 block">Please upload your utility bill or provide your energy usage details.</Label>
                            <Textarea 
                              id={`${asset}-info`}
                              value={formData.additionalInfo[asset as keyof FormData['additionalInfo']]}
                              onChange={(e) => handleInfoChange(asset as keyof FormData['additionalInfo'], e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                        
                        {asset === 'pool' && (
                          <div>
                            <p className="text-sm mb-2">160 sqft pool detected, restroom available</p>
                            <Label htmlFor={`${asset}-info`} className="text-sm mb-1 block">Describe the pool (size, condition, additional features like an outside restroom).</Label>
                            <Textarea 
                              id={`${asset}-info`}
                              value={formData.additionalInfo[asset as keyof FormData['additionalInfo']]}
                              onChange={(e) => handleInfoChange(asset as keyof FormData['additionalInfo'], e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                        
                        {asset === 'internet' && (
                          <div>
                            <p className="text-sm mb-2">25.00 Mbps, FastNet, 35ms, IP: 192.168.1.2</p>
                            <Label htmlFor={`${asset}-info`} className="text-sm mb-1 block">Please confirm your internet speed and ISP details.</Label>
                            <Textarea 
                              id={`${asset}-info`}
                              value={formData.additionalInfo[asset as keyof FormData['additionalInfo']]}
                              onChange={(e) => handleInfoChange(asset as keyof FormData['additionalInfo'], e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                        
                        {(asset !== 'rooftop' && asset !== 'pool' && asset !== 'internet') && (
                          <div>
                            <Label htmlFor={`${asset}-info`} className="text-sm mb-1 block">Please provide additional details about your {assetOption?.label.toLowerCase()}.</Label>
                            <Textarea 
                              id={`${asset}-info`}
                              value={formData.additionalInfo[asset as keyof FormData['additionalInfo']]}
                              onChange={(e) => handleInfoChange(asset as keyof FormData['additionalInfo'], e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                
                <Button 
                  type="submit" 
                  className="w-full bg-tiptop-accent hover:bg-tiptop-accent/90 py-6"
                >
                  Submit Information
                </Button>
              </form>
            </motion.div>
          )}
          
          {stage === 'signin' && (
            <motion.div
              key="signin-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-poppins text-tiptop-accent">Sign In to View Your Property Insights</h2>
              <p className="text-center mb-8 text-tiptop-dark font-inter">Please sign in to see your property's earning potential and get connected with monetization partners.</p>
              
              <div className="flex flex-col items-center gap-4">
                <Button 
                  className="w-full max-w-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
                  onClick={() => handleSignIn('google')}
                >
                  <img src="/placeholder.svg" alt="Google" className="w-5 h-5 mr-2" /> Sign in with Google
                </Button>
                
                <div className="flex items-center w-full max-w-md my-4">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                
                <Button 
                  className="w-full max-w-md bg-tiptop-accent hover:bg-tiptop-accent/90"
                  onClick={() => handleSignIn('email')}
                >
                  Sign in with Email
                </Button>
                
                <p className="mt-4 text-sm text-gray-500 font-inter">
                  Don't have an account? <span className="text-tiptop-accent cursor-pointer">Sign up</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default AssetForm;
