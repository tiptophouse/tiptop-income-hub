
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ModelViewerAdvancedControlsProps {
  zoomLevel: number;
  onZoomChange: (value: number[]) => void;
  backgroundColor: string;
  onBackgroundChange: (color: string) => void;
}

const ModelViewerAdvancedControls: React.FC<ModelViewerAdvancedControlsProps> = ({
  zoomLevel,
  onZoomChange,
  backgroundColor,
  onBackgroundChange,
}) => {
  const backgroundOptions = ["#f5f5f5", "#1a1a1a", "#e0f2fe", "#f0fdf4", "#fffbeb"];

  return (
    <div className="mb-4 space-y-4 p-2 sm:p-4 bg-gray-50 rounded-md">
      <div>
        <label className="text-xs sm:text-sm font-medium block mb-2">Zoom Level</label>
        <Slider
          value={[zoomLevel]}
          min={50}
          max={200}
          step={5}
          onValueChange={onZoomChange}
        />
      </div>
      <div>
        <label className="text-xs sm:text-sm font-medium block mb-2">Background Color</label>
        <div className="flex flex-wrap gap-2">
          {backgroundOptions.map((color) => (
            <div 
              key={color}
              className={`w-6 h-6 rounded-full cursor-pointer ${backgroundColor === color ? 'ring-2 ring-tiptop-accent' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onBackgroundChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelViewerAdvancedControls;
