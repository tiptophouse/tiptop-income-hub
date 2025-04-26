import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { distributionData, earningsData } from '../dashboardData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as ReChartPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface DashboardChartsProps {
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  aiRevenueDescription: string;
}

export const DashboardCharts = ({ earnings, aiRevenueDescription }: DashboardChartsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-medium">Asset Distribution</CardTitle>
        <CardDescription>Revenue by asset type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 md:h-64">
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
        <CardTitle className="text-base md:text-lg font-medium">Today's Revenue</CardTitle>
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
    
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-medium">Revenue Over Time</CardTitle>
        <CardDescription>Monthly breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 md:h-64">
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
);
