
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, RefreshCw, Download } from "lucide-react";

interface ModelViewerControlsProps {
  onRotate: () => void;
  onRefresh: () => void;
  onDownload: () => void;
}

const ModelViewerControls: React.FC<ModelViewerControlsProps> = ({
  onRotate,
  onRefresh,
  onDownload,
}) => (
  <div className="absolute bottom-2 right-2 flex gap-2">
    <Button 
      size="sm"
      variant="secondary"
      className="bg-black/70 text-white hover:bg-black/80"
      onClick={onRotate}
    >
      <RotateCw className="h-4 w-4" />
    </Button>

    <Button 
      size="sm"
      variant="secondary"
      className="bg-black/70 text-white hover:bg-black/80"
      onClick={onRefresh}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>

    <Button 
      size="sm"
      variant="secondary"
      className="bg-black/70 text-white hover:bg-black/80"
      onClick={onDownload}
    >
      <Download className="h-4 w-4" />
    </Button>
  </div>
);

export default ModelViewerControls;

