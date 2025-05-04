
import React, { useState } from 'react';
import { MapPin, Home, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface PropertyOverviewCardProps {
  propertyAddress: string;
  onAddressSubmit?: (address: string) => void;
  is3DModelGenerating?: boolean;
  propertyInsights?: any;
}

const PropertyOverviewCard: React.FC<PropertyOverviewCardProps> = ({
  propertyAddress,
  onAddressSubmit,
  is3DModelGenerating = false,
  propertyInsights = null
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && onAddressSubmit) {
      onAddressSubmit(address);
      setIsDialogOpen(false);
    }
  };

  const getPropertyType = () => {
    if (propertyInsights?.property_type) {
      return propertyInsights.property_type.charAt(0).toUpperCase() + propertyInsights.property_type.slice(1);
    }
    return "Residential Building";
  };

  return (
    <Card className="glass shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Home className="h-5 w-5" /> Property Overview
        </CardTitle>
        <CardDescription>Quick snapshot of your property details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{propertyAddress || "No address set"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Type: {getPropertyType()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gray-500" />
          <span>Potential Assets: {propertyInsights ? propertyInsights.amenities?.length : 'Loading...'}</span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-center">
              Update Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Property Address</DialogTitle>
              <DialogDescription>
                Enter the new address for your property.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-right">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="col-span-3 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <Button type="submit" className="w-full justify-center">
                Update Address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {is3DModelGenerating && (
          <div className="text-center text-sm text-gray-500">
            Generating 3D Model... This may take a few minutes.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
