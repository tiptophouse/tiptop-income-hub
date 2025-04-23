
import React from 'react';
import { Satellite, Map as MapIcon, ZoomIn, RotateCw, Box, Camera3d, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  view: 'satellite' | 'map';
  onToggleView: () => void;
  onGenerate3DModel: () => void;
  isGenerating: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  view,
  onToggleView,
  onGenerate3DModel,
  isGenerating
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button
        variant="default"
        size="sm"
        className="bg-tiptop-accent text-white shadow-md hover:bg-tiptop-accent/90 flex items-center gap-1.5"
        onClick={onGenerate3DModel}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating 3D...</span>
          </>
        ) : (
          <>
            <Camera3d className="h-4 w-4" />
            <span>Generate 3D Model</span>
          </>
        )}
      </Button>
      
      <div className="flex gap-2 justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-black/70 text-white shadow-md hover:bg-black/80"
          onClick={onToggleView}
        >
          {view === 'satellite' ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
