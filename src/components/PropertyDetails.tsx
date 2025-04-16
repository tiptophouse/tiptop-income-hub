
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Building, Home, Ruler, Calendar, Droplets } from 'lucide-react';

interface PropertyDetailsProps {
  location: { lat: number; lng: number } | null;
  propertyDetails: any | null;
  createStreetView: (container: HTMLElement, location: { lat: number; lng: number }) => any | null;
  weatherData: any | null;
  isLoading: boolean;
  className?: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  location,
  propertyDetails,
  createStreetView,
  weatherData,
  isLoading,
  className
}) => {
  const streetViewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (streetViewRef.current && location && createStreetView) {
      createStreetView(streetViewRef.current, location);
    }
  }, [streetViewRef, location, createStreetView]);

  if (!location) return null;

  return (
    <Card className={`${className} shadow-md transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property Details
        </CardTitle>
        <CardDescription>Enhanced analysis of your property</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Street View */}
        <div 
          ref={streetViewRef} 
          className="w-full h-40 rounded-md overflow-hidden border border-gray-200"
        >
          {!location && <Skeleton className="h-full w-full" />}
        </div>
        
        <Separator />
        
        {/* Property Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Home className="h-4 w-4 text-tiptop-accent" />
            Property Specifications
          </h3>
          
          {isLoading || !propertyDetails ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Ruler className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{propertyDetails.squareFootage} sq ft</span>
              </div>
              <div>
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium ml-1">{propertyDetails.bedrooms}</span>
              </div>
              <div>
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium ml-1">{propertyDetails.bathrooms}</span>
              </div>
              <div>
                <span className="text-gray-600">Lot Size:</span>
                <span className="font-medium ml-1">{propertyDetails.lotSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">Built:</span>
                <span className="font-medium">{propertyDetails.yearBuilt}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Weather Info */}
        {weatherData && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4 text-tiptop-accent" />
                Local Weather Conditions
              </h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">{weatherData.temperature}°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conditions:</span>
                  <span className="font-medium">{weatherData.conditions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Sunshine:</span>
                  <span className="font-medium">{weatherData.annualSunshine} days</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
