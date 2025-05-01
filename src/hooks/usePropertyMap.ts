
import { useState, useRef } from 'react';
import { useModelGeneration } from './useModelGeneration';

export const usePropertyMap = (address: string) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [weatherTemp] = useState<string>("26°");
  const [currentZoomLevel, setCurrentZoomLevel] = useState(12);
  const hasExecutedZoom = useRef(false);
  const screenshotCaptured = useRef(false);
  
  // Import the model generation hook
  const { is3DModelGenerating, handleModelGeneration: originalHandleModelGeneration } = useModelGeneration();
  
  // Wrap the handleModelGeneration to include the address
  const handleModelGeneration = async (mapContainerRef: React.RefObject<HTMLDivElement>, webhookUrl?: string) => {
    return originalHandleModelGeneration(mapContainerRef, address, webhookUrl);
  };

  return {
    view,
    setView,
    is3DModelGenerating,
    isAnalyzing,
    setIsAnalyzing,
    weatherTemp,
    currentZoomLevel,
    setCurrentZoomLevel,
    hasExecutedZoom,
    screenshotCaptured,
    handleModelGeneration,
  };
};
