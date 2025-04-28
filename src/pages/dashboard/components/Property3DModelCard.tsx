
import React from 'react';
import { Building, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Property3DModelCard = () => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Interactive 3D view of your property
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-3 pt-0' : 'pt-0'}>
        <div className="w-full overflow-hidden rounded-lg">
          <img 
            src="/lovable-uploads/bc1d5ec4-4a58-4238-85d9-66e0d999e65a.png"
            alt="Property 3D Model"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24"
          >
            {isPlaying ? (
              <><Pause className="h-4 w-4 mr-2" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Property3DModelCard;
