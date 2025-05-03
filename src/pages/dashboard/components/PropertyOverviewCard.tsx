
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Edit2, Loader2 } from 'lucide-react';

interface PropertyOverviewCardProps {
  propertyAddress: string;
  onAddressSubmit: (address: string) => void;
  is3DModelGenerating?: boolean;
  propertyType?: string;
}

const PropertyOverviewCard: React.FC<PropertyOverviewCardProps> = ({
  propertyAddress,
  onAddressSubmit,
  is3DModelGenerating = false,
  propertyType = "Residential Property"
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(propertyAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressSubmit(editValue);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Home className="text-primary h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Property Overview</h3>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Enter new address"
              className="w-full"
            />
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={is3DModelGenerating}
                className="w-full"
              >
                {is3DModelGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(propertyAddress);
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium truncate mr-2" title={propertyAddress}>
                {propertyAddress || "No address set"}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                disabled={is3DModelGenerating}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">{propertyType}</div>
            
            {is3DModelGenerating && (
              <div className="mt-3 flex items-center text-xs text-amber-600">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating 3D model...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
