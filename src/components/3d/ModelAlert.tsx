
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ModelAlertProps {
  onDismiss: () => void;
}

const ModelAlert: React.FC<ModelAlertProps> = ({ onDismiss }) => {
  console.log("[ModelAlert] Displaying error alert");
  
  return (
    <Alert variant="destructive" className="mb-4 border-2 border-red-300">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-xs sm:text-sm">Failed to generate 3D model. Using demo model instead.</span>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ModelAlert;
