
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type Requirement = {
  id?: string;
  title: string;
  description: string;
  category: string;
  is_required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  created_at?: Date;
};

const CATEGORIES = [
  'financial', 
  'property', 
  'legal', 
  'technical', 
  'insurance'
];

const AdminRequirementsList: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [newRequirement, setNewRequirement] = useState<Requirement>({
    title: '',
    description: '',
    category: 'property',
    is_required: true,
    min_value: null,
    max_value: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  useEffect(() => {
    fetchRequirements();
  }, []);
  
  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll use mock data
      setRequirements([
        {
          id: '1',
          title: 'Minimum Roof Size',
          description: 'Property must have a minimum roof size suitable for solar panels',
          category: 'property',
          is_required: true,
          min_value: 600,
          created_at: new Date()
        },
        {
          id: '2',
          title: 'Internet Speed',
          description: 'Property must have high-speed internet connection',
          category: 'technical',
          is_required: true,
          min_value: 100,
          created_at: new Date()
        },
        {
          id: '3',
          title: 'Property Insurance',
          description: 'Property must have valid insurance coverage',
          category: 'insurance',
          is_required: true,
          created_at: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load qualification requirements',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddRequirement = async () => {
    if (!newRequirement.title || !newRequirement.category) {
      toast({
        title: 'Validation Error',
        description: 'Title and category are required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // In a real app, this would save to Supabase
      const newId = `new-${Date.now()}`;
      const requirementToAdd = {
        ...newRequirement,
        id: newId,
        created_at: new Date()
      };
      
      setRequirements([...requirements, requirementToAdd]);
      setNewRequirement({
        title: '',
        description: '',
        category: 'property',
        is_required: true,
        min_value: null,
        max_value: null
      });
      setIsAdding(false);
      
      toast({
        title: 'Success',
        description: 'Requirement added successfully',
      });
    } catch (error) {
      console.error('Error adding requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to add requirement',
        variant: 'destructive'
      });
    }
  };
  
  const handleUpdateRequirement = async (requirement: Requirement) => {
    if (!requirement.id) return;
    
    try {
      // In a real app, this would update in Supabase
      const updatedRequirements = requirements.map(r => 
        r.id === requirement.id ? requirement : r
      );
      
      setRequirements(updatedRequirements);
      setIsEditing(null);
      
      toast({
        title: 'Success',
        description: 'Requirement updated successfully',
      });
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to update requirement',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteRequirement = async (id: string) => {
    try {
      // In a real app, this would delete from Supabase
      setRequirements(requirements.filter(r => r.id !== id));
      
      toast({
        title: 'Success',
        description: 'Requirement deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete requirement',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Qualification Requirements</CardTitle>
          <CardDescription>
            Manage property qualification requirements for partners
          </CardDescription>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Requirement
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <Card className="mb-6 border-2 border-dashed">
            <CardHeader>
              <CardTitle className="text-base">New Requirement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newRequirement.title}
                    onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newRequirement.category}
                    onValueChange={(val) => setNewRequirement({...newRequirement, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_value">Minimum Value (optional)</Label>
                  <Input
                    id="min_value"
                    type="number"
                    value={newRequirement.min_value?.toString() || ''}
                    onChange={(e) => setNewRequirement({
                      ...newRequirement, 
                      min_value: e.target.value ? Number(e.target.value) : null
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_value">Maximum Value (optional)</Label>
                  <Input
                    id="max_value"
                    type="number"
                    value={newRequirement.max_value?.toString() || ''}
                    onChange={(e) => setNewRequirement({
                      ...newRequirement, 
                      max_value: e.target.value ? Number(e.target.value) : null
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRequirement.is_required}
                  onCheckedChange={(checked) => setNewRequirement({...newRequirement, is_required: checked})}
                />
                <Label>Required</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAddRequirement}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Requirement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : requirements.length > 0 ? (
          <div className="space-y-4">
            {requirements.map((requirement) => (
              <Card key={requirement.id} className="bg-muted/20">
                <CardContent className="p-4">
                  {isEditing === requirement.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-title-${requirement.id}`}>Title</Label>
                          <Input
                            id={`edit-title-${requirement.id}`}
                            value={requirement.title}
                            onChange={(e) => {
                              const updated = [...requirements];
                              const index = updated.findIndex(r => r.id === requirement.id);
                              updated[index] = {...updated[index], title: e.target.value};
                              setRequirements(updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-category-${requirement.id}`}>Category</Label>
                          <Select 
                            value={requirement.category}
                            onValueChange={(val) => {
                              const updated = [...requirements];
                              const index = updated.findIndex(r => r.id === requirement.id);
                              updated[index] = {...updated[index], category: val};
                              setRequirements(updated);
                            }}
                          >
                            <SelectTrigger id={`edit-category-${requirement.id}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-description-${requirement.id}`}>Description</Label>
                        <Textarea
                          id={`edit-description-${requirement.id}`}
                          value={requirement.description}
                          onChange={(e) => {
                            const updated = [...requirements];
                            const index = updated.findIndex(r => r.id === requirement.id);
                            updated[index] = {...updated[index], description: e.target.value};
                            setRequirements(updated);
                          }}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                        <Button onClick={() => handleUpdateRequirement(requirement)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{requirement.title}</h4>
                          <p className="text-sm text-muted-foreground">{requirement.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setIsEditing(requirement.id)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteRequirement(requirement.id!)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {requirement.category.charAt(0).toUpperCase() + requirement.category.slice(1)}
                        </span>
                        {requirement.is_required && (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">Required</span>
                        )}
                        {(requirement.min_value !== null || requirement.max_value !== null) && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {requirement.min_value !== null && `Min: ${requirement.min_value}`}
                            {requirement.min_value !== null && requirement.max_value !== null && ' - '}
                            {requirement.max_value !== null && `Max: ${requirement.max_value}`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No requirements found. Add a new requirement to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRequirementsList;
