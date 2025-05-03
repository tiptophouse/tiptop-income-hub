
import React from 'react';
import { Layers, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface StatisticsCardsProps {
  activeAssets: number;
  totalPotentialAssets: number;
  pendingActions: number;
  earnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  activeAssets,
  totalPotentialAssets,
  pendingActions,
  earnings
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Layers className="text-blue-500 h-4 w-4 mr-1" />
              <span className="text-sm font-medium text-muted-foreground">Active Assets</span>
            </div>
            <div className="text-xl font-medium">{activeAssets}</div>
            <div className="text-xs text-muted-foreground">of {totalPotentialAssets} potential</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Activity className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-sm font-medium text-muted-foreground">Monthly</span>
            </div>
            <div className="text-xl font-medium">${earnings.monthly}</div>
            <div className="text-xs text-muted-foreground">${earnings.yearly} annual</div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <AlertCircle className="text-amber-500 h-4 w-4 mr-1" />
              <span className="text-sm font-medium text-muted-foreground">Actions</span>
            </div>
            <div className="text-xl font-medium">{pendingActions}</div>
            <div className="text-xs text-muted-foreground">items need attention</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
