
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const monthlyData = [
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

const assetData = [
  { name: 'Rooftop Solar', value: 720, fill: '#AA94E2' },
  { name: 'Internet Sharing', value: 320, fill: '#4A3F68' },
  { name: 'Parking Space', value: 150, fill: '#B5EAD7' },
  { name: 'Storage', value: 50, fill: '#FFD7BA' },
];

const hourlyData = [
  { hour: '6 AM', solar: 10, internet: 5 },
  { hour: '8 AM', solar: 35, internet: 15 },
  { hour: '10 AM', solar: 65, internet: 25 },
  { hour: '12 PM', solar: 90, internet: 40 },
  { hour: '2 PM', solar: 80, internet: 45 },
  { hour: '4 PM', solar: 50, internet: 40 },
  { hour: '6 PM', solar: 20, internet: 30 },
  { hour: '8 PM', solar: 0, internet: 25 },
];

const DashboardPreview = () => {
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
        <div className="bg-tiptop-accent p-6 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Your Earnings Summary</h3>
            <div className="text-right">
              <p className="text-white/80 text-sm">Total Yearly Potential</p>
              <p className="text-3xl font-bold">$1,240</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-tiptop-accent data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-tiptop-accent data-[state=active]:text-white">By Asset</TabsTrigger>
            <TabsTrigger value="hourly" className="data-[state=active]:bg-tiptop-accent data-[state=active]:text-white">Hourly</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Yearly Earnings Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#AA94E2"
                      fill="#AA94E2"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-tiptop-dark/70 mb-1">Monthly Average</p>
                    <p className="text-3xl font-bold text-tiptop-accent">$103</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-tiptop-dark/70 mb-1">Peak Month</p>
                    <p className="text-3xl font-bold text-tiptop-accent">$138</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-tiptop-dark/70 mb-1">Growth Potential</p>
                    <p className="text-3xl font-bold text-tiptop-accent">+22%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Earnings by Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={assetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {assetData.map((asset, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: asset.fill }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <span className="font-semibold">${asset.value}/year</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Potential Income</span>
                      <span className="font-bold text-tiptop-accent text-xl">$1,240/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hourly">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Hourly Earning Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="solar" name="Solar Generation (W)" fill="#AA94E2" />
                    <Bar dataKey="internet" name="Internet Usage (Mbps)" fill="#4A3F68" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 text-sm text-tiptop-dark/70">
                  <p>* This graph shows the optimal times for different assets. Solar generation peaks at midday, while internet sharing is consistent throughout the day.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;
