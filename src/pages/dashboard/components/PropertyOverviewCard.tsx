
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyOverviewCardProps {
  propertyAddress: string;
}

const PropertyOverviewCard = ({ propertyAddress }: PropertyOverviewCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
          Property Overview
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {propertyAddress || "Add your property address to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-3 pt-0' : 'pt-0'}>
        {propertyAddress && (
          <p className="text-sm text-muted-foreground">
            This beautiful property is located at {propertyAddress}. The home features modern amenities
            and excellent potential for various revenue streams including solar panels,
            high-speed internet sharing, and smart home capabilities.
          </p>
        )}
        {!propertyAddress && (
          <p className="text-sm text-muted-foreground">
            Add your property address to see a detailed overview of your property and its monetization potential.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
