
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { distributionData, earningsData } from '../dashboardData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as ReChartPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardChartsProps {
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  aiRevenueDescription: string;
}

export const DashboardCharts = ({ earnings, aiRevenueDescription }: DashboardChartsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-medium">Asset Distribution</CardTitle>
          <CardDescription>Revenue by asset type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReChartPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 60 : 80}
                  dataKey="value"
                  label={({name, percent}) => 
                    isMobile 
                      ? `${(percent * 100).toFixed(0)}%` 
                      : `${name} ${(percent * 100).toFixed(0)}%`
                  }
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
        <CardHeader className="pb-2">
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
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-medium">Revenue Over Time</CardTitle>
          <CardDescription>Monthly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 25 : 35} />
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
};

export default DashboardCharts;
