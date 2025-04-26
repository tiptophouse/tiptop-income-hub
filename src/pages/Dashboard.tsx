
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  ChevronRight, 
  DollarSign, 
  Edit, 
  Eye, 
  FileText, 
  Trash2,
  PieChart,
  Calendar,
  Search,
  AlertTriangle,
  Check,
  Info,
  TrendingUp,
  Wifi,
  Sun,
  Settings,
  Bell,
  Plus,
  Car,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart as ReChartPieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";

// Mock data
const assetTypes = ['rooftop', 'internet', 'parking', 'storage', 'garden'];
const assetStatuses = ['active', 'pending', 'inactive'];

const mockAssets = [
  { id: 1, type: 'rooftop', status: 'active', revenue: 150, partner: 'SolarCity', action: 'None', description: 'Solar panel installation' },
  { id: 2, type: 'internet', status: 'active', revenue: 120, partner: 'FastNet', action: 'Update bandwidth settings', description: 'Internet bandwidth sharing' },
  { id: 3, type: 'ev', status: 'active', revenue: 90, partner: 'ChargePro', action: 'None', description: 'EV charging stations' },
  { id: 4, type: 'storage', status: 'pending', revenue: 0, partner: 'StoreBox', action: 'Sign contract', description: 'Garage storage space' },
  { id: 5, type: 'garden', status: 'inactive', revenue: 0, partner: 'None', action: 'Complete registration', description: 'Backyard garden space' },
];

const distributionData = [
  { name: 'Solar', value: 150, color: '#AA94E2' },
  { name: 'Internet', value: 120, color: '#4A3F68' },
  { name: 'EV Charging', value: 90, color: '#B5EAD7' },
  { name: 'Other', value: 40, color: '#FFD7BA' },
];

const earningsData = [
  { month: 'Jan', solar: 120, internet: 100, ev: 80, storage: 0 },
  { month: 'Feb', solar: 130, internet: 110, ev: 85, storage: 0 },
  { month: 'Mar', solar: 140, internet: 115, ev: 90, storage: 0 },
  { month: 'Apr', solar: 150, internet: 120, ev: 90, storage: 0 },
  { month: 'May', solar: 145, internet: 125, ev: 95, storage: 0 },
  { month: 'Jun', solar: 155, internet: 130, ev: 100, storage: 20 },
];

const connectedAccounts = [
  { name: 'SolarCity', status: 'Connected', lastSync: '2023-04-22' },
  { name: 'FastNet', status: 'Connected', lastSync: '2023-04-20' },
  { name: 'ChargePro', status: 'Connected', lastSync: '2023-04-18' },
  { name: 'StoreBox', status: 'Pending', lastSync: 'N/A' },
];

// Component for Solar Asset details
const SolarAssetDetail = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Solar Panel Asset</h1>
        <p className="text-muted-foreground">Monetized with SolarCity</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">System Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">System Size</p>
              <p>5.8 kW</p>
            </div>
            <div>
              <p className="text-sm font-medium">Panels Installed</p>
              <p>15 x 385W panels</p>
            </div>
            <div>
              <p className="text-sm font-medium">Installation Date</p>
              <p>March 15, 2023</p>
            </div>
            <div>
              <p className="text-sm font-medium">Contract Length</p>
              <p>20 years</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AA94E2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#AA94E2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="solar" stroke="#AA94E2" fillOpacity={1} fill="url(#solar)" name="Solar" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">System Design</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Solar panel layout design</p>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Your rooftop solar agreement with SolarCity generates passive income by selling excess energy back to the grid. The system is fully maintained by SolarCity at no cost to you.</p>
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Eye className="mr-2 h-4 w-4" /> View Contract
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Component for Internet Asset details
const InternetAssetDetail = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Internet Bandwidth Asset</h1>
        <p className="text-muted-foreground">Monetized with FastNet</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Your Bandwidth</p>
              <p>1 Gbps Fiber</p>
            </div>
            <div>
              <p className="text-sm font-medium">Shared Portion</p>
              <p>40% (400 Mbps)</p>
            </div>
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p>January 10, 2023</p>
            </div>
            <div>
              <p className="text-sm font-medium">Minimum Guaranteed Speed</p>
              <p>600 Mbps (for your use)</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Network Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Mon', usage: 32, packet_loss: 0.2 },
              { name: 'Tue', usage: 40, packet_loss: 0.1 },
              { name: 'Wed', usage: 28, packet_loss: 0.3 },
              { name: 'Thu', usage: 36, packet_loss: 0.2 },
              { name: 'Fri', usage: 42, packet_loss: 0.1 },
              { name: 'Sat', usage: 26, packet_loss: 0.4 },
              { name: 'Sun', usage: 20, packet_loss: 0.2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Bar yAxisId="left" dataKey="usage" fill="#4A3F68" name="Bandwidth Usage %" />
              <Bar yAxisId="right" dataKey="packet_loss" fill="#FF8042" name="Packet Loss %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Your internet bandwidth sharing agreement with FastNet allows you to earn passive income by sharing unused bandwidth. FastNet uses this bandwidth for their distributed network services.</p>
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Eye className="mr-2 h-4 w-4" /> View Contract
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Bandwidth Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Component for EV Asset details
const EVAssetDetail = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">EV Charging Asset</h1>
        <p className="text-muted-foreground">Monetized with ChargePro</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Charging Station Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Charging Points</p>
              <p>2 Level 2 Chargers</p>
            </div>
            <div>
              <p className="text-sm font-medium">Your Energy Cost</p>
              <p>$0.12 per kWh</p>
            </div>
            <div>
              <p className="text-sm font-medium">Customer Price</p>
              <p>$0.35 per kWh</p>
            </div>
            <div>
              <p className="text-sm font-medium">Your Revenue Share</p>
              <p>60% ($0.138 per kWh)</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { day: 'Mon', hours: 5.2, kwh: 42 },
              { day: 'Tue', hours: 6.7, kwh: 54 },
              { day: 'Wed', hours: 4.3, kwh: 35 },
              { day: 'Thu', hours: 7.1, kwh: 57 },
              { day: 'Fri', hours: 8.4, kwh: 68 },
              { day: 'Sat', hours: 9.2, kwh: 74 },
              { day: 'Sun', hours: 7.5, kwh: 60 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="hours" fill="#82ca9d" name="Usage Hours" />
              <Bar dataKey="kwh" fill="#8884d8" name="kWh Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Your EV charging stations are accessible through the ChargePro network. Users can find and pay for charging through their mobile app. You earn revenue for every kWh delivered.</p>
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Eye className="mr-2 h-4 w-4" /> View Contract
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Adjust Pricing
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Component for Add Asset page
const AddAssetPage = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Add New Asset</h1>
        <p className="text-muted-foreground">Start monetizing a new property asset</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sun className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Solar Panels</h3>
          <p className="text-sm text-center text-muted-foreground">Monetize your rooftop with solar panel installation</p>
          <p className="text-primary font-medium">$100-$200/month</p>
        </CardContent>
      </Card>
      
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Internet Bandwidth</h3>
          <p className="text-sm text-center text-muted-foreground">Share your unused internet bandwidth</p>
          <p className="text-primary font-medium">$50-$150/month</p>
        </CardContent>
      </Card>
      
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">EV Charging</h3>
          <p className="text-sm text-center text-muted-foreground">Install EV charging stations</p>
          <p className="text-primary font-medium">$75-$300/month</p>
        </CardContent>
      </Card>
      
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Storage Space</h3>
          <p className="text-sm text-center text-muted-foreground">Rent out unused storage space</p>
          <p className="text-primary font-medium">$50-$200/month</p>
        </CardContent>
      </Card>
      
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Garden Space</h3>
          <p className="text-sm text-center text-muted-foreground">Rent your garden for urban farming</p>
          <p className="text-primary font-medium">$40-$120/month</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Component for Dashboard Overview page
const DashboardOverview = () => {
  const [userName, setUserName] = useState('John');
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [activeAssets, setActiveAssets] = useState(0);
  const [totalPotentialAssets, setTotalPotentialAssets] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  
  useEffect(() => {
    const active = mockAssets.filter(asset => asset.status === 'active').length;
    const pending = mockAssets.filter(asset => asset.action !== 'None').length;
    
    setActiveAssets(active);
    setTotalPotentialAssets(mockAssets.length);
    setPendingActions(pending);
    
    const dailyTotal = mockAssets.reduce((sum, asset) => sum + (asset.status === 'active' ? asset.revenue / 30 : 0), 0);
    const monthlyTotal = mockAssets.reduce((sum, asset) => sum + (asset.status === 'active' ? asset.revenue : 0), 0);
    
    setEarnings({
      daily: parseFloat(dailyTotal.toFixed(2)),
      monthly: monthlyTotal,
      yearly: monthlyTotal * 12
    });
  }, []);
  
  const renderStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> Active</span>;
    } else if (status === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Info className="w-3 h-3 mr-1" /> Inactive</span>;
    }
  };

  const aiRevenueDescription = `Today's solar generation was 12% above average due to clear skies. Your internet bandwidth was utilized at 78% capacity with peak usage during evening hours. The EV charging stations were used for 7.5 hours today.`;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Hello, {userName}! Here's your property summary.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Earnings</CardTitle>
            <CardDescription>Monthly passive income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div>
                <div className="text-2xl font-bold">${earnings.monthly}</div>
                <p className="text-xs text-muted-foreground">${earnings.yearly} annually</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Assets</CardTitle>
            <CardDescription>Currently monetized</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="text-2xl font-bold">{activeAssets}/{totalPotentialAssets}</div>
                <p className="text-xs text-muted-foreground">Potential assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Actions</CardTitle>
            <CardDescription>Tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <div className="text-2xl font-bold">{pendingActions}</div>
                <p className="text-xs text-muted-foreground">Actions to complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Asset Distribution</CardTitle>
            <CardDescription>Revenue by asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartPieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </ReChartPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Today's Revenue</CardTitle>
            <CardDescription>Daily performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">${earnings.daily}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              {aiRevenueDescription}
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Revenue Over Time</CardTitle>
            <CardDescription>Monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="solar" fill="#AA94E2" stackId="a" name="Solar" />
                  <Bar dataKey="internet" fill="#4A3F68" stackId="a" name="Internet" />
                  <Bar dataKey="ev" fill="#B5EAD7" stackId="a" name="EV Charging" />
                  <Bar dataKey="storage" fill="#FFD7BA" stackId="a" name="Storage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Your Assets</h2>
          <Button variant="outline" size="sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {asset.type === 'rooftop' && <Sun className="h-4 w-4 text-primary" />}
                            {asset.type === 'internet' && <Wifi className="h-4 w-4 text-primary" />}
                            {asset.type === 'ev' && <Car className="h-4 w-4 text-primary" />}
                            {asset.type === 'storage' && <FileText className="h-4 w-4 text-primary" />}
                            {asset.type === 'garden' && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        {asset.status === 'active' ? (
                          <span className="font-medium">${asset.revenue}/mo</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{asset.partner}</TableCell>
                      <TableCell>
                        {asset.action !== 'None' ? (
                          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 p-0">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {asset.action}
                          </Button>
                        ) : (
                          <span className="text-green-600 flex items-center">
                            <Check className="h-4 w-4 mr-1" /> 
                            All set
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Earnings</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" /> Filter Date
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-1" /> Asset Type
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssets
                      .filter(asset => asset.status === 'active')
                      .map((asset) => (
                        <TableRow key={`earning-${asset.id}`}>
                          <TableCell className="font-medium">
                            {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                          </TableCell>
                          <TableCell>${asset.revenue}</TableCell>
                          <TableCell>April 2023</TableCell>
                          <TableCell>{renderStatusBadge(asset.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Earnings Chart</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#AA94E2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#AA94E2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" 
                          dataKey={(data) => data.solar + data.internet + data.ev + data.storage} 
                          stroke="#9b87f5" 
                          fillOpacity={1} 
                          fill="url(#total)" 
                          name="Total" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('dashboard');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          navigate('/login');
          return;
        }
        
        if (!data.session) {
          console.info('No active session found, redirecting to login');
          navigate('/login');
          return;
        }
        
        console.info('Active session found:', data.session);
        setUser(data.session.user);
      } catch (error) {
        console.error('Session check exception:', error);
        navigate('/login');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info('Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (session) {
          setUser(session.user);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Exception signing out:', error);
    }
  };

  // Get active assets for sidebar menu
  const activeAssets = mockAssets.filter(asset => asset.status === 'active');

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <span className="font-bold text-xl text-primary">Tiptop</span>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedView === 'dashboard'} 
                  onClick={() => setSelectedView('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Dynamic menu items for active assets */}
              {activeAssets.map((asset) => (
                <SidebarMenuItem key={asset.id}>
                  <SidebarMenuButton 
                    isActive={selectedView === asset.type} 
                    onClick={() => setSelectedView(asset.type)}
                  >
                    {asset.type === 'rooftop' && <Sun className="h-4 w-4 mr-2" />}
                    {asset.type === 'internet' && <Wifi className="h-4 w-4 mr-2" />}
                    {asset.type === 'ev' && <Car className="h-4 w-4 mr-2" />}
                    {asset.type === 'storage' && <FileText className="h-4 w-4 mr-2" />}
                    {asset.type === 'garden' && <Check className="h-4 w-4 mr-2" />}
                    <span>
                      {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedView === 'add'} 
                  onClick={() => setSelectedView('add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Asset</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          {selectedView === 'dashboard' && <DashboardOverview />}
          {selectedView === 'rooftop' && <SolarAssetDetail />}
          {selectedView === 'internet' && <InternetAssetDetail />}
          {selectedView === 'ev' && <EVAssetDetail />}
          {selectedView === 'add' && <AddAssetPage />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
