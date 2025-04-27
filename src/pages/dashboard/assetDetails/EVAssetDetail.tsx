import React from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const EVAssetDetailPage = () => (
  <DashboardLayout onSignOut={() => {}}>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium">EV Charging Asset</h1>
          <p className="text-muted-foreground">Monetized with ChargePro</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Charging Station Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Charging Points</p>
                <p>2 Level 2 Chargers</p>
              </div>
              <div>
                <p className="text-sm font-medium">Your Energy Cost</p>
                <p>$0.12 per kWh</p>
              </div>
              <div>
                <p className="text-sm font-medium">Customer Price</p>
                <p>$0.35 per kWh</p>
              </div>
              <div>
                <p className="text-sm font-medium">Your Revenue Share</p>
                <p>60% ($0.138 per kWh)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', hours: 5.2, kwh: 42 },
                { day: 'Tue', hours: 6.7, kwh: 54 },
                { day: 'Wed', hours: 4.3, kwh: 35 },
                { day: 'Thu', hours: 7.1, kwh: 57 },
                { day: 'Fri', hours: 8.4, kwh: 68 },
                { day: 'Sat', hours: 9.2, kwh: 74 },
                { day: 'Sun', hours: 7.5, kwh: 60 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="hours" fill="#82ca9d" name="Usage Hours" />
                <Bar dataKey="kwh" fill="#8884d8" name="kWh Delivered" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your EV charging stations are accessible through the ChargePro network. Users can find and pay for charging through their mobile app. You earn revenue for every kWh delivered.</p>
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">
              <Eye className="mr-2 h-4 w-4" /> View Contract
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Adjust Pricing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default EVAssetDetailPage;
