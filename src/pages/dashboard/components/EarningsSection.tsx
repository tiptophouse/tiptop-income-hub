
import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAssets } from '../dashboardData';
import { renderStatusBadge } from '../utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsSectionProps {
  userName: string;
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  aiRevenueDescription?: string;
}

// Sample data for the earnings chart
const earningsChartData = [
  { month: 'Nov', revenue: 320 },
  { month: 'Dec', revenue: 340 },
  { month: 'Jan', revenue: 350 },
  { month: 'Feb', revenue: 360 },
  { month: 'Mar', revenue: 370 },
  { month: 'Apr', revenue: 380 },
];

export const EarningsSection: React.FC<EarningsSectionProps> = ({ 
  userName, 
  earnings, 
  aiRevenueDescription 
}) => {
  const isMobile = useIsMobile();

  const renderEarningsTable = () => {
    if (isMobile) {
      return (
        <Card>
          <CardContent className="p-3 space-y-3">
            {mockAssets
              .filter(asset => asset.status === 'active')
              .map((asset) => (
                <Card key={`earning-${asset.id}`} className="border shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                      </div>
                      <div className="text-sm">${asset.revenue}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>April 2023</div>
                      {renderStatusBadge(asset.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      );
    }

    return (
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
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">Earnings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" /> Filter Date
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1" /> Asset Type
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {renderEarningsTable()}
          
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-medium">Earnings Chart</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AA94E2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#AA94E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#AA94E2" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
