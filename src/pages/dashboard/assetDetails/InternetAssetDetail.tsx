
import React from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const InternetAssetDetailPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-medium">Internet Bandwidth Asset</h1>
            <p className="text-muted-foreground text-sm">Monetized with FastNet</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card>
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">Connection Details</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
              <div className="space-y-3 sm:space-y-4">
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
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">Network Performance</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''} h-48 sm:h-64`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { name: 'Mon', usage: 32, packet_loss: 0.2 },
                    { name: 'Tue', usage: 40, packet_loss: 0.1 },
                    { name: 'Wed', usage: 28, packet_loss: 0.3 },
                    { name: 'Thu', usage: 36, packet_loss: 0.2 },
                    { name: 'Fri', usage: 42, packet_loss: 0.1 },
                    { name: 'Sat', usage: 26, packet_loss: 0.4 },
                    { name: 'Sun', usage: 20, packet_loss: 0.2 },
                  ]}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Bar yAxisId="left" dataKey="usage" fill="#4A3F68" name="Bandwidth Usage %" />
                  <Bar yAxisId="right" dataKey="packet_loss" fill="#FF8042" name="Packet Loss %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
            <CardTitle className="text-base sm:text-lg font-medium">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
            <p className="mb-4">Your internet bandwidth sharing agreement with FastNet allows you to earn passive income by sharing unused bandwidth. FastNet uses this bandwidth for their distributed network services.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Eye className="mr-2 h-4 w-4" /> View Contract
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Settings className="mr-2 h-4 w-4" /> Bandwidth Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InternetAssetDetailPage;
