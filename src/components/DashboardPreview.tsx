
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Wifi, Building, Home, Coins, BoxIcon, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const monthlyData = [
  { month: 'Jan', rooftop: 720, internet: 320, parking: 150, storage: 50 },
  { month: 'Feb', rooftop: 750, internet: 340, parking: 160, storage: 55 },
  { month: 'Mar', rooftop: 780, internet: 360, parking: 170, storage: 60 },
  { month: 'Apr', rooftop: 800, internet: 380, parking: 180, storage: 65 },
  { month: 'May', rooftop: 850, internet: 400, parking: 190, storage: 70 },
  { month: 'Jun', rooftop: 900, internet: 420, parking: 200, storage: 75 },
  { month: 'Jul', rooftop: 920, internet: 440, parking: 210, storage: 80 },
  { month: 'Aug', rooftop: 890, internet: 430, parking: 205, storage: 77 },
  { month: 'Sep', rooftop: 850, internet: 410, parking: 195, storage: 73 },
  { month: 'Oct', rooftop: 800, internet: 390, parking: 185, storage: 68 },
  { month: 'Nov', rooftop: 750, internet: 350, parking: 165, storage: 58 },
  { month: 'Dec', rooftop: 720, internet: 320, parking: 150, storage: 50 },
];

const DashboardPreview = () => {
  const isMobile = useIsMobile();

  const calculateTodayRevenue = () => {
    const lastMonth = monthlyData[monthlyData.length - 1];
    return (lastMonth.rooftop + lastMonth.internet + lastMonth.parking + lastMonth.storage) / 30;
  };

  const calculateMonthlyAverage = () => {
    const total = monthlyData.reduce((acc, month) => {
      return acc + month.rooftop + month.internet + month.parking + month.storage;
    }, 0);
    return Math.round(total / monthlyData.length);
  };

  const calculateYearlyTotal = () => {
    return monthlyData.reduce((acc, month) => {
      return acc + month.rooftop + month.internet + month.parking + month.storage;
    }, 0);
  };

  return (
    <section id="dashboard-preview" className="py-12 md:py-20 px-4 md:px-12 max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-medium mb-3 text-gray-800">Dashboard Preview</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get a glimpse of how you can track and maximize your passive income.
        </p>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium text-violet-400">Dashboard</h1>
              <p className="text-gray-700">Hello, Sarah! Here's your property summary.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center text-violet-400 mb-1">
                  <Building className="h-5 w-5 mr-2" />
                  <CardTitle className="text-lg font-medium">Property 3D Model</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full overflow-hidden rounded-lg bg-gray-50 aspect-video flex flex-col items-center justify-center p-4 text-center">
                  <Building className="h-16 w-16 text-gray-300 mb-2" />
                  <p className="text-gray-500">No 3D model available yet</p>
                  <p className="text-gray-400 text-sm">Use the Meshy API to generate a model</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center text-violet-400 mb-1">
                  <Home className="h-5 w-5 mr-2" />
                  <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <p className="font-medium text-gray-800">123 Main Street, Anytown, USA</p>
                  <p className="text-gray-600">
                    The property features a rooftop with good solar exposure, a rentable garden area, 
                    stable internet for bandwidth sharing, and available parking space. Nearby, neighbors 
                    are actively renting parking and garden spaces, showing strong local demand.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-violet-400 font-medium text-lg flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    Total Earnings
                  </h3>
                  <p className="text-gray-600 text-sm">Monthly passive income</p>
                  <p className="font-bold text-2xl text-gray-800">${calculateMonthlyAverage()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-violet-400 font-medium text-lg flex items-center">
                    <BoxIcon className="h-5 w-5 mr-2" />
                    Active Assets
                  </h3>
                  <p className="text-gray-600 text-sm">Currently monetized</p>
                  <p className="font-bold text-2xl text-gray-800">5 / 9</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-violet-400 font-medium text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Actions
                  </h3>
                  <p className="text-gray-600 text-sm">Tasks requiring attention</p>
                  <p className="font-bold text-2xl text-gray-800">3</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6">
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Legend wrapperStyle={{fontSize: 12, color: '#6b7280'}} />
                <Bar dataKey="rooftop" name="Rooftop Solar" fill="#a78bfa" stackId="a" />
                <Bar dataKey="internet" name="Internet" fill="#7c3aed" stackId="a" />
                <Bar dataKey="parking" name="Parking" fill="#c4b5fd" stackId="a" />
                <Bar dataKey="storage" name="Storage" fill="#ddd6fe" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;
