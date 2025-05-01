
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Coins, BoxIcon, Clock } from 'lucide-react';

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

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  earnings,
  activeAssets,
  totalPotentialAssets,
  pendingActions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-violet-400 font-medium text-lg flex items-center">
              <Coins className="h-5 w-5 mr-2" />
              Total Earnings
            </h3>
            <p className="text-gray-600 text-sm">Monthly passive income</p>
            <p className="font-bold text-2xl text-gray-800">${earnings.monthly.toFixed(2)}</p>
            <div className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>3.2% from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-violet-400 font-medium text-lg flex items-center">
              <BoxIcon className="h-5 w-5 mr-2" />
              Active Assets
            </h3>
            <p className="text-gray-600 text-sm">Currently monetized</p>
            <p className="font-bold text-2xl text-gray-800">{activeAssets} / {totalPotentialAssets}</p>
            <div className="text-sm text-gray-500">
              {((activeAssets / totalPotentialAssets) * 100).toFixed(0)}% utilization
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-violet-400 font-medium text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Actions
            </h3>
            <p className="text-gray-600 text-sm">Tasks requiring attention</p>
            <p className="font-bold text-2xl text-gray-800">{pendingActions}</p>
            <div className="text-sm text-gray-500">
              Review in your dashboard
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
