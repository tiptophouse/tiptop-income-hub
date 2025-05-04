
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getCachedModels, CachedModel } from '@/utils/modelCache';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModelGalleryProps {
  onSelectModel?: (model: any) => void;
  showControls?: boolean;
}

const ModelGallery: React.FC<ModelGalleryProps> = ({ 
  onSelectModel,
  showControls = true
}) => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Load cached models on component mount
    loadCachedModels();
  }, []);
  
  const loadCachedModels = () => {
    try {
      setLoading(true);
      const cachedModels = getCachedModels();
      setModels(cachedModels);
    } catch (error) {
      console.error("Error loading cached models:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewModel = (model: any) => {
    if (onSelectModel) {
      onSelectModel(model);
    } else {
      window.open(model.modelUrl, '_blank');
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent" />
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No saved models found</p>
        <p className="text-sm text-gray-400 mt-2">
          Generated models will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {models.map((model) => (
        <Card key={model.jobId} className="overflow-hidden hover:shadow-md transition-shadow">
          <div 
            className="h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
            onClick={() => handleViewModel(model)}
          >
            {model.thumbnailUrl ? (
              <img 
                src={model.thumbnailUrl} 
                alt={model.address} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Eye className="h-8 w-8" />
                </div>
                <span className="text-xs mt-2">3D Model</span>
              </div>
            )}
          </div>
          
          <CardContent className="p-3">
            <h3 className="text-sm font-medium truncate" title={model.address}>
              {model.address}
            </h3>
            <p className="text-xs text-gray-500">
              Created: {formatDate(model.createdAt)}
            </p>
          </CardContent>
          
          {showControls && (
            <CardFooter className="p-2 pt-0 flex justify-end gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => handleViewModel(model)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ModelGallery;
