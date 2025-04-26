import React from 'react';
import { Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const InternetAssetDetail = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Internet Bandwidth Asset</h1>
        <p className="text-muted-foreground">Monetized with FastNet</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Your Bandwidth</p>
              <p>1 Gbps Fiber</p>
            </div>
            <div>
              <p className="text-sm font-medium">Shared Portion</p>
              <p>40% (400 Mbps)</p>
            </div>
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p>January 10, 2023</p>
            </div>
            <div>
              <p className="text-sm font-medium">Minimum Guaranteed Speed</p>
              <p>600 Mbps (for your use)</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Network Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Mon', usage: 32, packet_loss: 0.2 },
              { name: 'Tue', usage: 40, packet_loss: 0.1 },
              { name: 'Wed', usage: 28, packet_loss: 0.3 },
              { name: 'Thu', usage: 36, packet_loss: 0.2 },
              { name: 'Fri', usage: 42, packet_loss: 0.1 },
              { name: 'Sat', usage: 26, packet_loss: 0.4 },
              { name: 'Sun', usage: 20, packet_loss: 0.2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Bar yAxisId="left" dataKey="usage" fill="#4A3F68" name="Bandwidth Usage %" />
              <Bar yAxisId="right" dataKey="packet_loss" fill="#FF8042" name="Packet Loss %" />
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
        <p className="mb-4">Your internet bandwidth sharing agreement with FastNet allows you to earn passive income by sharing unused bandwidth. FastNet uses this bandwidth for their distributed network services.</p>
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Eye className="mr-2 h-4 w-4" /> View Contract
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Bandwidth Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default InternetAssetDetail;
