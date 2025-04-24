import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
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
  Columns,
  Settings,
  Bell
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
  Tooltip, 
  ResponsiveContainer,
  PieChart as ReChartPieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// Mock data for assets
const assetTypes = ['rooftop', 'internet', 'parking', 'storage', 'garden'];
const assetStatuses = ['active', 'pending', 'inactive'];

const mockAssets = [
  { id: 1, type: 'rooftop', status: 'active', revenue: 150, partner: 'SolarCity', action: 'None', description: 'Solar panel installation' },
  { id: 2, type: 'internet', status: 'active', revenue: 120, partner: 'FastNet', action: 'Update bandwidth settings', description: 'Internet bandwidth sharing' },
  { id: 3, type: 'parking', status: 'active', revenue: 90, partner: 'ParkShare', action: 'None', description: 'Driveway parking slot' },
  { id: 4, type: 'storage', status: 'pending', revenue: 0, partner: 'StoreBox', action: 'Sign contract', description: 'Garage storage space' },
  { id: 5, type: 'garden', status: 'inactive', revenue: 0, partner: 'None', action: 'Complete registration', description: 'Backyard garden space' },
];

// Mock data for distribution chart
const distributionData = [
  { name: 'Solar', value: 150, color: '#AA94E2' },
  { name: 'Internet', value: 120, color: '#4A3F68' },
  { name: 'Parking', value: 90, color: '#B5EAD7' },
  { name: 'Other', value: 40, color: '#FFD7BA' },
];

// Mock data for earnings over time
const earningsData = [
  { month: 'Jan', solar: 120, internet: 100, parking: 80, storage: 0 },
  { month: 'Feb', solar: 130, internet: 110, parking: 85, storage: 0 },
  { month: 'Mar', solar: 140, internet: 115, parking: 90, storage: 0 },
  { month: 'Apr', solar: 150, internet: 120, parking: 90, storage: 0 },
  { month: 'May', solar: 145, internet: 125, parking: 95, storage: 0 },
  { month: 'Jun', solar: 155, internet: 130, parking: 100, storage: 20 },
];

// Mock connected accounts
const connectedAccounts = [
  { name: 'SolarCity', status: 'Connected', lastSync: '2023-04-22' },
  { name: 'FastNet', status: 'Connected', lastSync: '2023-04-20' },
  { name: 'ParkShare', status: 'Connected', lastSync: '2023-04-18' },
  { name: 'StoreBox', status: 'Pending', lastSync: 'N/A' },
];

const Dashboard = () => {
  const [userName, setUserName] = useState('John');
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [activeAssets, setActiveAssets] = useState(0);
  const [totalPotentialAssets, setTotalPotentialAssets] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  
  useEffect(() => {
    // Calculate active assets and pending actions
    const active = mockAssets.filter(asset => asset.status === 'active').length;
    const pending = mockAssets.filter(asset => asset.action !== 'None').length;
    
    setActiveAssets(active);
    setTotalPotentialAssets(mockAssets.length);
    setPendingActions(pending);
    
    // Calculate earnings
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

  const aiRevenueDescription = `Today's solar generation was 12% above average due to clear skies. Your internet bandwidth was utilized at 78% capacity with peak usage during evening hours. The parking space was occupied for 6 hours today (75% of available time).`;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-primary w-64 min-h-screen p-5 hidden md:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-medium text-lg text-white">Tiptop</span>
          </div>
          
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <BarChart3 className="mr-2 h-5 w-5" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <PieChart className="mr-2 h-5 w-5" /> Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <FileText className="mr-2 h-5 w-5" /> Contracts
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Settings className="mr-2 h-5 w-5" /> Settings
            </Button>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-4 p-2 bg-white/10 rounded-md">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold">{userName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{userName}</h3>
                <p className="text-xs text-white/70">{userName.toLowerCase()}@example.com</p>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Hello, {userName}! Here's your property summary.</p>
          </div>
          
          {/* Summary cards */}
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
          
          {/* Data visualization cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Asset Distribution */}
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
                      <Tooltip />
                    </ReChartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Revenue */}
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
            
            {/* Revenue Over Time */}
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
                      <Tooltip />
                      <Bar dataKey="solar" fill="#AA94E2" stackId="a" name="Solar" />
                      <Bar dataKey="internet" fill="#4A3F68" stackId="a" name="Internet" />
                      <Bar dataKey="parking" fill="#B5EAD7" stackId="a" name="Parking" />
                      <Bar dataKey="storage" fill="#FFD7BA" stackId="a" name="Storage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Your Assets Section */}
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
                                {asset.type === 'rooftop' && <TrendingUp className="h-4 w-4 text-primary" />}
                                {asset.type === 'internet' && <Columns className="h-4 w-4 text-primary" />}
                                {asset.type === 'parking' && <ChevronRight className="h-4 w-4 text-primary" />}
                                {asset.type === 'storage' && <FileText className="h-4 w-4 text-primary" />}
                                {asset.type === 'garden' && <Check className="h-4 w-4 text-primary" />}
                              </div>
                              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
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
          
          {/* Earnings Section */}
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
                              <TableCell className="font-medium">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</TableCell>
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
                        <Tooltip />
                        <Area type="monotone" 
                              dataKey={(data) => data.solar + data.internet + data.parking + data.storage} 
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
          
          {/* Profile Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Your Profile</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{userName.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-muted-foreground">{userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{userName.toLowerCase()}@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-muted-foreground">April 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Connected Accounts</CardTitle>
                  <CardDescription>Monetization partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Partner</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Synced</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {connectedAccounts.map((account, index) => (
                          <TableRow key={`account-${index}`}>
                            <TableCell className="font-medium">{account.name}</TableCell>
                            <TableCell>
                              {account.status === 'Connected' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="w-3 h-3 mr-1" /> Connected
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{account.lastSync}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                {account.status === 'Connected' ? 'Manage' : 'Connect'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
