
import React from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const EVAssetDetailPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-medium">EV Charging Asset</h1>
            <p className="text-muted-foreground text-sm">Monetized with ChargePro</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card>
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">Charging Station Details</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
              <div className="space-y-3 sm:space-y-4">
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
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''} h-48 sm:h-64`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { day: 'Mon', hours: 5.2, kwh: 42 },
                    { day: 'Tue', hours: 6.7, kwh: 54 },
                    { day: 'Wed', hours: 4.3, kwh: 35 },
                    { day: 'Thu', hours: 7.1, kwh: 57 },
                    { day: 'Fri', hours: 8.4, kwh: 68 },
                    { day: 'Sat', hours: 9.2, kwh: 74 },
                    { day: 'Sun', hours: 7.5, kwh: 60 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Bar dataKey="hours" fill="#82ca9d" name="Usage Hours" />
                  <Bar dataKey="kwh" fill="#8884d8" name="kWh Delivered" />
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
            <p className="mb-4">Your EV charging stations are accessible through the ChargePro network. Users can find and pay for charging through their mobile app. You earn revenue for every kWh delivered.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Eye className="mr-2 h-4 w-4" /> View Contract
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Settings className="mr-2 h-4 w-4" /> Adjust Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EVAssetDetailPage;
