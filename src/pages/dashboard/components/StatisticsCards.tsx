
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign, Check, AlertTriangle } from 'lucide-react';

interface StatisticsCardsProps {
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
}

const StatisticsCards = ({ earnings, activeAssets, totalPotentialAssets, pendingActions }: StatisticsCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-medium">Total Earnings</CardTitle>
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
);

export default StatisticsCards;

