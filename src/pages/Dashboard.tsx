
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import AddressModelSearch from '@/components/dashboard/AddressModelSearch';
import { toast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
  }, []);

  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
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
          aiRevenueDescription="Your assets are generating revenue at optimal levels. Solar panels are operating at 94% efficiency."
        />
        
        {/* New Address Model Search Component */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generate New Property Model</h2>
          <AddressModelSearch />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
