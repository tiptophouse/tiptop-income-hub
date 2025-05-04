
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideWand2, Smartphone, Laptop, Server } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelQualitySelectorProps {
  onQualityChange: (quality: 'low' | 'medium' | 'high') => void;
  selectedQuality: 'low' | 'medium' | 'high';
}

const ModelQualitySelector: React.FC<ModelQualitySelectorProps> = ({
  onQualityChange,
  selectedQuality = 'medium'
}) => {
  const isMobile = useIsMobile();
  
  const qualities = [
    { 
      id: 'low', 
      label: 'Mobile', 
      icon: <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />, 
      description: 'Lower detail, faster loading'
    },
    { 
      id: 'medium', 
      label: 'Standard', 
      icon: <Laptop className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />, 
      description: 'Balanced detail and performance'
    },
    { 
      id: 'high', 
      label: 'High Detail', 
      icon: <Server className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />, 
      description: 'Maximum detail, slower loading'
    }
  ];

  return (
    <div className="mb-3">
      <div className="flex items-center mb-2 gap-1">
        <LucideWand2 className="h-3 w-3 sm:h-4 sm:w-4 text-tiptop-accent" />
        <span className="text-xs sm:text-sm font-medium">Model Quality</span>
      </div>
      
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {qualities.map((quality) => (
          <Button
            key={quality.id}
            variant={selectedQuality === quality.id ? "secondary" : "outline"}
            size={isMobile ? "sm" : "default"}
            className={`px-2 py-1 sm:px-3 sm:py-2 h-auto text-xs sm:text-sm ${
              selectedQuality === quality.id 
                ? "bg-tiptop-accent text-white hover:bg-tiptop-hover" 
                : "text-gray-600"
            }`}
            onClick={() => onQualityChange(quality.id as 'low' | 'medium' | 'high')}
          >
            <div className="flex flex-col items-center">
              {quality.icon}
              <span className="mt-1">{quality.label}</span>
            </div>
          </Button>
        ))}
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
        {qualities.find(q => q.id === selectedQuality)?.description}
      </p>
    </div>
  );
};

export default ModelQualitySelector;
