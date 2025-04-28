
import { useState, useEffect } from 'react';

export const use3DModelControls = (
  initialRotation: boolean = false,
  initialZoom: number = 105
) => {
  const [rotateModel, setRotateModel] = useState(initialRotation);
  const [modelRotation, setModelRotation] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  useEffect(() => {
    if (!rotateModel) return;
    
    const rotationInterval = setInterval(() => {
      setModelRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, [rotateModel]);

  return {
    rotateModel,
    setRotateModel,
    modelRotation,
    selectedAsset,
    setSelectedAsset,
    zoomLevel,
    setZoomLevel
  };
};
