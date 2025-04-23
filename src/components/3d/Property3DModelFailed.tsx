
import React from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onRetry: () => void;
}
const Property3DModelFailed: React.FC<Props> = ({ onRetry }) => (
  <div className="text-center py-8">
    <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium mb-2">Model Generation Failed</h3>
    <p className="text-sm text-muted-foreground mb-4">
      We couldn't generate a 3D model for this property.
    </p>
    <Button variant="outline" onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

export default Property3DModelFailed;
