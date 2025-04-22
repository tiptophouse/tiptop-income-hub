
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const calculateTodayRevenue = () => {
    // Example calculation based on last month's data
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
    <section id="dashboard-preview" className="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Earnings Dashboard</h2>
        <p className="text-lg text-tiptop-dark/70 max-w-2xl mx-auto">
          Get a preview of how you can track and maximize your passive income.
        </p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-tiptop-accent/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-tiptop-accent p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${calculateTodayRevenue().toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Monthly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${calculateMonthlyAverage()}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Yearly Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${calculateYearlyTotal()}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rooftop" name="Rooftop Solar" fill="#AA94E2" stackId="a" />
                <Bar dataKey="internet" name="Internet Sharing" fill="#4A3F68" stackId="a" />
                <Bar dataKey="parking" name="Parking Space" fill="#B5EAD7" stackId="a" />
                <Bar dataKey="storage" name="Storage" fill="#FFD7BA" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;
