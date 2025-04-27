
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PropertyOverviewCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Property Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        This beautiful property features a spacious rooftop perfect for solar panel installation. 
        The building's orientation and roof angle provide optimal conditions for solar energy generation. 
        Current estimates suggest potential for significant energy production and cost savings.
      </p>
      <div className="mt-4">
        <h4 className="font-medium">Key Features:</h4>
        <ul className="list-disc list-inside text-muted-foreground mt-2">
          <li>1,200 sq ft rooftop area</li>
          <li>Southern exposure</li>
          <li>30° roof pitch - optimal for solar panels</li>
          <li>No surrounding tall buildings causing shade</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default PropertyOverviewCard;

