import React from 'react';
import { Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { earningsData } from '../dashboardData';

const SolarAssetDetail = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Solar Panel Asset</h1>
        <p className="text-muted-foreground">Monetized with SolarCity</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">System Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">System Size</p>
              <p>5.8 kW</p>
            </div>
            <div>
              <p className="text-sm font-medium">Panels Installed</p>
              <p>15 x 385W panels</p>
            </div>
            <div>
              <p className="text-sm font-medium">Installation Date</p>
              <p>March 15, 2023</p>
            </div>
            <div>
              <p className="text-sm font-medium">Contract Length</p>
              <p>20 years</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AA94E2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#AA94E2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="solar" stroke="#AA94E2" fillOpacity={1} fill="url(#solar)" name="Solar" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">System Design</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Solar panel layout design</p>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Your rooftop solar agreement with SolarCity generates passive income by selling excess energy back to the grid. The system is fully maintained by SolarCity at no cost to you.</p>
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Eye className="mr-2 h-4 w-4" /> View Contract
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SolarAssetDetail;
