
import React from 'react';
import { Satellite, Map as MapIcon, ZoomIn, RotateView, Move3d } from 'lucide-react';
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
      <div className="flex gap-2 justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-black/70 text-white shadow-md hover:bg-black/80"
          onClick={onToggleView}
        >
          {view === 'satellite' ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-black/70 text-white shadow-md hover:bg-black/80"
          onClick={onGenerate3DModel}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="animate-spin h-4 w-4 border-t-2 border-tiptop-accent rounded-full" />
          ) : (
            <span className="flex items-center gap-1">
              <ZoomIn className="h-4 w-4" />
              <span className="text-xs">Extract 3D</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
