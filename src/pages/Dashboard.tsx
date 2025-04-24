
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Sun, 
  Wifi, 
  Car, 
  PenSquare, 
  Settings, 
  User, 
  LogOut, 
  BarChart3,
  PlusCircle,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FormData {
  address: string;
  assets: Record<string, boolean>;
  additionalInfo: Record<string, string>;
}

const earningsData = [
  { name: 'Jan', earnings: 840 },
  { name: 'Feb', earnings: 940 },
  { name: 'Mar', earnings: 1020 },
  { name: 'Apr', earnings: 1120 },
  { name: 'May', earnings: 1240 },
  { name: 'Jun', earnings: 1340 },
  { name: 'Jul', earnings: 1380 },
  { name: 'Aug', earnings: 1320 },
  { name: 'Sep', earnings: 1160 },
  { name: 'Oct', earnings: 1080 },
  { name: 'Nov', earnings: 940 },
  { name: 'Dec', earnings: 840 },
];

const Dashboard = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [activeAssets, setActiveAssets] = useState<string[]>([]);
  const [inactiveAssets, setInactiveAssets] = useState<string[]>([]);
  
  useEffect(() => {
    // Get saved form data from localStorage
    const savedData = localStorage.getItem('assetFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as FormData;
      setFormData(parsedData);
      
      // Determine active and inactive assets
      const active: string[] = [];
      const inactive: string[] = [];
      
      Object.entries(parsedData.assets).forEach(([asset, isActive]) => {
        if (isActive) {
          active.push(asset);
        } else {
          inactive.push(asset);
        }
      });
      
      setActiveAssets(active);
      setInactiveAssets(inactive);
    }
  }, []);
  
  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'rooftop':
        return <Sun className="h-5 w-5 text-white" />;
      case 'internet':
        return <Wifi className="h-5 w-5 text-white" />;
      case 'parking':
        return <Car className="h-5 w-5 text-white" />;
      default:
        return <Home className="h-5 w-5 text-white" />;
    }
  };
  
  const getAssetName = (assetType: string) => {
    const assetMap: Record<string, string> = {
      'rooftop': 'Rooftop',
      'internet': 'Internet Bandwidth',
      'pool': 'Swimming Pool',
      'parking': 'Parking Space',
      'storage': 'Storage Space',
      'garden': 'Garden',
      'car': 'Car'
    };
    
    return assetMap[assetType] || assetType;
  };
  
  const getAssetValue = (assetType: string) => {
    const assetMap: Record<string, string> = {
      'rooftop': '$100/mo',
      'internet': '$120/mo',
      'pool': 'Contact Partner',
      'parking': '$80/mo',
      'storage': 'Contact Partner',
      'garden': '$50/mo',
      'car': 'Contact Partner'
    };
    
    return assetMap[assetType] || '$0/mo';
  };
  
  const getAssetDescription = (assetType: string) => {
    const assetMap: Record<string, string> = {
      'rooftop': 'Solar panel potential available',
      'internet': '25.00 Mbps, FastNet, 35ms',
      'pool': '160 sqft pool detected',
      'parking': '2 parking spaces detected',
      'storage': '220 sqft warehouse detected',
      'garden': 'Spacious garden with high yield',
      'car': 'Car monetization details'
    };
    
    return assetMap[assetType] || 'Asset details';
  };
  
  const getTotalEarnings = () => {
    let total = 0;
    
    activeAssets.forEach(asset => {
      if (asset === 'rooftop') total += 100;
      if (asset === 'internet') total += 120;
      if (asset === 'parking') total += 80;
      if (asset === 'garden') total += 50;
    });
    
    return total;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-primary w-full md:w-64 md:min-h-screen p-4 md:p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-xl text-white">Tiptop</span>
          </div>
          
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Home className="mr-2 h-5 w-5" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <BarChart3 className="mr-2 h-5 w-5" /> Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <PenSquare className="mr-2 h-5 w-5" /> Contracts
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Settings className="mr-2 h-5 w-5" /> Settings
            </Button>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">John Doe</h3>
                <p className="text-xs text-white/70">john@example.com</p>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <LogOut className="mr-2 h-5 w-5" /> Sign Out
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 font-poppins text-tiptop-dark">Your Property Dashboard</h1>
              <p className="text-muted-foreground">{formData?.address || 'Your property'}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <Button className="bg-tiptop-accent hover:bg-tiptop-accent/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
              </Button>
            </div>
          </div>
          
          {/* Earnings summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Monthly Earnings</CardTitle>
                <CardDescription>Current passive income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-tiptop-accent">${getTotalEarnings()}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Active Assets</CardTitle>
                <CardDescription>Currently monetized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-tiptop-accent">{activeAssets.length}</span>
                  <span className="text-sm text-muted-foreground">/{Object.keys(formData?.assets || {}).length} potential</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Annual Projection</CardTitle>
                <CardDescription>Yearly earnings potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-tiptop-accent">${getTotalEarnings() * 12}</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Earnings chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Earnings Projection</CardTitle>
              <CardDescription>Monthly projected earnings over the next year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" fillOpacity={1} fill="url(#earnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Assets tabs */}
          <Tabs defaultValue="active" className="mb-8">
            <TabsList>
              <TabsTrigger value="active">Active Assets</TabsTrigger>
              <TabsTrigger value="available">Available Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAssets.map((asset) => (
                  <Card key={asset} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="flex">
                      <div className="bg-tiptop-accent p-4 flex items-center justify-center">
                        {getAssetIcon(asset)}
                      </div>
                      <CardHeader className="pb-2 flex-1">
                        <CardTitle className="text-lg font-medium">{getAssetName(asset)}</CardTitle>
                        <CardDescription>{getAssetDescription(asset)}</CardDescription>
                      </CardHeader>
                    </div>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl font-semibold text-tiptop-accent">{getAssetValue(asset)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-tiptop-accent hover:text-tiptop-accent/90 hover:bg-tiptop-accent/10">
                          Manage <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {activeAssets.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Active Assets</h3>
                    <p className="text-muted-foreground mb-4">You haven't activated any assets for monetization yet.</p>
                    <Button className="bg-tiptop-accent hover:bg-tiptop-accent/90">
                      Start Monetizing
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveAssets.map((asset) => (
                  <Card key={asset} className="overflow-hidden transition-all hover:shadow-md opacity-80 hover:opacity-100">
                    <div className="flex">
                      <div className="bg-gray-400 p-4 flex items-center justify-center">
                        {getAssetIcon(asset)}
                      </div>
                      <CardHeader className="pb-2 flex-1">
                        <CardTitle className="text-lg font-medium">{getAssetName(asset)}</CardTitle>
                        <CardDescription>{getAssetDescription(asset)}</CardDescription>
                      </CardHeader>
                    </div>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl font-semibold text-gray-500">{getAssetValue(asset)}</span>
                        </div>
                        <Button size="sm" className="bg-tiptop-accent hover:bg-tiptop-accent/90">
                          Activate <PlusCircle className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {inactiveAssets.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Available Assets</h3>
                    <p className="text-muted-foreground mb-4">You have already activated all potential assets for monetization.</p>
                    <Button variant="outline">
                      Explore New Opportunities
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
