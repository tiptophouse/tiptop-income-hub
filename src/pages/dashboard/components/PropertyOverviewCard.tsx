
import React, { useState } from 'react';
import { Building, Home, Plus, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyOverviewCardProps {
  propertyAddress: string;
  onAddressSubmit?: (address: string) => void;
  is3DModelGenerating?: boolean;
}

const PropertyOverviewCard: React.FC<PropertyOverviewCardProps> = ({ 
  propertyAddress, 
  onAddressSubmit,
  is3DModelGenerating = false
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() && onAddressSubmit) {
      onAddressSubmit(address.trim());
      setDialogOpen(false);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center text-violet-400 mb-1">
          <Home className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          Property details and features
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {propertyAddress ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-400" />
              <p className="font-medium text-gray-800">{propertyAddress}</p>
            </div>
            <p className="text-gray-600">
              The property features a rooftop with good solar exposure, a rentable garden area, 
              stable internet for bandwidth sharing, and available parking space. Nearby, neighbors 
              are actively renting parking and garden spaces, showing strong local demand.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Add your property address to get started</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-violet-300 text-violet-600 hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Your Property Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input 
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full property address"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={is3DModelGenerating || !address.trim()}
                    >
                      {is3DModelGenerating ? "Processing..." : "Submit Address"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
