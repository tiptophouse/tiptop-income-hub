
import React from 'react';
import { Building, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PropertyOverviewCardProps {
  propertyAddress: string;
}

const PropertyOverviewCard: React.FC<PropertyOverviewCardProps> = ({ propertyAddress }) => {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center text-violet-400 mb-1">
          <Home className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          Property details and features
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {propertyAddress ? (
          <div className="space-y-4">
            <p className="font-medium text-gray-800">{propertyAddress}</p>
            <p className="text-gray-600">
              The property features a rooftop with good solar exposure, a rentable garden area, 
              stable internet for bandwidth sharing, and available parking space. Nearby, neighbors 
              are actively renting parking and garden spaces, showing strong local demand.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Add your property address to get started</p>
            <Button variant="outline" className="border-violet-300 text-violet-600 hover:bg-violet-50">
              Add Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
