
import React from 'react';
import { Satellite, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  view: 'satellite' | 'map';
  onToggleView: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  view,
  onToggleView
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 justify-end">
      <Button 
        variant="secondary" 
        size="sm" 
        className="bg-black/70 text-white shadow-md hover:bg-black/80"
        onClick={onToggleView}
      >
        {view === 'satellite' ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default MapControls;
