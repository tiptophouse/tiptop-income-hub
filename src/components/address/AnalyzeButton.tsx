
import React from 'react';
import { Button } from '@/components/ui/button';

interface AnalyzeButtonProps {
  isMobile?: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ isMobile = false }) => {
  return (
    <Button 
      type="submit" 
      className={`
        bg-tiptop-accent hover:bg-tiptop-accent/90 
        ${isMobile ? 'px-4 py-2 text-xs' : 'px-4 sm:px-6 py-3 text-xs sm:text-sm'} 
        h-auto rounded-full font-medium shadow-lg transition-all duration-300 
        hover:shadow-xl text-[#FFFDED] whitespace-nowrap
      `}
    >
      {isMobile ? 'Analyze' : 'Analyze Now'}
    </Button>
  );
};

export default AnalyzeButton;
