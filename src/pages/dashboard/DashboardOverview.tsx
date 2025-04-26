
import React from 'react';
import { DollarSign, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AssetTable } from './components/AssetTable';
import { EarningsSection } from './components/EarningsSection';
import { DashboardCharts } from './components/DashboardCharts';

interface DashboardOverviewProps {
  userName: string;
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
  aiRevenueDescription: string;
}

const DashboardOverview = ({ userName, earnings, activeAssets, totalPotentialAssets, pendingActions, aiRevenueDescription }: DashboardOverviewProps) => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="mb-8">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Hello, {userName}! Here's your property summary.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Earnings</CardTitle>
          <CardDescription>Monthly passive income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-2xl font-bold">${earnings.monthly}</div>
              <p className="text-xs text-muted-foreground">${earnings.yearly} annually</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Active Assets</CardTitle>
          <CardDescription>Currently monetized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <div className="text-2xl font-bold">{activeAssets}/{totalPotentialAssets}</div>
              <p className="text-xs text-muted-foreground">Potential assets</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Pending Actions</CardTitle>
          <CardDescription>Tasks requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <div>
              <div className="text-2xl font-bold">{pendingActions}</div>
              <p className="text-xs text-muted-foreground">Actions to complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <DashboardCharts earnings={earnings} aiRevenueDescription={aiRevenueDescription} />
    
    <AssetTable />
    
    <EarningsSection />
  </div>
);

export default DashboardOverview;
