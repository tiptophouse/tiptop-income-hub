
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3,
  Calendar,
  CircleCheck,
  CircleX,
  Edit,
  FileText,
  Info,
  Plus,
  Settings,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { toast } from "@/hooks/use-toast";

interface FormData {
  address: string;
  assets: Record<string, boolean>;
  additionalInfo: Record<string, string>;
}

interface Asset {
  type: string;
  status: 'active' | 'pending' | 'inactive';
  revenue: string;
  partner: string;
  action: string;
  date?: string;
}

// Mock data for revenue over time
const revenueData = [
  { name: 'Jan', value: 350 },
  { name: 'Feb', value: 320 },
  { name: 'Mar', value: 450 },
  { name: 'Apr', value: 500 },
  { name: 'May', value: 480 },
  { name: 'Jun', value: 520 },
  { name: 'Jul', value: 580 },
  { name: 'Aug', value: 600 },
  { name: 'Sep', value: 580 },
];

// Mock data for asset distribution
const assetDistributionData = [
  { name: 'Rooftop', value: 350, color: '#9b87f5' },
  { name: 'Bandwidth', value: 300, color: '#7E69AB' },
  { name: 'Parking', value: 200, color: '#D6BCFA' },
  { name: 'Garden', value: 150, color: '#F1F0FB' },
];

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(1200.00);
  const [activeAssets, setActiveAssets] = useState(4);
  const [pendingActions, setPendingActions] = useState(2);
  const [todaysRevenue, setTodaysRevenue] = useState(150);
  
  // Get mock data from localStorage
  useEffect(() => {
    // Get saved form data from localStorage
    const savedData = localStorage.getItem('assetFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as FormData;
      setFormData(parsedData);
      
      // Generate mock assets based on the form data
      const mockAssets: Asset[] = [
        {
          type: 'Rooftop',
          status: 'active',
          revenue: '$100/mo',
          partner: 'Neighbor.com',
          action: 'Sign Contract',
          date: '2025-04-01'
        },
        {
          type: 'Bandwidth',
          status: 'active',
          revenue: '$120/mo',
          partner: 'Grass',
          action: 'Download App',
          date: '2025-04-02'
        },
        {
          type: 'Parking',
          status: 'pending',
          revenue: '$80/mo',
          partner: 'SpotHero',
          action: 'Define Hours',
          date: '2025-04-03'
        },
        {
          type: 'Garden',
          status: 'inactive',
          revenue: '$50/mo',
          partner: 'GreenScape',
          action: 'N/A',
          date: '2025-04-04'
        },
      ];
      
      setAssets(mockAssets);
    }

    // Mock user name
    setUserName('Eduardo Saba');
    setLoading(false);
  }, []);
  
  const handleAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `You clicked on ${action}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'inactive':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getAIDescription = () => {
    return (
      <p className="text-sm text-neutral-600 mt-2">
        Today's solar output was 8% higher due to clear skies. 73% of available bandwidth was utilized, 
        and parking spots were occupied for 86% of the day.
      </p>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl text-purple-300 font-normal">Dashboard</h1>
            <h2 className="text-xl text-purple-400 font-light mt-1">Hello, {userName}!</h2>
          </div>
          <Link to="/">
            <Button className="bg-purple-300 hover:bg-purple-200 text-white">
              Tiptop Home
            </Button>
          </Link>
        </div>

        {/* Main summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="flex flex-col items-center p-6">
              <h3 className="text-2xl font-bold">${totalEarnings.toFixed(2)}</h3>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="flex flex-col items-center p-6">
              <h3 className="text-2xl font-bold">{activeAssets}</h3>
              <p className="text-sm text-gray-500">Active Assets ({activeAssets}/9 potential)</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="flex flex-col items-center p-6">
              <h3 className="text-2xl font-bold">{pendingActions}</h3>
              <p className="text-sm text-gray-500">Pending Actions</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and data visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Asset Distribution */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-normal">Assets Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {assetDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Today's Revenue */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-normal">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <div className="text-2xl font-bold text-[#552B1B]">${todaysRevenue.toFixed(2)}</div>
              {getAIDescription()}
            </CardContent>
          </Card>
          
          {/* Revenue Over Time */}
          <Card className="border border-gray-100 shadow-sm lg:col-span-1">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-normal">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Your Assets Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-purple-400">Your Assets</h2>
            <Button className="bg-purple-300 hover:bg-purple-200">
              <Plus className="mr-1 h-4 w-4" /> Add New Asset
            </Button>
          </div>
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Monetization Partner</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset, i) => (
                    <TableRow key={i}>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(asset.status)}
                          <span className={getStatusColor(asset.status) + " capitalize"}>
                            {asset.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{asset.revenue}</TableCell>
                      <TableCell>{asset.partner}</TableCell>
                      <TableCell>
                        {asset.action !== "N/A" ? (
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-blue-500"
                            onClick={() => handleAction(asset.action)}
                          >
                            {asset.action}
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-500 h-7"
                            onClick={() => handleAction(`Edit ${asset.type}`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-500 h-7"
                            onClick={() => handleAction(`View ${asset.type}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-500 h-7"
                            onClick={() => handleAction(`Details for ${asset.type}`)}
                          >
                            Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 h-7"
                            onClick={() => handleAction(`Remove ${asset.type}`)}
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Earnings Section */}
        <div className="mb-8">
          <h2 className="text-xl text-purple-400 mb-4">Earnings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex gap-2 mb-4">
                  <div className="relative">
                    <input 
                      type="date" 
                      className="p-2 border rounded-md"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                  </div>
                  <select className="p-2 border rounded-md">
                    <option>All Asset Types</option>
                    <option>Rooftop</option>
                    <option>Bandwidth</option>
                    <option>Parking</option>
                    <option>Garden</option>
                  </select>
                  <select className="p-2 border rounded-md">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Type</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset, i) => (
                      <TableRow key={i}>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.revenue}</TableCell>
                        <TableCell>{asset.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 text-sm text-gray-500">
                  Page 1 of 1
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-normal">Earnings Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">
                  (simulated)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl text-purple-400 mb-4">Profile</h2>
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">User Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> Eduardo Saba</p>
                    <p><span className="font-medium">Email:</span> eduardosaba@gmail.com</p>
                    <Button className="bg-purple-300 hover:bg-purple-200 mt-4">
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Connected Accounts</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Swimply</li>
                    <li>SpotHero</li>
                    <li>Neighbor.com</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Notifications & Settings</h3>
                  <p className="text-gray-600 mb-4">Notification settings and account preferences go here.</p>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
