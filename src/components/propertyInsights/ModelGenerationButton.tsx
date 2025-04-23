
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

interface ModelGenerationButtonProps {
  generating3DModel: boolean;
  handle3DModelGeneration: () => void;
}

const ModelGenerationButton: React.FC<ModelGenerationButtonProps> = ({
  generating3DModel,
  handle3DModelGeneration
}) => (
  <Button 
    variant="outline" 
    className="w-full mt-8 rounded-full border-2 border-[#8B5CF6]/70 text-[#8B5CF6] font-extrabold hover:bg-[#8B5CF6]/10 hover:scale-102 shadow-lg transition-all duration-300 py-5 text-lg"
    onClick={handle3DModelGeneration}
    disabled={generating3DModel}
    aria-label="Generate 3D property model"
  >
    <Building className="mr-2 h-5 w-5" />
    {generating3DModel ? "Generating 3D Model..." : "Generate 3D Property Model"}
  </Button>
);

export default ModelGenerationButton;
