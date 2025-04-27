
import React from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const solarData = [
  { month: 'Jan', solar: 120 },
  { month: 'Feb', solar: 135 },
  { month: 'Mar', solar: 140 },
  { month: 'Apr', solar: 145 },
  { month: 'May', solar: 150 },
  { month: 'Jun', solar: 155 },
];

const SolarAssetDetailPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-medium">Solar Panel Asset</h1>
            <p className="text-muted-foreground text-sm">Monetized with SolarCity</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card>
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">System Details</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
              <div className="space-y-3 sm:space-y-4">
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
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''} h-48 sm:h-64`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={solarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AA94E2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#AA94E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="solar" stroke="#AA94E2" fillOpacity={1} fill="url(#solar)" name="Solar" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-4 sm:mb-8">
          <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
            <CardTitle className="text-base sm:text-lg font-medium">System Design</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
            <div className="relative bg-white rounded-lg overflow-hidden h-48 sm:h-64">
              <img 
                src="/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg"
                alt="Solar Panel Layout"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-medium">Optimized Panel Layout</p>
                <p className="text-sm opacity-90">15 panels · 5.8 kW total capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
            <CardTitle className="text-base sm:text-lg font-medium">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
            <p className="mb-4">Your rooftop solar agreement with SolarCity generates passive income by selling excess energy back to the grid. The system is fully maintained by SolarCity at no cost to you.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Eye className="mr-2 h-4 w-4" /> View Contract
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <FileText className="mr-2 h-4 w-4" /> Download Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SolarAssetDetailPage;
