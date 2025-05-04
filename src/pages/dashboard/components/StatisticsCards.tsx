
import React from 'react';
import { AreaChart, DollarSign, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface StatisticsCardsProps {
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
  propertyInsights?: any;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  earnings,
  activeAssets,
  totalPotentialAssets,
  pendingActions,
  propertyInsights
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${earnings.daily}</div>
          <p className="text-sm text-gray-500">
            {propertyInsights ? "Based on property analysis" : "Estimated average"}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          <AreaChart className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${earnings.monthly}</div>
          <p className="text-sm text-gray-500">
            {propertyInsights ? "From active assets" : "Projected income"}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAssets}</div>
          <p className="text-sm text-gray-500">Out of {totalPotentialAssets} potential</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingActions}</div>
          <p className="text-sm text-gray-500">Tasks to improve property value</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
