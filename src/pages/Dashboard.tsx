
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import { toast } from '@/components/ui/use-toast';
import { useModelGeneration } from '@/hooks/useModelGeneration';
import { startPeriodicStatusCheck } from '@/utils/api/modelStatus';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { is3DModelGenerating, handleModelGeneration } = useModelGeneration();

  useEffect(() => {
    // Start periodic status checks for any pending models
    const stopStatusCheck = startPeriodicStatusCheck();
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email || 'User');
          setPropertyAddress(user.user_metadata?.propertyAddress || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    
    // Clean up the interval when component unmounts
    return () => {
      stopStatusCheck();
    };
  }, []);

  const handleAddressSubmit = async (address: string) => {
    try {
      setIsLoading(true);
      
      // Update property address in UI
      setPropertyAddress(address);
      
      // Save address to user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { 
            propertyAddress: address 
          }
        });
        
        toast({
          title: "Address Updated",
          description: "Your property address has been saved.",
        });
        
        // Generate 3D model for the property
        await handleModelGeneration(null, address);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <DashboardOverview 
          userName={userName} 
          earnings={{
            daily: 12.67,
            monthly: 380.00,
            yearly: 4560.00
          }}
          activeAssets={5}
          totalPotentialAssets={9}
          pendingActions={3}
          propertyAddress={propertyAddress}
          onAddressSubmit={handleAddressSubmit}
          is3DModelGenerating={is3DModelGenerating}
          aiRevenueDescription="Your assets are generating revenue at optimal levels. Solar panels are operating at 94% efficiency."
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
