
import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Property3DModelFailedProps {
  onRetry: () => void;
  address: string;
  className?: string;
  error?: string;
}

const Property3DModelFailed: React.FC<Property3DModelFailedProps> = ({
  onRetry,
  address,
  className,
  error
}) => {
  return (
    <Card className={`shadow-md ${className}`}>
      <CardContent className="pt-6 pb-6 space-y-4">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3D Model Generation Failed</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              We couldn't generate a 3D model for {address}. {error || 'There was an issue with processing your property data.'}
            </p>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button onClick={onRetry} className="bg-tiptop-accent hover:bg-tiptop-hover flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retry Generation
            </Button>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            <p>
              Powered by <a href="https://meshy.ai" target="_blank" rel="noopener noreferrer" className="text-tiptop-accent hover:underline font-medium">meshy.ai</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Property3DModelFailed;
