
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Sun, TrendingUp } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 85 },
  { month: 'Feb', revenue: 95 },
  { month: 'Mar', revenue: 110 },
  { month: 'Apr', revenue: 120 },
  { month: 'May', revenue: 135 },
  { month: 'Jun', revenue: 140 },
  { month: 'Jul', revenue: 135 },
  { month: 'Aug', revenue: 125 },
  { month: 'Sep', revenue: 115 },
  { month: 'Oct', revenue: 105 },
  { month: 'Nov', revenue: 90 },
  { month: 'Dec', revenue: 80 },
];

const systemDetails = {
  systemSize: '5.8 kW',
  panelsInstalled: '17 x 341W panels',
  installationDate: 'March 15, 2023',
  contractLength: '25 years',
  roofCoverage: '29%'
};

const performanceMetrics = {
  yearlyProduction: '7,800 kWh',
  averageDaily: '21.4 kWh',
  systemEfficiency: '82%',
  roi: '160.7%',
  paybackProgress: '10.4%',
  billReduction: '66%'
};

const SolarAssetDetail: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-purple-600">Solar Panel Asset</h1>
        <p className="text-gray-600">Monetized with SolarCity</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-amber-500" />
              System Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">System Size</p>
                  <p className="font-medium">{systemDetails.systemSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Panels Installed</p>
                  <p className="font-medium">{systemDetails.panelsInstalled}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Installation Date</p>
                  <p className="font-medium">{systemDetails.installationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Length</p>
                  <p className="font-medium">{systemDetails.contractLength}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roof Coverage</p>
                  <p className="font-medium">{systemDetails.roofCoverage}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Financial Performance
              </CardTitle>
              <div className="text-right">
                <div className="text-sm text-gray-600">Monthly Revenue</div>
                <div className="text-2xl font-bold text-green-600">$121</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#9b87f5" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Performance</CardTitle>
          <p className="text-sm text-gray-600">Energy production and efficiency metrics</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-purple-600">Energy Production</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Yearly Production</p>
                  <p className="font-medium">{performanceMetrics.yearlyProduction}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Daily</p>
                  <p className="font-medium">{performanceMetrics.averageDaily}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">System Efficiency</p>
                  <p className="font-medium">{performanceMetrics.systemEfficiency}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-purple-600">Financial Performance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="font-medium">{performanceMetrics.roi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payback Progress</p>
                  <p className="font-medium">{performanceMetrics.paybackProgress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bill Reduction</p>
                  <p className="font-medium">{performanceMetrics.billReduction}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarAssetDetail;
