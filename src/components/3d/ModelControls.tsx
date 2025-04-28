
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, EyeOff } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface ModelControlsProps {
  showHotspots: boolean;
  onHotspotsToggle: (value: boolean) => void;
  onDownload: () => void;
  jobId: string;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  showHotspots,
  onHotspotsToggle,
  onDownload,
  jobId
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="hotspots-toggle"
            checked={showHotspots}
            onCheckedChange={onHotspotsToggle}
          />
          <Label htmlFor="hotspots-toggle" className="text-xs sm:text-sm cursor-pointer">
            {showHotspots ? 
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Show monetizable areas</span> : 
              <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Hide monetizable areas</span>
            }
          </Label>
        </div>
        
        <p className="text-xs text-muted-foreground">
          3D Model ID: #{jobId.substring(0, 6)}
        </p>
      </div>
      
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={onDownload}
        className="w-full text-xs sm:text-sm"
      >
        <FileDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        Download 3D Model
      </Button>
    </>
  );
};

export default ModelControls;
