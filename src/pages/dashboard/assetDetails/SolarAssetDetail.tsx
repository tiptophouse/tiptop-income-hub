import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Jan', revenue: 200 },
  { month: 'Feb', revenue: 220 },
  { month: 'Mar', revenue: 240 },
  { month: 'Apr', revenue: 260 },
  { month: 'May', revenue: 280 },
];

const SolarAssetDetail: React.FC = () => {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Performance</CardTitle>
          <CardDescription>Monthly revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarAssetDetail;
