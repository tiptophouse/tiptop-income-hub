
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Property3DModel from './Property3DModel';

interface DashboardPropertyViewProps {
  address: string;
  jobId: string | null;
  description: string;
}

const DashboardPropertyView = ({ address, jobId, description }: DashboardPropertyViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Property 3D View</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <Property3DModel 
            jobId={jobId} 
            address={address} 
            className="h-full w-full"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPropertyView;
